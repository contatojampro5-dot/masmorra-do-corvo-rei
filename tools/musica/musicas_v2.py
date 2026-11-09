import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from celta2 import *
from musicas_celta import M as OLD
M = {}
# ---------- reescritas ----------
M['01-tema-principal'] = dict(key='D', mode='dorian', bpm=66, lead='flute', drone='D', dronev=.06, room=.55, size=1.8, form='ABA',
  parts={'A': dict(chords='Dm C Dm Am F C G Dm'.split(), acc='harp_roll', mel='A4/4 D5/4 E5/4 F5/4 E5/6 D5/2 C5/8 D5/4 F5/4 A5/6 G5/2 E5/12 -/4 F5/4 A5/4 C6/6 A5/2 G5/4 E5/4 C5/8 B4/4 D5/4 G5/4 E5/4 D5/16'),
         'B': dict(chords='F C G Am F C Am Dm'.split(), acc='harp_arp', harm=True, mel='C6/6 A5/2 F5/8 G5/4 C6/4 E6/8 D6/6 B5/2 G5/8 A5/4 C6/4 E6/4 C6/4 F6/6 E6/2 C6/8 E6/4 D6/4 C6/4 G5/4 A5/4 C6/4 B5/4 G5/4 A5/8 D5/8')},
  harminst='fiddle', final='Dm')
M['03-luta-masmorra'] = dict(key='A', mode='dorian', bpm=150, lead='fiddle', acc='lute_reel', drums='bodh', drumv=.5, swing=.14, room=.28, size=1.,
  parts={'A': dict(chords='Am G Am Em Am G D Am'.split(), mel='E5/2 A5/2 A5/2 B5/2 C6/2 B5/2 A5/2 G5/2 G5/2 B5/2 D6/2 B5/2 G5/2 D5/2 B4/2 D5/2 E5/2 A5/2 A5/2 C6/2 E6/2 C6/2 A5/2 C6/2 B5/2 G5/2 E5/2 G5/2 B5/4 A5/2 G5/2 A5/2 E6/2 E6/2 D6/2 E6/2 A6/2 G6/2 E6/2 D6/2 B5/2 G5/2 B5/2 D6/2 G6/2 F#6/2 D6/2 F#6/2 A6/2 F#6/2 D6/2 A5/2 D6/2 F#5/2 A5/2 E5/4 A5/4 A5/8'),
         'B': dict(chords='C G Am Em C G D Am'.split(), mel='E6/2 E6/2 D6/2 C6/2 G5/2 C6/2 E6/2 G6/2 D6/2 B5/2 G5/2 B5/2 D6/2 G6/2 D6/2 B5/2 C6/2 A5/2 E5/2 A5/2 C6/2 E6/2 D6/2 C6/2 B5/2 G5/2 E5/2 G5/2 B5/2 E6/2 D6/2 B5/2 C6/2 E6/2 G6/2 E6/2 C6/2 G5/2 E5/2 G5/2 B5/2 D6/2 G6/2 D6/2 B5/2 G5/2 D5/2 G5/2 A5/2 F#5/2 D5/2 F#5/2 A5/2 D6/2 F#6/2 A6/2 G6/2 E6/2 C6/2 B5/2 A5/8')},
  passes=[{'form': 'AA', 'drums': 'air'}, {'form': 'BB'}, {'form': 'AABB', 'inst': 'flute', 'harm': True}], harminst='fiddle')
M['04-luta-catacumbas'] = dict(key='E', mode='aeolian', bpm=62, lead='flute', leadv=.27, drone='E', dronev=.07, drums='heart', drumv=.55, room=.7, size=2.4, echo=(.5, .3), form='ABA',
  parts={'A': dict(chords='Em D C Em Am Em D Em'.split(), oct=-1, acc='fiddle_pad', mel='E5/8 G5/4 F#5/4 A5/6 F#5/2 D5/8 E5/4 G5/4 C6/4 B5/4 B5/12 -/4 A5/4 C6/4 E6/6 D6/2 B5/4 G5/4 E5/8 F#5/4 A5/4 D6/4 C6/4 B5/16'),
         'B': dict(chords='C G Am Em C D Em Em'.split(), acc='harp_roll', mel='G5/6 E5/2 C5/8 D5/4 G5/4 B5/8 C6/6 B5/2 A5/8 G5/4 E5/4 B4/8 E5/4 G5/4 C6/6 B5/2 A5/6 F#5/2 D5/8 E5/4 F#5/4 G5/4 A5/4 B4/16')}, accv=.18)
