"""Coloca a tela de início e as Opções novas (tools/lab/menu/menu.js) dentro do index.html, entre marcadores.
Uso (na raiz do repositório): python3 tools/lab/montar_menu.py — rode depois dos outros montar_*.py."""
import os,re
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
corpo='\n'.join(open(os.path.join(raiz,'tools','lab','menu',n),encoding='utf-8').read() for n in ['menu.js','compendio.js','descanso.js','progresso.js','herois_sel.js','sensacao.js','../mapa/mapa_jogo.js'])
bloco='<!--MENU-NOVO-->\n<script>\n/* Tela de início e Opções novas (gerado por tools/lab/montar_menu.py; não editar aqui) */\n'+corpo+'\n</script>\n<!--/MENU-NOVO-->\n'
p=os.path.join(raiz,'index.html');s=open(p,encoding='utf-8').read()
s=re.sub(r'<!--MENU-NOVO-->.*?<!--/MENU-NOVO-->\n?','',s,flags=re.S)
s=s.rstrip('\n')+'\n'+bloco
open(p,'w',encoding='utf-8').write(s);print('index.html com o menu novo:',len(s),'bytes')
