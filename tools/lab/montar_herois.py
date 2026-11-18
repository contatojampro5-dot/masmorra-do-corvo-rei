"""Coloca os heróis novos (Caçadora, Mago, Guardião, Necromante) dentro do index.html, entre marcadores.
Uso (na raiz do repositório): python3 tools/lab/montar_herois.py
Precisa do motor dos inimigos no jogo (tools/lab/montar_inimigos.py); se ele vier depois no arquivo, os heróis esperam a página carregar."""
import os,re
raiz=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
ler=lambda n:open(os.path.join(raiz,'tools','lab','herois',n),encoding='utf-8').read()
corpo='\n'.join(ler(n) for n in ['base.js','h_cac.js','h_mag.js','h_tan.js','h_nec.js','jogo.js'])
bloco='<!--HEROIS-NOVOS-->\n<script>\n/* Heróis novos (gerado por tools/lab/montar_herois.py; não editar aqui) */\n(function(){\nconst iniciar=function(){\n'+corpo+'\n};\nif(window.BICHO)iniciar();else addEventListener("load",iniciar);\n})();\n</script>\n<!--/HEROIS-NOVOS-->\n'
p=os.path.join(raiz,'index.html');s=open(p,encoding='utf-8').read()
s=re.sub(r'<!--HEROIS-NOVOS-->.*?<!--/HEROIS-NOVOS-->\n?','',s,flags=re.S)
s=s.rstrip('\n')+'\n'+bloco
open(p,'w',encoding='utf-8').write(s);print('index.html com os heróis novos:',len(s),'bytes')