M['05-luta-torre'] = dict(key='B', mode='aeolian', bar=18, step=.082, lead='fiddle', acc='lute_slip', drone='B', dronev=.05, drums='slip', drumv=.55, room=.36, size=1.3,
  parts={'A': dict(chords='Bm A Bm F# Bm G A F#'.split(), mel='B5/2 F#5/2 B5/2 D6/2 C#6/2 B5/2 A5/2 F#5/2 D5/2 E5/2 A5/2 C#6/2 E6/2 C#6/2 A5/2 G5/2 E5/2 C#5/2 D5/2 F#5/2 B5/2 D6/4 C#6/2 B5/2 A5/2 F#5/2 C#6/2 A#5/2 F#5/2 C#6/2 E6/2 C#6/2 A#5/6 B5/2 D6/2 F#6/2 E6/2 D6/2 C#6/2 B5/2 A5/2 F#5/2 G5/2 B5/2 D6/2 G6/4 F#6/2 E6/2 D6/2 B5/2 A5/2 C#6/2 E6/2 A6/2 G6/2 E6/2 C#6/2 B5/2 A5/2 A#5/2 C#6/2 F#6/2 E6/2 C#6/2 A#5/2 F#5/6'),
         'B': dict(chords='G A Bm F# G D Em F#'.split(), inst='pipes', oct=-1, gong=True, mel='B5/2 D6/2 G6/2 B6/4 A6/2 G6/2 F#6/2 D6/2 C#6/2 E6/2 A6/2 C#7/4 B6/2 A6/2 G6/2 E6/2 D6/2 F#6/2 B6/2 A6/2 F#6/2 D6/2 B5/2 A5/2 F#5/2 E5/2 F#5/2 A#5/2 C#6/2 F#6/4 E6/2 C#6/2 A#5/2 G6/2 F#6/2 E6/2 D6/2 B5/2 G5/2 D5/2 G5/2 B5/2 A5/2 F#5/2 D5/2 F#5/2 A5/2 D6/2 F#6/2 E6/2 D6/2 E6/2 G6/2 B6/2 G6/2 E6/2 B5/2 G5/2 B5/2 E6/2 C#6/2 A#5/2 F#5/2 F#6/12')},
  passes=[{}, {'harm': True}], harminst='flute')
M['06-chefe'] = dict(key='D', mode='aeolian', bpm=100, lead='pipes', leadv=.25, acc='lute_reel', drone='D', dronev=.09, drums='warmarch', drumv=.6, room=.3, size=1.1,
  parts={'A': dict(chords='Dm Dm C Dm Bb C Dm Dm'.split(), mel='D5/6 D5/2 F5/4 A5/4 A5/6 G5/2 F5/4 E5/4 E5/6 C5/2 E5/4 G5/4 F5/6 E5/2 D5/8 F5/6 F5/2 Bb5/4 D6/4 C6/6 Bb5/2 A5/4 G5/4 A5/4 F5/4 E5/2 F5/2 D5/4 D5/16'),
         'B': dict(chords='F C Dm Am Bb C Dm Dm'.split(), harm=True, mel='A5/4 C6/4 F6/6 E6/2 G6/4 E6/4 C6/8 D6/4 F6/4 A6/4 F6/4 E6/6 D6/2 C6/8 D6/4 F6/4 Bb6/6 A6/2 G6/4 E6/4 C6/4 E6/4 F6/2 E6/2 D6/2 C6/2 A5/4 C6/4 D6/16', oct=-1)},
  passes=[{'form': 'A', 'lead': False, 'gong': True}, {'form': 'AABB'}], harminst='fiddle')
P = lambda r, a, b, c, d: f'{r}/2 {r}/2 {a}/2 {r}/2 {b}/2 {r}/2 {c}/2 {d}/2'
OA = ' '.join([P('A2','E3','Bb2','Eb3','A2')]*4 + [P('Bb2','F3','B2','E3','Bb2')]*2 + [P('B2','F#3','C3','F3','B2')] + ['E2/2 F2/2 F#2/2 G2/2 G#2/2 A2/2 Bb2/2 B2/2'])
M['07-corvo-rei'] = dict(key='A', mode='harm', bpm=152, lead='fiddle', leadv=.3, ostinst='lute', ostv=.34, drums='castle', drumv=.55, room=.42, size=1.6, drone='A', dronev=.045,
  parts={'I': dict(chords=['Am', 'Am'], mel='-/16 -/16', ost=' '.join([P('A2','E3','Bb2','Eb3','A2')]*2), drone=False),
         'A': dict(chords='Am Am Am Am Bb Bb B E'.split(), ost=OA, mel='A5/4 G#5/4 A5/4 Eb6/4 D6/2 C#6/2 C6/2 B5/2 Bb5/4 A5/4 A5/4 C6/4 E6/4 Eb6/4 D6/2 Eb6/2 D6/2 C6/2 B5/8 Bb5/4 A5/4 Bb5/4 E6/4 Eb6/2 D6/2 C#6/2 C6/2 B5/4 Bb5/4 B5/4 D6/4 F6/4 G#6/4 A6/8 -/8'),
         'B': dict(chords='Am Am Am Am Bb Bb B E'.split(), ost=OA, gong=True, harm=True, mel='E6*/8 F6*/8 E6*/8 Eb6*/8 D6*/8 Eb6*/8 D6*/8 C#6*/8 A5/2 Bb5/2 B5/2 C6/2 C#6/2 D6/2 Eb6/2 E6/2 F6/2 E6/2 Eb6/2 D6/2 C#6/2 C6/2 B5/2 Bb5/2 A5/2 Eb6/2 A5/2 Eb6/2 A5/2 Eb6/2 A5/2 Eb6/2 A6*/16')},
  form='IAABB', passes=[{}, {'form': 'AABB', 'inst': 'pipes', 'oct': -1}], harminst='pipes')
