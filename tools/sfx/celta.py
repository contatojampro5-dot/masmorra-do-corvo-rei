"""Instrumentos celtas/medievais sintetizados: flauta, violino, gaita, harpa, alaúde, bodhrán, pandeiro."""
import numpy as np, re, subprocess, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from synth import SR, freq, midi, mname, chord, parse_mel, write
RNG = np.random.default_rng(11)
def smooth(x, n):
    if n <= 1: return x
    k = np.hanning(n + 2)[1:-1]; k /= k.sum(); return np.convolve(x, k, 'same')
def adsr(n, a, d, s, r):
    e = np.full(n, s, float); na, nd, nr = int(a*SR), int(d*SR), int(r*SR)
    na = min(na, n); e[:na] = np.linspace(0, 1, na) if na else e[:na]
    if nd: seg = e[na:na+nd]; e[na:na+nd] = np.linspace(1, s, len(seg))
    if nr and n > nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def vib(n, f, depth, rate=5.2, delay=.18):
    t = np.arange(n) / SR; amt = np.clip((t - delay) / .25, 0, 1) * depth
    return f * (1 + amt * np.sin(2*np.pi*rate*t))
def phase(fi): return np.cumsum(fi) / SR
def flute(f, n, vol):
    p = phase(vib(n, f, .006)); s = np.sin(2*np.pi*p) + .22*np.sin(4*np.pi*p) + .06*np.sin(6*np.pi*p)
    br = RNG.uniform(-1, 1, n); br = br - smooth(br, 9)
    e = adsr(n, .035, .1, .82, .07); chiff = np.exp(-np.arange(n)/SR*30)
    return (s * e + br * (.05*e + .25*chiff)) * vol
def fiddle(f, n, vol):
    p = phase(vib(n, f, .008, 5.8, .14)); s = 2*(p % 1) - 1
    s = smooth(s, max(3, int(SR / f / 5)) | 1) * 1.6
    return s * adsr(n, .03, .08, .85, .06) * vol
def pipes(f, n, vol):
    p = phase(vib(n, f, .0025, 6, .1)); s = np.where((p % 1) < .32, 1., -1.) * .6 + (2*(p % 1) - 1) * .5
    s = smooth(s, 5)
    return s * adsr(n, .012, .05, .9, .03) * vol
def pluck(f, n, vol, bright=.55, decay=.996):
    L = max(2, int(SR / f)); y = np.zeros(n + L)
    b = RNG.uniform(-1, 1, L); b = bright * b + (1 - bright) * smooth(b, 5); y[:L] = b
    for st in range(L, n + L, L):
        seg = y[st-L:st]; nxt = .5 * (seg + np.roll(seg, -1)) * decay
        e = min(st + L, n + L); y[st:e] = nxt[:e-st]
    s = y[L:L+n]; s *= adsr(n, .001, .0, 1., .05)
    return s * vol
def drone(f, n, vol):
    p1, p2 = phase(np.full(n, f)), phase(np.full(n, f * 1.5))
    s = smooth((2*(p1 % 1) - 1) + .6*(2*(p2 % 1) - 1), 17)
    return s * adsr(n, .25, .0, 1., .4) * vol * (1 + .04*np.sin(2*np.pi*.3*np.arange(n)/SR))
INST = {'flute': flute, 'fiddle': fiddle, 'pipes': pipes, 'harp': lambda f, n, v: pluck(f, n, v, .5, .997), 'lute': lambda f, n, v: pluck(f, n, v, .75, .993)}
def drum(kind, vol):
    if kind == 'b':   # bodhrán grave
        N = int(.3*SR); t = np.arange(N)/SR; f = 110*np.exp(-t*9) + 58
        return (np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*11) * 1.3 + smooth(RNG.uniform(-1,1,N),7)*np.exp(-t*40)*.35) * vol
    if kind == 'bt':  # bodhrán toque leve
        N = int(.12*SR); t = np.arange(N)/SR; f = 230*np.exp(-t*14) + 150
        return (np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*26) * .6 + RNG.uniform(-1,1,N)*np.exp(-t*70)*.15) * vol
    if kind == 'tam':  # pandeiro
        N = int(.35*SR); t = np.arange(N)/SR; x = RNG.uniform(-1,1,N); x = x - smooth(x, 5)
        jing = sum(np.sin(2*np.pi*f*t) for f in (5200, 6800, 8100)) * .12
        x = smooth(x, 3); return (x * .35 + jing * .8) * np.exp(-t*16) * vol * .32
    if kind == 'a':
        N = int(.8*SR); t = np.arange(N)/SR
        return ((np.sin(2*np.pi*1180*t) + .6*np.sin(2*np.pi*2950*t) + .3*np.sin(2*np.pi*4410*t)) * np.exp(-t*6) * .45 + RNG.uniform(-1,1,N)*np.exp(-t*60)*.4) * vol
    if kind == 'gong':
        N = int(2.4*SR); t = np.arange(N)/SR
        return (sum(np.sin(2*np.pi*f*t)*g for f, g in ((96,1),(151,.6),(237,.4),(389,.25))) * np.exp(-t*1.6) + RNG.uniform(-1,1,N)*np.exp(-t*20)*.2) * vol * .5
    return np.zeros(1)
