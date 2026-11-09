import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from celta import *
M = {}
M['01-tema-principal'] = dict(key='D', mode='dorian', bpm=72, chords='Dm C Dm Am F C G Dm'.split(), lead='flute', acc='harp_arp', drone='D', drums='air', drumv=.35,
  mel='A4/4 D5/4 E5/4 F5/4 E5/6 D5/2 C5/8 D5/4 F5/4 A5/6 G5/2 E5/12 -/4 F5/4 A5/4 C6/6 A5/2 G5/4 E5/4 C5/8 B4/4 D5/4 G5/4 E5/4 D5/16',
  passes=[{'drums': False}, {'harm': True, 'harminst': 'fiddle'}], final='Dm')
M['02-taverna'] = dict(key='G', mode='mixo', bar=12, step=.095, chords='G F G D G F C G'.split(), lead='fiddle', acc='lute_jig', drums='jig', drumv=.45,
  mel='G5/2 B5/2 D6/2 B5/2 G5/2 B5/2 A5/2 F5/2 A5/2 C6/2 A5/2 F5/2 G5/2 B5/2 D6/2 G6/4 F6/2 E6/2 D6/2 C6/2 B5/2 A5/4 D6/2 B5/2 G5/2 D6/2 B5/2 G5/2 C6/2 A5/2 F5/2 C6/2 A5/2 F5/2 E5/2 G5/2 C6/2 E6/2 D6/2 C6/2 B5/4 G5/2 G5/6',
  passes=[{'drums': 'jigsoft'}, {'harm': True, 'harminst': 'flute'}, {'inst': 'flute'}, {'harm': True}])
M['03-luta-masmorra'] = dict(key='A', mode='dorian', bpm=150, chords='Am G Am Em Am G D Am'.split(), lead='fiddle', acc='lute_reel', drums='reel', drumv=.5,
  mel='E5/2 A5/2 A5/2 B5/2 C6/2 B5/2 A5/2 G5/2 G5/2 B5/2 D6/2 B5/2 G5/2 D5/2 B4/2 D5/2 E5/2 A5/2 A5/2 C6/2 E6/2 C6/2 A5/2 C6/2 B5/2 G5/2 E5/2 G5/2 B5/4 A5/2 G5/2 A5/2 E6/2 E6/2 D6/2 E6/2 A6/2 G6/2 E6/2 D6/2 B5/2 G5/2 B5/2 D6/2 G6/2 F#6/2 D6/2 F#6/2 A6/2 F#6/2 D6/2 A5/2 D6/2 F#5/2 A5/2 E5/4 A5/4 A5/8',
  passes=[{'drums': 'air'}, {}, {'inst': 'flute', 'harm': True, 'harminst': 'fiddle'}, {'harm': True}])
M['04-luta-catacumbas'] = dict(key='E', mode='aeolian', bpm=76, chords='Em D C Em Am Em D Em'.split(), lead='flute', leadv=.26, acc='harp_roll', drone='E', drums='air', drumv=.4, room=.5, echo=(.42, .3),
  mel='E5/8 G5/4 F#5/4 A5/6 F#5/2 D5/8 E5/4 G5/4 C6/4 B5/4 B5/12 -/4 A5/4 C6/4 E6/6 D6/2 B5/4 G5/4 E5/8 F#5/4 A5/4 D6/4 C6/4 B5/16',
  passes=[{'drums': False}, {}, {'oct': -1, 'inst': 'fiddle'}])