M['11-tema-mago'] = dict(key='A', mode='dorian', bpm=88, lead='harp', leadv=.34, acc='harp_cascade', accv=.13, drums='none', room=.6, size=2., echo=(.34, .3), form='AB',
  parts={'A': dict(chords='Am D Am G F G D Am'.split(), mel='E5/8 A5/8 F#5/4 A5/4 D6/8 C6/6 B5/2 A5/8 B5/4 D6/4 G5/8 A5/4 C6/4 F6/8 D6/6 B5/2 G5/8 F#5/4 A5/4 D6/4 F#6/4 E6/16'),
         'B': dict(chords='F G Am Em F G D Am'.split(), inst='flute', acc='harp_up', mel='A5/2 C6/2 F6/4 E6/4 C6/4 B5/2 D6/2 G6/4 F#6/4 D6/4 C6/2 E6/2 A6/8 G6/4 B5/4 G5/4 E5/8 F5/2 A5/2 C6/2 F6/2 E6/4 C6/4 D6/4 B5/4 G5/4 D6/4 F#6/4 E6/4 D6/4 A5/4 A5/16')},
  passes=[{}, {'form': 'A', 'oct': 1}], final='Am')
# ---------- as outras ganham o motor novo (acentos, rolls, bodhrán, sala própria) ----------
TUNE = {'02-taverna': dict(drums='jigroll', room=.22, size=.7), '08-forja-hefesto': dict(room=.25, size=.8), '09-tema-cavaleiro': dict(room=.45, size=1.6, drums='warmarch'),
        '10-tema-cacadora': dict(drums='jigroll', room=.42, size=1.4), '12-tema-guardiao': dict(room=.5, size=1.9), '13-tema-necromante': dict(room=.55, size=2.1),
        '14-vitoria-classe-s': dict(room=.45, size=1.6), '15-voce-tombou': dict(room=.6, size=2.2)}
for k, extra in TUNE.items():
    D = dict(OLD[k]); D.update(extra); pa = D.pop('passes', [{}])
    D['parts'] = {'A': dict(chords=D.pop('chords'), mel=D.pop('mel'))}; D['form'] = 'A'
    D['passes'] = [dict(q, form='A') for q in pa]
    for q in D['passes']:
        if q.get('drums') == 'jigsoft': q['drums'] = 'jigroll'
        if q.get('drums') == 'march': q['drums'] = 'warmarch'
    if D.get('drums') == 'march': D['drums'] = 'warmarch'
    M[k] = D
ORDER = ['01-tema-principal','02-taverna','03-luta-masmorra','04-luta-catacumbas','05-luta-torre','06-chefe','07-corvo-rei','08-forja-hefesto','09-tema-cavaleiro','10-tema-cacadora','11-tema-mago','12-tema-guardiao','13-tema-necromante','14-vitoria-classe-s','15-voce-tombou']
if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); only = sys.argv[2:] or ORDER
    for k in only:
        D = M[k]; bar = D.get('bar', 16)
        for pn, pt in D['parts'].items():
            tot = sum(d for _, d in parse_mel(pt['mel'])) if pt['mel'].strip() else bar*len(pt['chords'])
            if tot != bar*len(pt['chords']): print('AVISO', k, pn, tot, bar*len(pt['chords']))
            if pt.get('ost'):
                to = sum(d for _, d in parse_mel(pt['ost']))
                if to != bar*len(pt['chords']): print('AVISO ost', k, pn, to)
        st = arrange2(D); write(st, f'{out}/{k}.mp3'); print(k, round(len(st)/SR, 1), 's', flush=True)
