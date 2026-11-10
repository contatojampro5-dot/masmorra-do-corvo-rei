# Plano Real de Desenvolvimento — Atlas 1.0

Objetivo: levar **Masmorra do Corvo Rei** do navegador para a **App Store**, jogável e confortável no celular.
Cada etapa termina com o jogo publicado (GitHub Pages + artifact), testado pela Hera e com uma linha em "Versões" no README.

Versão em PDF: [Plano-Atlas-1.0.pdf](Plano-Atlas-1.0.pdf).

**Ponto de checagem:** quando uma etapa testável termina, o Zeus pergunta ao Theo se já pode seguir, e a próxima etapa só começa com o OK. Papelada e decisões (Etapa 6) não precisam dessa pergunta.

| Etapa | Nome | Responsáveis (Olimpo) | Situação |
|---|---|---|---|
| 1 | Celular | Hermes, Hefesto, Hera | ✅ v2.1 |
| 2 | Som | Apolo | ✅ v2.4 (músicas) e v2.5 (efeitos) |
| 3 | Primeira jornada | Atena, Apolo | ✅ v2.8 |
| 4 | Leveza e bateria | Hélio, Hefesto | ✅ v2.10 |
| 5 | O app | Hefesto | ⏸ pulada por enquanto (pedido do Theo) — no lugar, o jogo já instala pelo site (v2.11) |
| 6 | A loja | Hermes, Afrodite | 🔄 ícone (v2.11), privacidade e classificação etária (v2.12) prontos; faltam fotos, descrição e a decisão de venda |
| — | Depois do 1.0: inglês e novidades | Apolo | ⬜ |

## Etapa 1 — Celular ✅ (v2.1)
- Botão DEV escondido na versão normal (só aparece com o endereço terminado em `#dev`).
- Fontes dentro do jogo (funciona sem internet).
- Dicas com **toque longo** (cartas, efeitos, intenção dos inimigos, relíquias, poções).
- Jogo pensado para o celular **deitado**: aviso para girar quando estiver em pé.
- Botões maiores para o dedo (poções, pilhas, barra de cima).
- Tela de **Opções**: cenas (sempre / só a primeira vez / nunca), velocidade das falas, falas na luta, vibração.

## Etapa 2 — Som
- Música por ato (Masmorra, Catacumbas, Torre), música de chefe e das cenas.
- Efeitos: cartas, golpes, bloqueio, tochas, moedas, carimbo da guilda.
- Vibração ao levar dano e ao vencer chefe.
- Volume de música e de efeitos nas Opções.
- Só sons com licença livre ou feitos para o jogo.

## Etapa 3 — Primeira jornada
- Primeira luta ensinando a jogar (energia, intenção, bloqueio), com setas e falas da Marta.
- Dicas que aparecem uma vez (primeira Forja, primeiro evento, primeira loja).
- O jogo lembra as cenas já vistas (liga com a opção "só a primeira vez").

## Etapa 4 — Leveza e bateria
- Fundo animado mais leve e pausado quando o app sai da tela.
- Cenários prontos guardados para não redesenhar.
- Teste de quadros por segundo num celular simples.

## Etapa 5 — O app
- Embrulhar o jogo com **Capacitor** (app iPhone).
- Salvar no armazenamento do iPhone (e iCloud, se possível), não só no navegador.
- Travar a tela deitada, ícone e tela de abertura.
- Funcionar 100% sem internet.
- Precisa do Theo: conta de desenvolvedor Apple (US$ 99/ano) e um Mac ou serviço de montagem na nuvem.

## Etapa 6 — A loja
- Página de privacidade (o jogo não coleta dados).
- Classificação etária (por volta de 9+, violência de fantasia).
- Ícone, fotos da loja e texto de descrição.
- Teste com amigos pelo TestFlight antes de lançar.
- Decisão do Theo: jogo pago, grátis com anúncios ou grátis com parte paga.

## Depois do 1.0
- Versão em inglês.
- Ideias guardadas: arco de Liora, diário do mago dos corvos, Necromante virando corvo, Ato 4 secreto do mago.
