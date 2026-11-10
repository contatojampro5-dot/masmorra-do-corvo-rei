# Loja — como o jogo é vendido

Decisão do Theo (10/11/2026): **grátis, com 3 personagens liberados**.

| | |
|---|---|
| Grátis | **Cavaleiro Errante**, **Caçadora das Brumas**, **Mago Arcano** |
| Pago | **Pacote das Trevas**: **Guardião de Ferro** + **Necromante**, juntos |
| Preço | **R$ 9,90** (US$ 1,99), compra única, para sempre ("non-consumable" na App Store) |
| Anúncios | Nenhum |

## Como está no jogo (v2.14)
- A tranca existe, mas **só liga no app da loja** (Capacitor). No site fica tudo liberado, porque no site não há como pagar.
- No app, os dois heróis aparecem apagados com o cadeado "Pacote das Trevas"; tocando, abre a janela do pacote com o preço.
- Para ver a tranca no site (teste): no console do navegador, `localStorage.setItem('trc-tranca','1')`, e recarregar. Para tirar: `localStorage.removeItem('trc-tranca')`.
- O modo DEV (`#dev`) destranca tudo.
- Comprado: o jogo guarda `trc-pack = 1`. Falta ligar o botão de compra de verdade (StoreKit) quando a Etapa 5 (app) for feita, incluindo o botão "Restaurar compras" que a Apple exige.

## O que muda nos papéis da loja
- Classificação: In-App Purchases = **Yes** (pacote único). Anúncios = No.
- Privacidade: a compra é feita pela Apple; o jogo continua sem coletar dados.