DR = {
 'jig':   {12: [('b',0),('bt',2),('bt',4),('b',6),('bt',8),('bt',10),('tam',3),('tam',9)]},
 'jigsoft': {12: [('b',0),('bt',4),('bt',6),('bt',10)]},
 'reel':  {16: [('b',0),('bt',2),('bt',4),('bt',6),('b',8),('bt',10),('bt',12),('b',14),('tam',4),('tam',12)]},
 'march': {16: [('b',0),('bt',2),('b',4),('bt',6),('b',8),('bt',10),('b',12),('bt',14),('tam',8)]},
 'war':   {16: [('b',0),('b',3),('bt',4),('tam',6),('b',8),('b',11),('bt',12),('tam',14)]},
 'air':   {16: [('b',0),('bt',8)], 12: [('b',0)]},
 'waltz': {12: [('b',0),('bt',4),('bt',8)]},
 'anvil': {16: [('a',0),('b',0),('bt',4),('a',8),('b',8),('bt',12)]},
 'none':  {16: [], 12: []},
}
SCALES = {'ionian':[0,2,4,5,7,9,11],'dorian':[0,2,3,5,7,9,10],'mixo':[0,2,4,5,7,9,10],'aeolian':[0,2,3,5,7,8,10],'harm':[0,2,3,5,7,8,11]}
def third_below(n, tonic, mode):
    m = midi(n); pcs = sorted(((tonic + s) % 12) for s in SCALES[mode]); cand = [x for x in range(m - 6, m - 2) if x % 12 in pcs]
    return mname(cand[-1] if cand else m - 4)
def step_above(n, tonic, mode):
    m = midi(n); pcs = [((tonic + s) % 12) for s in SCALES[mode]]
    for x in range(m + 1, m + 4):
        if x % 12 in pcs: return mname(x)
    return mname(m + 2)
class Mix:
    def __init__(s, total): s.N = int((total + 4) * SR); s.L = np.zeros(s.N); s.R = np.zeros(s.N)
    def add(s, t, sig, pan=0.):
        i = int(t * SR); e = min(s.N, i + len(sig)); sig = sig[:e-i]
        s.L[i:e] += sig * (1 - max(0, pan)) ; s.R[i:e] += sig * (1 + min(0, pan))
    def out(s, room=.32, echo=(.0, .0)):
        for X in (s.L, s.R):
            Y = X.copy()
            for d, g in ((.029,.5),(.043,.42),(.061,.36),(.089,.3),(.127,.24),(.181,.18),(.263,.12),(.379,.08)):
                sh = int(d * SR) + (7 if X is s.R else 0); Y[sh:] += X[:-sh] * g * room
            if echo[0]:
                sh = int(echo[0] * SR); Z = Y.copy()
                for k in range(1, 4): Z[sh*k:] += Y[:-sh*k] * echo[1]**k
                Y = Z
            X[:] = Y
        m = max(np.abs(s.L).max(), np.abs(s.R).max(), 1e-9); return np.stack([s.L, s.R], 1) * (.9 / m)
