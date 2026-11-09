"""Sintetizador 8-bit do Masmorra do Corvo Rei: pulso, triângulo e ruído, com eco."""
import numpy as np, re, subprocess, sys, os
SR = 32000
NOTE = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def freq(n):
    m = re.match(r'([A-G])([#b]?)(\d)', n); k = NOTE[m[1]] + (1 if m[2]=='#' else -1 if m[2]=='b' else 0)
    return 440 * 2 ** ((k + 12*(int(m[3])+1) - 69) / 12)
def midi(n):
    m = re.match(r'([A-G])([#b]?)(\d)', n); return NOTE[m[1]] + (1 if m[2]=='#' else -1 if m[2]=='b' else 0) + 12*(int(m[3])+1)
def mname(x):
    return ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][x%12] + str(x//12-1)
QUAL = {'':[0,4,7],'m':[0,3,7],'dim':[0,3,6],'7':[0,4,7,10],'m7':[0,3,7,10],'maj7':[0,4,7,11],'sus':[0,5,7]}
def chord(c, octv=3):
    m = re.match(r'([A-G][#b]?)(.*)', c); root = midi(m[1] + str(octv)); return [root + i for i in QUAL[m[2]]]
def env(n, a=.005, d=.08, s=.6, r=.06):
    t = np.arange(n) / SR; e = np.ones(n) * s
    na, nd, nr = int(a*SR), int(d*SR), int(r*SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nd: e[na:na+nd] = np.linspace(1, s, len(e[na:na+nd]))
    if nr and n > nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def osc(kind, f, n, duty=.5, vib=0):
    t = np.arange(n) / SR
    ph = f * t + (vib * np.sin(2*np.pi*5.5*t) * (t > .12) / 5.5 if vib else 0)
    p = ph % 1
    if kind == 'pulse': return np.where(p < duty, 1., -1.)
    if kind == 'tri': return 4 * np.abs(p - .5) - 1
    if kind == 'saw': return 2 * p - 1
    return np.sin(2*np.pi*ph)
def noise(n, color=1.):
    x = np.random.default_rng(7).uniform(-1, 1, n)
    if color < 1:
        y = np.zeros(n); a = color
        for i in range(1, n): y[i] = y[i-1] + a * (x[i] - y[i-1])
        x = y / (np.max(np.abs(y)) + 1e-9)
    return x
class Song:
    def __init__(s, step, bar=16):
        s.step, s.bar, s.L, s.R = step, bar, [], []
        s.buf = {}
    def _put(s, ch, t0, sig, pan=0.):
        s.buf.setdefault(ch, []).append((int(t0*SR), sig, pan))
    def note(s, ch, t, n, dur, kind='pulse', duty=.5, vol=.25, vib=0, a=.005, d=.08, sus=.6, r=.06, pan=0.):
        N = int(dur*SR)
        if N <= 0: return
        sig = osc(kind, freq(n), N, duty, vib) * env(N, a, d, sus, r) * vol
        s._put(ch, t, sig, pan)
    def drum(s, t, kind, vol=.3):
        if kind == 'k':
            N = int(.18*SR); tt = np.arange(N)/SR; f = 140*np.exp(-tt*22)+45
            sig = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*16) * vol * 1.4
        elif kind == 's':
            N = int(.14*SR); tt = np.arange(N)/SR
            sig = (noise(N)*.8 + np.sin(2*np.pi*190*tt)*.4) * np.exp(-tt*24) * vol
        elif kind == 'h':
            N = int(.04*SR); sig = noise(N) * np.exp(-np.arange(N)/SR*90) * vol * .45
        elif kind == 'c':
            N = int(1.2*SR); sig = noise(N) * np.exp(-np.arange(N)/SR*3.2) * vol * .5
        elif kind == 'a':  # bigorna
            N = int(.7*SR); tt = np.arange(N)/SR
            sig = (np.sin(2*np.pi*1180*tt)+.6*np.sin(2*np.pi*2950*tt)+.3*np.sin(2*np.pi*4410*tt)) * np.exp(-tt*7) * vol*.45 + noise(N)*np.exp(-tt*60)*vol*.4
        elif kind == 't':  # tique (catacumba)
            N = int(.05*SR); tt = np.arange(N)/SR; sig = np.sin(2*np.pi*1600*tt)*np.exp(-tt*80)*vol*.5
        else: return
        s._put('dr', t, sig)
    def render(s, total, echo=(.27, .28), lp=.55):
        N = int((total + 2.5) * SR); L = np.zeros(N); R = np.zeros(N)
        for ch, items in s.buf.items():
            for i0, sig, pan in items:
                e = min(N, i0 + len(sig)); seg = sig[:e-i0]
                L[i0:e] += seg * (1 - max(0, pan)); R[i0:e] += seg * (1 + min(0, pan))
        k = np.array([1, 3, 4, 3, 1], float); k /= k.sum()  # suaviza o chiado do pulso
        L = np.convolve(L, k, 'same'); R = np.convolve(R, k, 'same')
        dl, fb = int(echo[0]*SR), echo[1]
        for X, off in ((L, 0), (R, int(.021*SR))):
            Y = X.copy()
            for k in range(1, 5):
                sh = dl*k + off
                if sh < N: Y[sh:] += X[:N-sh] * (fb ** k)
            X[:] = Y
        m = max(np.max(np.abs(L)), np.max(np.abs(R)), 1e-9); g = .92 / m
        st = np.stack([L*g, R*g], 1)
        return st
def parse_mel(txt):
    out = []
    for tok in txt.split():
        n, d = tok.split('/'); out.append((None if n == '-' else n, int(d)))
    return out
def oct_shift(n, k):
    return mname(midi(n) + 12*k) if n else None
def write(st, path):
    pcm = (np.clip(st, -1, 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '128k', path], input=pcm, check=True)
