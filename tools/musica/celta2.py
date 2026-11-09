"""Arranjador celta v2: partes A/B, balanço, acentos, rolls, ostinato, tremido, bodhrán rufando, sala por música."""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from celta import *
DR2 = dict(DR)
DR2.update({
 'bodh':   {16: [('b',0,1),('bt',1,.35),('bt',2,.6),('bt',3,.35),('b',4,.7),('bt',5,.35),('bt',6,.6),('bt',7,.35),('b',8,1),('bt',9,.35),('bt',10,.6),('bt',11,.35),('b',12,.7),('bt',13,.35),('bt',14,.7),('b',15,.5)]},
 'jigroll':{12: [('b',0,1),('bt',2,.45),('bt',4,.7),('b',6,.8),('bt',8,.45),('bt',10,.7),('tam',6,.5)]},
 'slip':   {18: [('b',0,1),('bt',2,.5),('bt',4,.6),('b',6,.8),('bt',8,.5),('bt',10,.6),('b',12,.8),('bt',14,.5),('bt',16,.6),('tam',6,.6),('tam',12,.6)]},
 'castle': {16: [('b',0,1),('bt',2,.45),('b',4,.8),('bt',6,.45),('b',8,1),('bt',10,.45),('b',12,.8),('bt',14,.45),('bt',15,.35)]},
 'heart':  {16: [('b',0,.9),('b',3,.55)]},
 'warmarch':{16: [('b',0,1),('bt',2,.5),('bt',3,.4),('b',4,.8),('bt',6,.6),('b',8,1),('bt',10,.5),('bt',11,.4),('b',12,.8),('bt',14,.6),('bt',15,.5),('tam',8,.5)]},
})
def accent(pos, bar):
    if bar in (12, 18): return {0: 1., 2: .72, 4: .86}.get(pos % 6, .7)
    return {0: 1., 2: .8}.get(pos % 4, .72)
def out2(M, room, size, echo):
    for X in (M.L, M.R):
        Y = X.copy()
        for d, g in ((.029,.5),(.043,.42),(.061,.36),(.089,.3),(.127,.24),(.181,.18),(.263,.12),(.379,.08)):
            sh = int(d * size * SR) + (7 if X is M.R else 0); Y[sh:] += X[:-sh] * g * room
        if echo and echo[0]:
            sh = int(echo[0] * SR); Z = Y.copy()
            for k in range(1, 4): Z[sh*k:] += Y[:-sh*k] * echo[1]**k
            Y = Z
        X[:] = Y
    m = max(np.abs(M.L).max(), np.abs(M.R).max(), 1e-9); return np.stack([M.L, M.R], 1) * (.9 / m)
