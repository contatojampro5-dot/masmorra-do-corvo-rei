# MASMORRA DO CORVO REI — guia para o Claude (leia antes de mexer)

Roguelike de cartas em pixel art. Dono: Theo (GitHub `contatojampro5-dot`), chama o assistente de **"Zeus"**, chefe do
**Olimpo** (Hefesto = engenharia, Hera = testes, Afrodite = arte, Apolo = som/falas/cenas, Atena = regras, Hermes = celular/loja,
Deméter = cenário, Hélio = luz/efeitos). Responda sempre em português, simples e direto. Theo é iniciante em GitHub: explicar passo a passo.

- Jogável: https://contatojampro5-dot.github.io/masmorra-do-corvo-rei/ (GitHub Pages, branch `main`, raiz).
- Também publicado como artifact: https://claude.ai/artifact/HHbsk4MDv8hyVKrJ3A77TG (manter os dois iguais).
- O jogo está em `index.html` (arquivo único). Ao lado: `abertura.mp4`/`abertura.jpg` (vídeo de abertura), `musica/` (15 músicas),
  `sfx/` (18 efeitos), `icones/` + `manifest.webmanifest` + `sw.js` (instalar e abrir sem internet; subir a versão `V` do `sw.js` a cada entrega),
  `privacidade.html` (página da App Store) e `loja/` (fotos da loja). DEV só com o endereço terminado em `#dev`.
- Ferramentas: `tools/musica/` (gera as músicas), `tools/sfx/` (gera os efeitos, usa os instrumentos de `tools/musica/`), `tools/loja/` (fotos da loja).
- Documentos: `docs/` (plano Atlas, lore, loja, textos da loja, classificação etária).

## Regras do Theo
- Toda entrega vai para o GitHub (commit + push em `main`) e ganha uma linha em "Versões" no `README.md`.
- Mensagem de commit curta em português começando pela versão (ex.: `v2.2: ...`).
- Mostrar print/foto antes de colocar arte nova no jogo.
- Separar os pedidos pelo Olimpo ao responder (quem fez o quê).
- Se o Theo não responder uma pergunta de escolha em 2 minutos, decidir e avisar.
- **Ponto de checagem (Plano Atlas 1.0):** ao terminar uma etapa testável, perguntar ao Theo se pode seguir para a próxima e esperar o OK. Coisas não testáveis (papelada, decisões) não precisam da pergunta.
- **Classificação 9+:** nada de bebida alcoólica, apostas/jogos de azar ou palavrões em cartas, eventos, falas e cenas novas (ver `docs/classificacao-etaria.md`).
- **Respeito à fé do Theo:** nos quadros do Olimpo e em qualquer texto sobre os deuses gregos, escrever **"deus"/"deuses" com d minúsculo**. "Deus" com D maiúsculo só para o Deus vivo, nunca para personagens, mitologia ou o Olimpo.

## Lore
`docs/lore.md` — "A Coroa de Cinco Juramentos" (aprovada pelo Theo em 10/11/2026). Falas, cenas, cartas e heróis novos seguem esse documento.

## Plano atual
`docs/plano-atlas-1.0.md` e `docs/Plano-Atlas-1.0.pdf` — do navegador até a App Store em 6 etapas.
