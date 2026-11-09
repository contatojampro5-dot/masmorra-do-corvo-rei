# Masmorra do Corvo Rei

Roguelike de cartas em pixel art. Escolha um herói, desça andar por andar pela Masmorra, pelas Catacumbas e pela Torre, monte o seu baralho no caminho e derrube o Corvo Rei.

**Jogar no navegador:** https://contatojampro5-dot.github.io/masmorra-do-corvo-rei/
(ou baixe o `index.html` e abra no navegador)

## Plano de desenvolvimento
O caminho até a App Store está em [Plano Real de Desenvolvimento — Atlas 1.0](docs/plano-atlas-1.0.md).

## O que tem no jogo
- **5 heróis:** Cavaleiro Errante, Caçadora das Brumas, Mago Arcano, Guardião de Ferro e Necromante.
- **155 cartas**, mais 10 cartas especiais de arma.
- **3 atos**, com mapa que desce em andares, elites e um chefe no fundo de cada ato.
- **Armas que evoluem** em 4 níveis com 2 caminhos, forjadas pelo **Hefesto** com Fragmentos (elites dão 1, chefes dão 2).
- **Guerreiros pelo caminho** (Sir Aldo, Mira, Bruna, Frei Tobias, Kael e Irmã Celeste), que ensinam ataque, defesa ou vida.
- **Servos do Necromante:** as últimas criaturas que ele derrotou voltam para lutar por ele.
- **18 ambientes com luz**, um para cada tipo de inimigo.
- Abertura em vídeo (`abertura.mp4`).
- **Cutscene da Taverna:** depois de escolher o herói, ele chega na Taverna do Javali Torto, recebe a licença de aventureiro **Classe D**, jura provar o contrário e entra na masmorra. Câmera com cortes, closes e movimento; dá para pular.
- **Cutscene final:** ao derrotar o Corvo Rei, o herói volta à taverna, joga a coroa no balcão e a Marta troca o D por **Classe S**.
- **Falas com legenda:** o herói ganha um temperamento sorteado (Corajoso, Sarcástico, Nervoso ou Sombrio) e os inimigos que pensam falam com o deles (Arrogante, Covarde, Furioso ou Debochado). Bichos não falam.

## Controles
Arraste a carta até o inimigo (ou clique na carta e depois no alvo). **E** encerra o turno, **1 a 0** escolhem cartas, **F2** abre o painel DEV (só com o endereço terminado em `#dev`). No celular, **segure o dedo** em qualquer coisa para ler a explicação.

## Versões
- **v1.0** — primeira versão no GitHub: visual 32×32 desenhado à mão, Forja de Hefesto, armas evolutivas, ambientes por inimigo, guerreiros e abertura em vídeo.
- **v1.1** — falas com legenda e balão; personalidades sorteadas para o herói e para os inimigos que falam.
- **v1.2** — cutscene da Taverna (classificação D) antes da masmorra, com câmera, cortes e falas por temperamento.
- **v1.3** — cutscene final: a coroa no balcão e a Classe S.
- **v1.4** — botão **Cenas** no menu: assistir à abertura, à Taverna (Classe D) e ao Retorno (Classe S) com qualquer herói.
- **v1.5** — personagens andam com passos de verdade nas cenas (pernas abrem, cruzam e o pé de trás levanta).
- **v1.6** — novas cenas: entrada dos 5 chefes, troca para o Ato 2 e o Ato 3, primeiro encontro com o Hefesto e os guerreiros em cena. Todas também no menu Cenas.
- **v1.7** — novas cenas: queda dos 5 chefes (o Corvo Rei vira pó e penas), a volta do herói carregado à taverna quando tomba, o Mercador e a Lenda do Corvo Rei (Aldric, o Rei Justo).
- **v1.8** — botão **Heróis** no menu com a história de cada um (o cavaleiro sem bandeira, a irmã de Liora, o aluno expulso, o ferreiro de Pedra Funda e o necromante que está virando corvo).
- **v1.9** — na Taverna, a Marta explica por que cada herói ganha D (ordem extinta, a irmã Liora, expulso da Academia, ferreiro sem luta, e o Necromante registrado como "sem nome").
- **v2.0** — dê nome ao seu herói (com nomes sugeridos e sorteio). O Necromante começa "sem nome" e só diz o nome dele na cena da Classe S.
- **v2.1** — Atlas 1.0, Etapa 1 (celular): dicas com toque longo, aviso para girar o celular na luta, botões maiores, barra de cima compacta no celular deitado, tela de Opções (cenas sempre/primeira vez/nunca, velocidade das falas, falas na luta, vibração), vibração ao levar dano, fontes dentro do jogo (funciona sem internet) e botão DEV escondido.
- **v2.2** — luta: personagens com os pés no chão do cenário em qualquer tela, moldura nas bordas (pilares, estalactites, pedras e tochas, por ato) e inimigos mais perto do herói.
- **v2.3** — barra de cima mais encorpada: fundo de madeira escura, borda dourada, cada informação numa "pílula" própria e nome maior.
