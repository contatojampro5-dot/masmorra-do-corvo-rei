"""Efeitos sonoros do Masmorra do Corvo Rei, sintetizados em código."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from celta import *
R = np.random.default_rng(3)
def T(sec): return np.arange(int(sec*SR)) / SR
def nz(n): return R.uniform(-1, 1, n)
def bandish(x, lo, hi):  # passa-faixa simples: tira o grave e o agudo com suavizações
    a = smooth(x, max(1, int(SR/hi)) | 1); b = smooth(a, max(3, int(SR/lo)) | 1); return a - b
def sweep(f0, f1, sec, kind='sin'):
    t = T(sec); f = f0 * (f1/f0) ** (t/sec); p = np.cumsum(f)/SR
    return np.sin(2*np.pi*p) if kind == 'sin' else 2*(p % 1) - 1
def mix(*parts):
    n = max(len(x) + int(o*SR) for o, x in parts); y = np.zeros(n)
    for o, x in parts: i = int(o*SR); y[i:i+len(x)] += x
    return y
def norm(x, peak=.85): return x / (np.abs(x).max() + 1e-9) * peak
S = {}
t = T(.18); S['carta-comprar'] = bandish(nz(len(t)), 900, 7000) * np.sin(np.pi*t/.18)**2 * .9
t = T(.32); S['carta-jogar'] = mix((0, bandish(nz(len(t)), 500, 6000) * np.sin(np.pi*t/.32) * (t/.32)), (.27, drum('bt', .9)))
t = T(.45); ring = sum(np.sin(2*np.pi*f*t)*g for f, g in ((2350,1),(3720,.6),(5300,.35))) * np.exp(-t*9)
S['golpe-espada'] = mix((0, bandish(nz(int(.16*SR)), 1500, 9000) * np.linspace(0, 1, int(.16*SR))**2 * .9), (.15, ring*.5), (.15, drum('bt', .8)))
t = T(.5); S['golpe-pesado'] = mix((0, drum('b', 1.4)), (0, bandish(nz(len(t)), 150, 2500) * np.exp(-t*14) * .8), (.02, sweep(140, 45, .4) * np.exp(-T(.4)*7)))
t = T(.25); S['flecha'] = mix((0, bandish(nz(len(t)), 2500, 9000) * np.sin(np.pi*t/.25) * .7), (.23, drum('bt', 1.1)), (.23, pluck(180, int(.3*SR), .4, .3, .98)))
t = T(.9); sh = sum(np.sin(2*np.pi*f*t + k) for k, f in enumerate((880, 1320, 1760, 2640))) * .25
S['magia'] = mix((0, sweep(300, 1600, .5) * np.sin(np.pi*T(.5)/.5) * .5), (.05, sh * np.exp(-t*3.5) * np.minimum(1, t*20)), (.1, bandish(nz(len(t)), 3000, 9000) * np.exp(-t*4) * .25))
t = T(.6); cl = sum(np.sin(2*np.pi*f*t)*g for f, g in ((420,1),(640,.7),(1130,.45),(1890,.3))) * np.exp(-t*7)
S['bloqueio'] = mix((0, cl * .8), (0, nz(int(.03*SR)) * .6), (0, drum('b', .7)))
t = T(.35); S['dano-heroi'] = mix((0, drum('b', 1.2)), (0, bandish(nz(len(t)), 200, 3000) * np.exp(-t*20) * .7), (.01, sweep(320, 160, .2, 'saw') * np.exp(-T(.2)*14) * .3))
t = T(.9); S['inimigo-morre'] = mix((0, sweep(500, 70, .7, 'saw') * np.exp(-T(.7)*3) * .35), (.1, bandish(nz(len(t)), 300, 4000) * np.exp(-t*4) * .5), (0, drum('b', .8)))
coins = [ (o, sum(np.sin(2*np.pi*f*T(.35))*g for f, g in ((f0,1),(f0*2.76,.5),(f0*5.4,.25))) * np.exp(-T(.35)*14) * .45) for o, f0 in ((0,3100),(.06,3600),(.11,2900),(.19,3900),(.26,3300),(.34,4200))]
S['moedas'] = mix(*coins)
t = T(.45); S['carimbo'] = mix((0, bandish(nz(int(.08*SR)), 800, 6000) * np.linspace(0, 1, int(.08*SR)) * .4), (.08, drum('b', 1.3)), (.08, bandish(nz(len(t)), 120, 1500) * np.exp(-t*25) * .9))
t = T(1.2); sz = bandish(nz(len(t)), 4000, 11000) * np.exp(-t*3) * (1 + .5*np.sin(2*np.pi*31*t)) * .25
S['martelo-hefesto'] = mix((0, drum('a', 1.3)), (.02, sz), (.03, drum('b', .6)))
t = T(4.); cr = np.zeros(len(t))
for _ in range(70):
    i = R.integers(0, len(t) - 2000); L = R.integers(150, 900); cr[i:i+L] += nz(L) * np.exp(-np.arange(L)/SR*R.uniform(80, 300)) * R.uniform(.3, 1)
S['tocha'] = cr * .7 + smooth(nz(len(t)), 31) * 1.8 * (1 + .3*np.sin(2*np.pi*.7*t))
t = T(.09); S['botao'] = mix((0, drum('bt', .8)), (0, pluck(660, int(.09*SR), .5, .8, .97)))
gl = []
for k in range(5):
    tt = T(.12); gl.append((k*.11, np.sin(2*np.pi*np.cumsum(np.linspace(300 + k*40, 900 + k*60, len(tt)))/SR) * np.sin(np.pi*tt/.12) * .5))
S['pocao'] = mix(*gl)
S['forjar'] = mix(*[(i*.09, pluck(freq(n), int(1.2*SR), .5, .6, .997)) for i, n in enumerate(['D5', 'F#5', 'A5', 'D6', 'F#6', 'A6'])], (0, drum('a', .9)), (.5, drum('gong', .5)))
S['cura'] = mix(*[(i*.12, flute(freq(n), int(.6*SR), .35)) for i, n in enumerate(['A5', 'C#6', 'E6'])], (.1, sh[:int(.8*SR)] * np.exp(-T(.8)*4) * .4))
S['turno'] = mix((0, pipes(freq('D4'), int(.5*SR), .4)), (.02, pipes(freq('A4'), int(.5*SR), .3)), (0, drum('b', .7)))
NOMES = {'carta-comprar':'Comprar carta','carta-jogar':'Jogar carta','golpe-espada':'Golpe de espada (Cavaleiro)','golpe-pesado':'Golpe pesado (maça, escudo, chefe)','flecha':'Flecha (Caçadora)',
 'magia':'Magia (Mago e Necromante)','bloqueio':'Bloqueio (escudo)','dano-heroi':'Herói leva dano','inimigo-morre':'Inimigo morre','moedas':'Moedas (ouro)','carimbo':'Carimbo da guilda (licença)',
 'martelo-hefesto':'Martelo do Hefesto','tocha':'Tocha (fundo, repete)','botao':'Botão do menu','pocao':'Beber poção','forjar':'Arma subiu de nível','cura':'Cura','turno':'Seu turno / turno inimigo'}
if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); demo = []
    for i, (k, x) in enumerate(S.items(), 1):
        y = norm(x, .8 if k != 'tocha' else .45); st = np.stack([y, y], 1); write(st, f'{out}/{i:02d}-{k}.mp3')
        demo.append(st); demo.append(np.zeros((int(.9*SR), 2)))
    write(np.concatenate(demo), f'{out}/00-todos-em-sequencia.mp3'); print(len(S), 'efeitos')