def arrange2(D):
    bar = D.get('bar', 16); step = D['step'] if 'step' in D else 60 / D['bpm'] / 4
    tonic = midi(D['key'] + '4') % 12; mode = D['mode']; parts = D['parts']; form = D.get('form', 'AABB')
    passes = D.get('passes', [{}]); segs = []
    for P in passes:
        for p in P.get('form', form): segs.append((p, P))
    seglen = lambda p: len(parts[p]['chords']) * bar * step
    total = sum(seglen(p) for p, _ in segs) + (3 if D.get('final') else 0)
    M = Mix(total); lv = D.get('leadv', .3); sw = D.get('swing', 0); t = 0.
    for si, (p, P) in enumerate(segs):
        part = parts[p]; ch = part['chords']; mel = parse_mel(part['mel']); L = seglen(p)
        first = si == 0 or segs[si-1][0] != p
        if D.get('drone') and P.get('drone', part.get('drone', True)):
            M.add(t, drone(freq(D['drone'] + '2'), int((L + (3 if D.get('final') and si == len(segs)-1 else .2)) * SR), D.get('dronev', .07)), 0)
        for bi, c in enumerate(ch):
            tb = t + bi * bar * step; cn = chord(c, 3); acc = P.get('acc', part.get('acc', D.get('acc', 'none'))); av = D.get('accv', .22)
            if acc in ('harp_arp', 'harp_up', 'harp_cascade'):
                if acc == 'harp_arp': seq = [cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12, cn[2], cn[1], cn[0]]
                elif acc == 'harp_up': seq = [cn[0]-12, cn[0], cn[2], cn[0]+12, cn[1]+12, cn[2]+12, cn[0]+24, cn[2]+12]
                else: seq = [cn[0]+24, cn[2]+12, cn[1]+12, cn[0]+12, cn[2], cn[1], cn[0], cn[0]-12]
                stp = 1 if acc == 'harp_cascade' else 2
                for k in range(0, bar, stp): M.add(tb + k*step, INST['harp'](freq(mname(seq[(k//stp) % 8])), int(1.4*SR), av * (.8 if stp == 1 else 1)), (-.35 + .7*((k//stp) % 8)/7))
            elif acc == 'harp_roll':
                for j, x in enumerate([cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12]): M.add(tb + j*.05, INST['harp'](freq(mname(x)), int(2.8*SR), av*.9), -.4 + j*.2)
            elif acc in ('lute_jig', 'lute_reel', 'lute_waltz', 'lute_slip'):
                hits = {'lute_jig': [(0,'b'),(4,'c'),(6,'b5'),(10,'c')], 'lute_reel': [(0,'b'),(4,'c'),(8,'b5'),(12,'c')], 'lute_waltz': [(0,'b'),(4,'c'),(8,'c')],
                        'lute_slip': [(0,'b'),(4,'c'),(6,'b5'),(10,'c'),(12,'b'),(16,'c')]}[acc]
                for pos, w in hits:
                    if pos >= bar: continue
                    tt = tb + pos*step
                    if w == 'b': M.add(tt, INST['lute'](freq(mname(cn[0]-12)), int(1.2*SR), av*1.2), -.15)
                    elif w == 'b5': M.add(tt, INST['lute'](freq(mname(cn[2]-12)), int(1.2*SR), av*1.1), -.15)
                    else:
                        for j, x in enumerate(cn): M.add(tt + j*.014, INST['lute'](freq(mname(x)), int(.7*SR), av*.55), .2)
            elif acc == 'fiddle_pad':
                n = int(bar*step*SR*.98)
                for j, x in enumerate(cn[:3]): M.add(tb, fiddle(freq(mname(x)), n, av*.16) * adsr(n, .3, 0, 1, .3), (-.3, 0, .3)[j])
            dk = P.get('drums', part.get('drums', D.get('drums', 'none')))
            if dk:
                for h in DR2[dk].get(bar, []):
                    kind, pos = h[0], h[1]; vel = h[2] if len(h) > 2 else 1
                    M.add(tb + pos*step, drum(kind, D.get('drumv', .5) * vel * (.8 if kind == 'tam' else 1)), .1 if kind == 'tam' else 0)
            if bi == 0 and first and P.get('gong', part.get('gong')): M.add(tb, drum('gong', .5), 0)
        # ostinato grave
        if part.get('ost') and P.get('ost', True):
            tm = t
            for n, d in parse_mel(part['ost']):
                if n: M.add(tm, INST[D.get('ostinst', 'lute')](freq(n), int(d*step*SR*.9), D.get('ostv', .3)), -.1)
                tm += d*step
        # melodia
        if P.get('lead', True) and part['mel'].strip():
            inst = P.get('inst', part.get('inst', D['lead'])); li = INST[inst]; ok = P.get('oct', 0) + part.get('oct', 0); tm = t; pos = 0; k = 0
            for n, d in mel:
                if n:
                    trem = n.endswith('*'); n0 = n.rstrip('*'); nn = mname(midi(n0) + 12*ok)
                    sh = sw * step if (bar == 16 and pos % 4 == 2) else 0; vol = lv * accent(pos, bar); dur = d*step; T = tm + sh
                    if trem:
                        q = step / 2
                        for j in range(int(d*2)): M.add(T + j*q, li(freq(nn), int(q*SR*.9), vol * (.95 if j % 2 == 0 else .75)), 0)
                    elif inst in ('flute', 'fiddle', 'pipes') and D.get('orn', 2) >= 2 and d >= 6:
                        u, lo = step_above(nn, tonic, mode), third_below(nn, tonic, mode); g = .038
                        for j, x in enumerate([nn, u, nn, mname(midi(nn) - (2 if midi(nn) - 2 >= 0 else 1)), nn][:4]): M.add(T + j*g, li(freq(x), int(g*SR), vol*.85), 0)
                        M.add(T + 4*g, li(freq(nn), int((dur - 4*g)*SR*.96), vol), 0)
                    elif inst in ('flute', 'fiddle', 'pipes') and D.get('orn', 2) >= 1 and d >= 4 and k % 2 == 0:
                        g = .042; M.add(T, li(freq(step_above(nn, tonic, mode)), int(g*SR), vol*.8), 0); M.add(T + g, li(freq(nn), int((dur - g)*SR*.96), vol), 0)
                    else: M.add(T, li(freq(nn), int(dur*SR*.93), vol), 0)
                    k += 1
                tm += d*step; pos += d
            if P.get('harm', part.get('harm')):
                hi = INST[P.get('harminst', D.get('harminst', 'flute'))]; tm = t
                for n, d in mel:
                    if n and not n.endswith('*'):
                        M.add(tm, hi(freq(third_below(mname(midi(n.rstrip('*')) + 12*ok), tonic, mode)), int(d*step*SR*.92), lv*.5), -.35)
                    tm += d*step
        t += L
    if D.get('final'):
        cn = chord(D['final'], 3)
        for j, x in enumerate([cn[0]-12, cn[0], cn[1], cn[2], cn[0]+12, cn[2]+12]): M.add(t + j*.06, INST['harp'](freq(mname(x)), int(3*SR), .24), -.4 + j*.16)
        M.add(t, INST[D['lead']](freq(mname(cn[0] + 12)), int(2.6*SR), lv * .9), 0)
    st = out2(M, D.get('room', .32), D.get('size', 1.), D.get('echo'))
    return st[: int((total + (1.5 if D.get('final') else 0)) * SR)]
