# Plano futuro: APIs de música (tops gerais, tops do usuário, playlists)

> Documento de referência, não é um plano ativo de implementação. Guarda o que já foi pesquisado/confirmado pra quando decidirmos investir nisso.

## Contexto

Hoje o perfil tem campos manuais de "artista do momento"/"música favorita", e a rodada em andamento adiciona um autocomplete de busca (Spotify Client Credentials) só pra facilitar o preenchimento — continua sendo a pessoa quem escolhe, não é automático. Este documento organiza as opções pra três necessidades diferentes que foram levantadas: **top geral do momento**, **top pessoal automático** e **playlists**.

## 1. Top geral (charts — "o que está bombando agora", sem depender de nenhum usuário)

| Fonte | Requer OAuth de usuário? | Custo/barreira | Observação |
|---|---|---|---|
| **Last.fm** `chart.getTopArtists` / `chart.getTopTracks`, `geo.getTopArtists`/`geo.getTopTracks` (por país) | Não — só API key | Gratuito | Mais simples de todas; dá pra fazer "Top Brasil" facilmente com `geo.*`. |
| **Spotify** — não tem endpoint de "chart" dedicado, mas as playlists públicas "Top 50 Global"/"Top 50 Brasil" têm ID fixo e dá pra buscar as faixas delas via `/v1/playlists/{id}/tracks` com Client Credentials | Não — Client Credentials | Gratuito | Funciona, mas é "gambiarra elegante" (depender de uma playlist curada pela Spotify, não uma API de chart de verdade). |
| **Apple Music** `/v1/catalog/{storefront}/charts` | Não, mas precisa de token assinado (JWT) com chave privada | **Pago** — exige Apple Developer Program (US$99/ano) | Só vale a pena se decidirmos investir em paridade real com Apple Music; não é gratuito como Spotify/Last.fm. |

**Recomendação quando chegar a hora**: Last.fm pra isso — é de graça, não tem OAuth, e já vamos ter a integração com a API deles pros links de perfil.

## 2. Top pessoal automático (puxar o top de artista/música de cada pessoa de verdade)

| Fonte | Requer OAuth de usuário? | Observação |
|---|---|---|
| **Spotify** `/v1/me/top/tracks`, `/v1/me/top/artists` (escopo `user-top-read`) | **Sim** — fluxo OAuth completo, cada pessoa precisa autorizar | Dado mais rico (período configurável: 4 semanas/6 meses/~1 ano), mas o mais caro de construir (tela de autorização, refresh de token, revogação). |
| **Last.fm** `user.getTopArtists`/`user.getTopTracks` | **Não** — só API key, desde que o perfil da pessoa no Last.fm seja público | Condicionado a cada pessoa ter conta no Last.fm (geralmente conectada ao Spotify via scrobbling) — não é universal, mas zero fricção de auth pra quem já usa. |

**Recomendação quando chegar a hora**: se/quando decidirmos ir além do preenchimento manual, Last.fm é o caminho de menor esforço (a pessoa só cola o link do Last.fm dela, já temos esse campo); Spotify OAuth de verdade só se realmente valer o investimento de engenharia (tela de auth, tokens, revogação).

## 3. Playlists — a parte mais fácil de todas

Isso **não precisa de nenhuma API, chave ou credencial**: mesma técnica de embed que já existe pra vídeo do YouTube/Vimeo em [`video-embed.ts`](../src/lib/video-embed.ts) (`getVideoEmbedUrl`). Um link de playlist do Spotify (`open.spotify.com/playlist/{id}`) vira um iframe de embed (`open.spotify.com/embed/playlist/{id}`) só reconhecendo o padrão da URL — sem OAuth, sem API key, sem Client Credentials.

Isso já tinha sido identificado como uma adição pequena e nunca chegou a ser construída (ficou registrado numa conversa anterior sobre agendamento/playlists). Quando for a hora:
- Adicionar `open.spotify.com`/`music.apple.com` em `getVideoEmbedUrl` (ou um `getMusicEmbedUrl` separado, já que o tamanho do iframe de playlist é diferente de vídeo — normalmente mais baixo, tipo 152px–352px em vez de 16:9).
- Ajustar o `MdxContent`/bio pra usar a altura certa quando for um embed de música, não de vídeo.

**Esse é o item de menor esforço dos três — dá pra fazer isoladamente, sem esperar nenhuma decisão sobre Spotify/Last.fm dos outros dois pontos.**