M['05-luta-torre'] = dict(key='B', mode='aeolian', bpm=162, chords='Bm A G A Bm A G F#'.split(), lead='fiddle', acc='lute_reel', drone='B', dronev=.05, drums='war', drumv=.55,
  mel='F#5/2 B5/2 B5/2 A5/2 B5/2 D6/2 C#6/2 B5/2 A5/2 C#6/2 E6/2 C#6/2 A5/2 E5/2 C#5/2 E5/2 D5/2 G5/2 B5/2 D6/2 G6/2 F#6/2 E6/2 D6/2 C#6/2 E6/2 A6/2 E6/2 C#6/4 A5/4 B5/2 D6/2 F#6/2 D6/2 B5/2 F#5/2 D5/2 F#5/2 E5/2 A5/2 C#6/2 E6/2 A6/2 G6/2 F#6/2 E6/2 D6/2 B5/2 G5/2 B5/2 D6/2 G6/2 B6/4 A#6/4 F#6/4 C#6/4 A#5/4',
  passes=[{'gong': True}, {'harm': True, 'harminst': 'flute'}, {'inst': 'pipes', 'oct': -1}, {'harm': True, 'gong': True}])
M['06-chefe'] = dict(key='D', mode='aeolian', bpm=104, chords='Dm Dm C Dm Bb C Dm Dm'.split(), lead='pipes', leadv=.24, acc='lute_reel', drone='D', dronev=.09, drums='war', drumv=.6,
  mel='D5/6 D5/2 F5/4 A5/4 A5/6 G5/2 F5/4 E5/4 E5/6 C5/2 E5/4 G5/4 F5/6 E5/2 D5/8 F5/6 F5/2 Bb5/4 D6/4 C6/6 Bb5/2 A5/4 G5/4 A5/4 F5/4 E5/2 F5/2 D5/4 D5/16',
  passes=[{'gong': True, 'lead': False, 'acc': 'none'}, {}, {'harm': True, 'harminst': 'fiddle', 'gong': True}])
M['07-corvo-rei'] = dict(key='A', mode='harm', bpm=124, chords='Am F G E Am F E Am'.split(), lead='fiddle', acc='harp_up', drone='A', dronev=.06, drums='war', drumv=.55,
  mel='A5/4 E5/4 A5/4 C6/4 C6/4 A5/4 F5/2 G5/2 A5/4 B5/4 G5/4 D6/6 B5/2 G#5/8 E5/8 A5/2 B5/2 C6/2 D6/2 E6/6 C6/2 F6/4 E6/4 C6/4 A5/4 G#5/4 B5/4 E6/4 D6/4 C6/4 B5/4 A5/8',
  passes=[{'drums': 'march', 'gong': True}, {'inst': 'pipes', 'harm': True, 'harminst': 'fiddle'}, {'oct': -1, 'drums': 'march'}, {'harm': True, 'gong': True}])
M['08-forja-hefesto'] = dict(key='D', mode='dorian', bpm=88, chords='Dm C Dm G Dm C Am Dm'.split(), lead='flute', leadv=.24, acc='lute_reel', accv=.16, drone='D', drums='anvil', drumv=.5,
  mel='D5/4 F5/4 A5/8 G5/4 E5/4 C5/8 D5/4 A5/4 B5/4 A5/4 G5/16 F5/4 E5/4 D5/4 F5/4 E5/4 G5/4 C6/8 A5/4 G5/4 E5/4 C5/4 D5/16',
  passes=[{'oct': -1}, {'harm': True, 'harminst': 'fiddle'}])
M['09-tema-cavaleiro'] = dict(key='G', mode='ionian', bpm=100, chords='G C G D G C D G'.split(), lead='pipes', leadv=.25, acc='harp_roll', drone='G', dronev=.08, drums='march', drumv=.5,
  mel='D5/4 G5/4 G5/6 A5/2 B5/4 C6/4 E6/6 C6/2 B5/4 G5/4 D5/4 G5/4 A5/12 F#5/4 G5/2 A5/2 B5/4 D6/6 B5/2 C6/4 E6/4 D6/2 C6/2 B5/4 A5/4 D6/4 F#5/4 A5/4 G5/16',
  passes=[{'drums': False, 'inst': 'flute'}, {'harm': True, 'harminst': 'fiddle'}], final='G')
