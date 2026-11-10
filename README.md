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
- **v2.4** — Atlas 1.0, Etapa 2 (parte 1): 15 músicas celtas/medievais compostas para o jogo (menu, taverna, uma luta por ato, chefes, Corvo Rei, forja, tema de cada herói, vitória e derrota), com troca suave entre telas e volume nas Opções.
- **v2.4.1** — Tela de luta no celular: com o celular deitado, o herói e o inimigo encolhem quando o campo fica baixo (a cabeça não é mais cortada); em pé, a barra de cima ficou mais enxuta, as cartas não saem da tela e não cobrem mais o Descarte.
- **v2.5** — Atlas 1.0, Etapa 2 (parte 2): 18 efeitos sonoros feitos em código (comprar e jogar carta, espada, golpe pesado, flecha, magia, bloqueio, dano, inimigo morrendo, moedas, carimbo da guilda, martelo do Hefesto, tocha no mapa e na forja, botões, poção, forjar arma, cura, turno). Volume de "Efeitos" separado nas Opções.
- **v2.6** — cartas redesenhadas: cada classe tem o seu estilo (vitral do Cavaleiro, floresta da Caçadora, torre arcana do Mago, aço e ouro do Guardião, cemitério do Necromante, prisma das Lendárias), com ilustração, gemas de raridade e o texto no mesmo lugar.
- **v2.7** — botão **Abandonar partida** nas Opções (durante a jornada), com confirmação antes de apagar a partida e voltar ao menu.
- **v2.8** — Atlas 1.0, Etapa 3: tutorial da primeira luta com a Marta (energia, intenção do inimigo, carta de ataque, bloqueio, encerrar turno, toque longo), com anel e seta apontando cada coisa e botão "Pular tutorial". Dicas que aparecem uma vez (mapa, recompensa, forja, loja, evento, fogueira, elite, chefe). Botão "Rever tutorial e dicas" nas Opções.
- **v2.9** — cartas com a cor do tipo nos detalhes (contorno do desenho, losango do tipo e aro do custo): vermelho = ataque, azul = defesa, verde = cura, roxo = magia. O estilo de cada classe continua igual.
- **v2.10** — Atlas 1.0, Etapa 4 (leveza e bateria): fundo animado gasta metade (menos quadros, brilhos e sombra prontos em vez de redesenhar), pausa durante as cenas e quando o app sai da tela; cenários de luta ficam guardados no aparelho (abrir uma luta deixa de travar ~0,5 s) e são preparados nas folgas. Nova opção **Bateria**: Fundo cheio / Economia (padrão) / Fundo parado. Teste num celular 6× mais lento: processador ocupado caiu de 45% para 26% no menu e de 32% para 22% na luta (9% e 16% com o fundo parado).
- **v2.11** — Atlas 1.0, Etapa 6 (começo): ícone do jogo (Corvo Rei na moldura vermelha e dourada). O jogo agora **instala pelo site**: no Safari, Compartilhar → Adicionar à Tela de Início; abre em tela cheia com o ícone, e o jogo, os efeitos e a imagem de abertura ficam guardados para abrir sem internet (a música e o vídeo de abertura ainda precisam de internet).
- **v2.12** — Atlas 1.0, Etapa 6: **página de privacidade** (`privacidade.html`, o jogo não coleta dado nenhum; resumo em inglês), link "Privacidade" nas Opções e guia da **classificação etária** com as respostas do questionário da Apple (`docs/classificacao-etaria.md`).
- **v2.13** — classificação **9+** (escolha do Theo): "Gole de Hidromel" virou **Gole de Chá de Ervas**, "Beber com os mercenários"/"Ressaca" viraram **Banquete com os mercenários**/**Indigestão** e "Apostar nos dados" virou **Queda de braço com o mercenário**. Os efeitos não mudaram.
- **v2.14** — forma de venda decidida: **grátis com Cavaleiro, Caçadora e Mago**; **Guardião + Necromante** no **Pacote das Trevas** (R$ 9,90, compra única). A tranca já está pronta (cadeado e janela do pacote), mas só liga no app da loja; no site tudo continua liberado. Detalhes em `docs/loja.md`.
- **v2.15** — Atlas 1.0, Etapa 6: **7 fotos da loja** no tamanho do iPhone grande (2868 × 1320, pasta `loja/`) e **todos os textos da App Store** prontos para copiar (nome, subtítulo, texto promocional, descrição, palavras-chave, categorias) em `docs/loja-textos.md`.
- **v2.16** — **Ato 3 sobe a torre**: o mapa da Torre do Corvo agora vai de baixo para cima (Portão → andares com janelas acesas, +15 m a +180 m → Trono do Corvo Rei no topo, com lua e ameias). Textos de "subir", dica da Marta ao chegar no Ato 3 e cena do chefe "O topo da torre". Atos 1 e 2 continuam descendo.
- **Lore** — documento `docs/lore.md`: **A Coroa de Cinco Juramentos** (os cinco companheiros de Aldric, a ligação de cada herói e de cada aliado com a coroa, os finais e o modelo para heróis novos). Ainda não entrou no jogo.
- **v2.17** — Lore no jogo (fases 1 e 2): prólogo **"A Coroa de Cinco Juramentos"** na abertura; textos dos heróis com a família e o juramento; Marta reconhece as famílias na guilda; a Lenda do Ato 2 cita Morvane, Garrel, Ysolda, Bram e Elowen, e cada herói reage pela própria família. Kael agora pede um "banquete" (9+).
