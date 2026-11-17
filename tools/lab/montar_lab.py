"""Monta lab-cavaleiro.html a partir do index.html atual + tools/lab/lab-cavaleiro.js.
Uso (na raiz do repositório): python3 tools/lab/montar_lab.py"""
import os
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
s=open(os.path.join(raiz,'index.html'),encoding='utf-8').read()
js=open(os.path.join(raiz,'tools','lab','lab-cavaleiro.js'),encoding='utf-8').read()
s=s.replace('<title>Masmorra do Corvo Rei</title>','<title>Laboratório do Cavaleiro</title>',1)
s=s.replace("navigator.serviceWorker.register('sw.js').catch(()=>{})","0",1)
s=s+'\n<script>\n'+js+'\n</script>\n'
open(os.path.join(raiz,'lab-cavaleiro.html'),'w',encoding='utf-8').write(s)
print('lab-cavaleiro.html montado,',len(s),'bytes')
