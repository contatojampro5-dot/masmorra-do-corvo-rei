"""Coloca os cenários vivos (tools/lab/cenarios/vivo.js) dentro do index.html, entre marcadores.
Uso (na raiz do repositório): python3 tools/lab/montar_cenarios.py"""
import os,re
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
corpo='\n'.join(open(os.path.join(raiz,'tools','lab','cenarios',n),encoding='utf-8').read() for n in ['cenas.js','vivo.js'])
bloco='<!--CENARIOS-VIVOS-->\n<script>\n/* Cenários vivos (gerado por tools/lab/montar_cenarios.py; não editar aqui) */\n'+corpo+'\n</script>\n<!--/CENARIOS-VIVOS-->\n'
p=os.path.join(raiz,'index.html');s=open(p,encoding='utf-8').read()
s=re.sub(r'<!--CENARIOS-VIVOS-->.*?<!--/CENARIOS-VIVOS-->\n?','',s,flags=re.S)
s=s.rstrip('\n')+'\n'+bloco
open(p,'w',encoding='utf-8').write(s);print('index.html com os cenários vivos:',len(s),'bytes')