M['10-tema-cacadora'] = dict(key='E', mode='dorian', bar=12, step=.1, chords='Em D Em A Em D A Em'.split(), lead='flute', acc='harp_arp', drums='jigsoft', drumv=.35, room=.42,
  mel='B4/2 E5/2 E5/2 F#5/2 G5/2 E5/2 F#5/2 D5/2 F#5/2 A5/2 F#5/2 D5/2 E5/2 G5/2 B5/2 E6/4 B5/2 C#6/2 A5/2 E5/2 A5/6 G5/2 B5/2 E6/2 D6/2 B5/2 G5/2 A5/2 F#5/2 D5/2 F#5/2 A5/2 D6/2 C#6/2 B5/2 A5/2 E5/2 C#5/2 E5/2 E5/12',
  passes=[{'drums': False}, {'harm': True, 'harminst': 'fiddle'}], final='Em')
M['11-tema-mago'] = dict(key='A', mode='dorian', bpm=92, chords='Am D Am G F G D Am'.split(), lead='flute', leadv=.27, acc='harp_up', accv=.2, drums='none', room=.55, echo=(.36, .28),
  mel='E5/8 A5/8 F#5/4 A5/4 D6/8 C6/6 B5/2 A5/8 B5/4 D6/4 G5/8 A5/4 C6/4 F6/8 D6/6 B5/2 G5/8 F#5/4 A5/4 D6/4 F#6/4 E6/16',
  passes=[{}, {'harm': True, 'harminst': 'flute', 'oct': -1}], final='Am')
M['12-tema-guardiao'] = dict(key='G', mode='mixo', bpm=76, chords='G F G D G F C G'.split(), lead='pipes', leadv=.26, acc='harp_roll', drone='G', dronev=.1, drums='march', drumv=.55,
  mel='G4/6 A4/2 B4/8 C5/4 A4/4 F4/8 G4/4 B4/4 D5/6 B4/2 A4/16 B4/4 D5/4 G5/8 F5/4 D5/4 C5/4 A4/4 G4/4 C5/4 E5/4 C5/4 G4/16',
  passes=[{'drums': 'air', 'oct': 1}, {'oct': 1, 'harm': True, 'harminst': 'fiddle'}], final='G')
M['13-tema-necromante'] = dict(key='A', mode='harm', bar=12, bpm=108, chords='Am Am F E Am Dm E Am'.split(), lead='fiddle', leadv=.27, acc='lute_waltz', drums='waltz', drumv=.4, room=.5, echo=(.4, .3),
  mel='A4/4 C5/4 E5/4 A5/8 G5/4 F5/4 A5/4 C6/4 B5/8 G#5/4 A5/4 E5/4 C5/4 D5/4 F5/4 A5/4 G#5/4 E5/4 B4/4 A4/12',
  passes=[{'drums': False}, {'oct': 1, 'harm': True, 'harminst': 'flute'}], final='Am')
M['14-vitoria-classe-s'] = dict(key='D', mode='ionian', bpm=112, chords='D G A D'.split(), lead='pipes', acc='harp_up', drone='D', drums='march', drumv=.5,
  mel='A4/2 D5/2 F#5/2 A5/10 B5/4 D6/4 G5/8 A5/2 C#6/2 E6/2 A6/6 G6/2 E6/2 F#6/16', passes=[{'gong': True, 'harm': True, 'harminst': 'fiddle'}], final='D')
M['15-voce-tombou'] = dict(key='E', mode='aeolian', bpm=64, chords='Em C D Em'.split(), lead='flute', leadv=.27, acc='harp_roll', accv=.18, drone='E', dronev=.05, drums='none', room=.55, echo=(.45, .28),
  mel='B5/8 G5/8 E5/8 C5/8 D5/4 F#5/4 A5/8 E5/16', passes=[{}], final='Em')
if __name__ == '__main__':
    out = sys.argv[1]; os.makedirs(out, exist_ok=True); only = sys.argv[2:] or list(M)
    for k in only:
        D = M[k]; bar = D.get('bar', 16); tot = sum(d for _, d in parse_mel(D['mel'])); need = bar * len(D['chords'])
        if tot != need: print('AVISO', k, tot, need)
        st = arrange(D); write(st, f'{out}/{k}.mp3'); print(k, round(len(st)/SR, 1), 's', flush=True)