def arrange(D):
    bar = D.get('bar', 16); step = D['step'] if 'step' in D else 60 / D['bpm'] / 4
    mel = parse_mel(D['mel']); ch = D['chords']; tonic = midi(D['key'] + '4') % 12; mode = D['mode']
    passes = D.get('passes', [{}]); plen = len(ch) * bar * step; total = plen * len(passes) + (3 if D.get('final') else 0)
    M = Mix(total); lead = INST[D['lead']]; lv = D.get('leadv', .3)
    for pi, P in enumerate(passes):
        t0 = pi * plen
        if D.get('drone') and P.get('drone', True):
            M.add(t0, drone(freq(D['drone'] + '2'), int((plen + (3 if D.get('final') and pi == len(passes)-1 else 0)) * SR), D.get('dronev', .07)), 0)
        for bi, c in enumerate(ch):
            tb = t0 + bi * bar * step; cn = chord(c, 3); acc = P.get('acc', D.get('acc', 'none')); av = D.get('accv', .22)
            if acc in ('harp_arp', 'harp_up'):
                seq = [cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12, cn[2], cn[1], cn[0]] if acc == 'harp_arp' else [cn[0]-12, cn[0], cn[2], cn[0]+12, cn[1]+12, cn[2]+12, cn[0]+24, cn[2]+12]
                for k in range(0, bar, 2): M.add(tb + k*step, INST['harp'](freq(mname(seq[(k//2) % 8])), int(1.6*SR), av), (-.3 + .6*((k//2) % 8)/7))
            elif acc == 'harp_roll':
                for j, x in enumerate([cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12]): M.add(tb + j*.045, INST['harp'](freq(mname(x)), int(2.6*SR), av*.9), -.4 + j*.2)
                if bar == 16:
                    for j, x in enumerate([cn[0], cn[1], cn[2]]): M.add(tb + 8*step + j*.04, INST['harp'](freq(mname(x + 12)), int(1.8*SR), av*.6), .3)
            elif acc in ('lute_jig', 'lute_reel', 'lute_waltz'):
                hits = {'lute_jig': [(0,'b'),(4,'c'),(6,'b5'),(10,'c')], 'lute_reel': [(0,'b'),(4,'c'),(8,'b5'),(12,'c')], 'lute_waltz': [(0,'b'),(4,'c'),(8,'c')]}[acc]
                for pos, w in hits:
                    if pos >= bar: continue
                    tt = tb + pos*step
                    if w == 'b': M.add(tt, INST['lute'](freq(mname(cn[0]-12)), int(1.2*SR), av*1.2), -.15)
                    elif w == 'b5': M.add(tt, INST['lute'](freq(mname(cn[2]-12)), int(1.2*SR), av*1.1), -.15)
                    else:
                        for j, x in enumerate(cn): M.add(tt + j*.012, INST['lute'](freq(mname(x)), int(.7*SR), av*.55), .2)
            elif acc == 'fiddle_pad':
                for j, x in enumerate(cn[:3]): M.add(tb, fiddle(freq(mname(x)), int(bar*step*SR*.98), av*.18) * adsr(int(bar*step*SR*.98), .25, 0, 1, .25), (-.3, 0, .3)[j])
            dk = P.get('drums', D.get('drums', 'none'))
            if dk:
                dk = D.get('drums', 'none') if dk is True else dk
                for kind, pos in DR[dk].get(bar, []): M.add(tb + pos*step, drum(kind, D.get('drumv', .5) * (.8 if kind == 'tam' else 1)), .1 if kind == 'tam' else 0)
                if bi == 0 and P.get('gong'): M.add(tb, drum('gong', .5), 0)
        if P.get('lead', True):
            tm = t0; ok = P.get('oct', 0); li = INST[P.get('inst', D['lead'])]; k = 0
            for n, d in mel:
                if n:
                    nn = mname(midi(n) + 12*ok); dur = d*step
                    if D.get('orn', True) and d >= 4 and k % 2 == 0 and P.get('inst', D['lead']) in ('flute', 'fiddle', 'pipes'):
                        g = .045; M.add(tm, li(freq(step_above(nn, tonic, mode)), int(g*SR), lv*.8), 0); M.add(tm + g, li(freq(nn), int((dur - g)*SR*.97), lv), 0)
                    else: M.add(tm, li(freq(nn), int(dur*SR*.95), lv), 0)
                    k += 1
                tm += d*step
            if P.get('harm'):
                tm = t0; hi = INST[P.get('harminst', D.get('harminst', 'flute'))]
                for n, d in mel:
                    if n: M.add(tm, hi(freq(third_below(mname(midi(n) + 12*ok), tonic, mode)), int(d*step*SR*.95), lv*.55), -.35)
                    tm += d*step
    if D.get('final'):
        tf = len(passes) * plen; cn = chord(D['final'], 3)
        for j, x in enumerate([cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12, cn[2]+12]): M.add(tf + j*.06, INST['harp'](freq(mname(x)), int(3*SR), .24), -.4 + j*.16)
        M.add(tf, INST[D['lead']](freq(mname(cn[0] + 12 + (12 if D.get('finalup') else 0))), int(2.6*SR), lv * .9), 0)
    st = M.out(D.get('room', .32), D.get('echo', (0, 0)))
    return st[: int((total + (1.5 if D.get('final') else 0)) * SR)]
