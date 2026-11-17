"""Coloca o Cavaleiro novo dentro do index.html (entre marcadores, para poder atualizar depois).
Uso (na raiz do repositório): python3 tools/lab/montar_cavaleiro.py
Junta tools/lab/cavaleiro-novo/rig.js + poses.js + jogo.js numa caixa isolada (não mistura nomes com o jogo)."""
import os,re
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
pasta=os.path.join(raiz,'tools','lab','cavaleiro-novo')
ler=lambda n:open(os.path.join(pasta,n),encoding='utf-8').read()
bloco='<!--CAVALEIRO-NOVO-->\n<script>\n/* Cavaleiro novo (gerado por tools/lab/montar_cavaleiro.py; não editar aqui) */\n(function(){\n'+ler('rig.js')+'\n'+ler('poses.js')+'\n'+ler('jogo.js')+'\n})();\n</script>\n<!--/CAVALEIRO-NOVO-->\n'
p=os.path.join(raiz,'index.html');s=open(p,encoding='utf-8').read()
s=re.sub(r'<!--CAVALEIRO-NOVO-->.*?<!--/CAVALEIRO-NOVO-->\n?','',s,flags=re.S)
s=s.rstrip('\n')+'\n'+bloco
open(p,'w',encoding='utf-8').write(s);print('index.html com o Cavaleiro novo:',len(s),'bytes')
