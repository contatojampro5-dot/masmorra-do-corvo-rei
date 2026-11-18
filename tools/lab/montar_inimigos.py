"""Coloca os inimigos novos dentro do index.html (entre marcadores, para poder atualizar depois).
Uso (na raiz do repositório): python3 tools/lab/montar_inimigos.py
Junta tools/lab/cavaleiro-novo/rig.js (só pela luz) + tools/lab/inimigos/bichos*.js + jogo.js numa caixa isolada."""
import os,re
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
ler=lambda *p:open(os.path.join(raiz,'tools','lab',*p),encoding='utf-8').read()
partes=[ler('cavaleiro-novo','rig.js')]+[ler('inimigos',n) for n in ['bichos.js','bichos2.js','bichos3.js','bichos4.js','bichos5.js','bichos6.js','bichos7.js','jogo.js']]
bloco='<!--INIMIGOS-NOVOS-->\n<script>\n/* Inimigos novos (gerado por tools/lab/montar_inimigos.py; não editar aqui) */\n(function(){\n'+'\n'.join(partes)+'\n})();\n</script>\n<!--/INIMIGOS-NOVOS-->\n'
p=os.path.join(raiz,'index.html');s=open(p,encoding='utf-8').read()
s=re.sub(r'<!--INIMIGOS-NOVOS-->.*?<!--/INIMIGOS-NOVOS-->\n?','',s,flags=re.S)
s=s.rstrip('\n')+'\n'+bloco
open(p,'w',encoding='utf-8').write(s);print('index.html com os inimigos novos:',len(s),'bytes')
