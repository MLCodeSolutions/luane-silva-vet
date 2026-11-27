# Luane Silva — Médica Veterinária

Site institucional da **Luane Silva**, médica veterinária com atendimento domiciliar em Arapiraca (AL) e cidades circunvizinhas. Construído para ser publicado como **um único `index.html`** dentro de um bloco “Incorporar código” do Google Sites, com assets servidos pelo jsDelivr a partir de um commit imutável.

## Conteúdo

- Marca: **Luane Silva** · Médica Veterinária (UFAL)
- WhatsApp: **(82) 99679-5571** (`5582996795571`)
- Instagram: [@luanesilva.vet](https://www.instagram.com/luanesilva.vet)
- Atendimento: Arapiraca, Igaci, Craíbas, Taquarana, Coité do Noia, Limoeiro de Anadia, São Sebastião, Batalha, Lagoa da Canoa e Feira Grande (circunvizinhas com agendamento prévio)
- Serviços: consulta clínica, vacinação, atestado sanitário, consulta on-line, coleta de exames, aplicação de medicamentos, aferição de pressão com Doppler, fluidoterapia, avaliação pré-cirúrgica e curativos

Os dados de contato ficam em [`src/js/site-config.js`](src/js/site-config.js). CRMV, e-mail, Facebook, preços e depoimentos **não** foram informados pela cliente e por isso não aparecem no site — não invente esses dados.

## Animações e movimento

- Reveals ao rolar (`data-reveal`: `up`, `fade`, `scale`, `left`, `right`) com stagger por grupo (`data-reveal-group`).
- Typing do hero, contadores, marquee da galeria e intro de carregamento.
- Barra de progresso do scroll, destaque do item ativo no menu, hover com elevação, brilho nos botões, pin dos locais, zoom suave nas fotos, flutuação do selo do hero e pulso do WhatsApp.
- **Mobile recebe as animações** (não há mais corte por largura de tela).
- `prefers-reduced-motion: reduce` desliga reveals, floats, pulsos e hovers de movimento; todas as animações usam `transform`/`opacity`.
- Economia de dados / 2G (`is-lite`) desliga marquee, reveals e efeitos infinitos para poupar bateria e dados.

## Estrutura

```
assets/
  img/art/          ilustrações SVG (galeria, pets, consulta)
  img/brand/        logo da Luane (lockup completo + marca circular)
  img/client/       foto de estúdio usada no hero e no Sobre
  img/social/       og-luane.jpg (1200x630)
  img/favicon.svg   favicon
  fonts/            WOFF2 de texto + lucide.woff2
src/
  index.html        fonte editável (inclui o <style data-vc-boot>)
  css/              tokens, base, layout, components, illustrations, booking, motion, lucide, app
  js/               site-config, main, booking, motion, app
dist/
  index.html        completo, CSS/JS inline, assets absolutos no jsDelivr
  index-external.html  alternativa com app.css/app.js + SRI
  app.css / app.js  usados só pela variante external
  embed.html        loader (~3,5 KB) para o campo do Google Sites
  manifest.json     inventário legível por máquina
  manifest.md       tabela arquivo → URL → tipo → tamanho
_tools/
  build.mjs         build/inline/rewrite CDN/SRI/manifest/asserts
```

Regras de nome: minúsculas, sem espaço/acento, `[a-z0-9-]`.

## Build

Pré-requisito: Node.js 18+.

```powershell
# QA local (gera dist/preview.html com caminhos ../assets)
node _tools/build.mjs --local

# Build de produção apontando para a tag que será publicada
node _tools/build.mjs --owner=MLCodeSolutions --repo=luane-silva-vet --tag=v1.0.2
```

O build:

- valida se todo asset referenciado existe;
- embute os 9 CSS e os 5 JS na `dist/index.html`;
- reescreve `../assets/` e `url("../../assets/...")` para o jsDelivr com a tag/commit;
- remove comentários de CSS/HTML;
- falha se encontrar `@main`, `raw.githubusercontent.com`, `javascript:`, `innerHTML` ou caminho relativo de asset;
- gera `dist/index-external.html` com `integrity="sha384-..."` e `crossorigin="anonymous"`;
- gera `dist/embed.html`, `dist/manifest.json` e `dist/manifest.md`.

O teste local pode ser servido com `python -m http.server 8765` na raiz e `http://localhost:8765/dist/preview.html`.

## Publicação no GitHub

Pré-requisitos: repositório **público** (o jsDelivr só serve repositórios públicos) e um token com permissão de `repo`, usado apenas em variável de ambiente/one-shot. Nunca cole o token no chat, em arquivos ou no remote do git.

Fluxo (o build aponta para a tag que será criada no commit seguinte, para que a tag contenha o `dist/` final):

```powershell
# 1) Commit A — fonte, assets e config
git add .
git commit -m "feat: site da Luane Silva"
git push origin main

# 2) Build de produção apontando para a TAG NOVA (ex.: v1.0.1)
node _tools/build.mjs --owner=MLCodeSolutions --repo=luane-silva-vet --tag=v1.0.1

# 3) Commit B — dist/
git add dist
git commit -m "build: dist para Google Sites"
git push origin main

# 4) Tag imutável no commit que já contém o dist
git tag -a v1.0.1 -m "v1.0.1"
git push origin v1.0.1
```

- O `dist/` é **commitado**.
- A tag é criada **depois** do commit do `dist`, então a própria tag contém a página e os assets finais.
- Nunca use `--tag=<commit>` de um commit que ainda não tem `dist/`: o loader apontaria para uma página inexistente naquele commit.
- Qualquer alteração exige **nova tag** (`v1.0.2`, ...). Nunca mover, apagar ou reutilizar uma tag já publicada.
- Publicação atual: **v1.0.2** (a `v1.0.0` ficou com o loader apontando para o commit inicial, sem `dist/`).

Verificação rápida das URLs:

```powershell
Get-Content dist/manifest.json | ConvertFrom-Json | ForEach-Object { $_.files } | ForEach-Object { $r = Invoke-WebRequest -Uri $_.url -Method Head -UseBasicParsing; "$($r.StatusCode) $($_.path)" }
```

## Google Sites — passo a passo

1. Abra `sites.google.com` no editor e crie/abra a página que receberá o site.
2. Na engrenagem da página, use **“Ocultar título da página”** (se existir).
3. Em **Tema**, escolha o cabeçalho mínimo/sem banner e remova logo. Oculte a navegação nativa.
4. **Inserir → Incorporar → aba “Incorporar código”**.
   - **Recomendado:** cole `dist/embed.html` (~3,5 KB). Ele mostra a marca enquanto busca a página e depois carrega o site completo.
   - **Alternativa:** cole `dist/index.html` (~200 KB inline) se o campo aceitar.
5. Selecione o bloco e arraste as alças até as quatro bordas; estique a altura ao máximo.
6. Apague todos os outros blocos/seções: a página deve conter **somente** o embed, para não criar rolagem dupla.
7. **Publicar → “Qualquer pessoa”** e abra a URL publicada (não valide só no editor).
8. Teste em **Chrome desktop, Safari iOS e Chrome Android reais**: header grudado, menu mobile, WhatsApp, voltar ao topo, âncoras, lightbox, formulário de agendamento e preloader.

### Limitações do Sites

- O Sites pode manter header/nav/footer conforme o tema; “sem nada nativo” é uma meta, não uma garantia.
- A largura do embed é limitada pela área de conteúdo no desktop; pode haver margem no mobile.
- A altura do bloco é fixa em px; em telas curtas pode ocorrer rolagem externa + interna.
- `title`, meta, OG, canonical e JSON-LD não contam para SEO dentro do embed.
- Analytics está desligado por padrão.

## Segurança

- `.env`, `Fotos/`, `Logo/` e `Informacoes.txt` são locais e **não** entram no repositório (ver `.gitignore`).
- O token do GitHub já foi exposto em histórico de chat — **rotacione-o** após usar. Não reutilize tokens expostos.
- Sem `@main` e sem `raw.githubusercontent.com` (asserts do build).
- Links externos com `rel="noopener noreferrer"`; URLs de config passam por `safeUrl()` (somente `http(s)`).
- Sem backend, e-commerce, carrinho, login ou agendamento real: o wizard é mock e o envio final é um link `wa.me`.

## Pendências / observações

- Fotos reais: apenas a foto de estúdio foi usada; a galeria continua com ilustrações.
- CRMV, e-mail, Facebook, preços e formas de pagamento: não informados — omitidos.
- Depoimentos: os do modelo eram fictícios e foram removidos. Se a cliente enviar depoimentos reais, criar uma seção nova.
- OneDrive + git: pode haver locks; se ocorrer, pause a sincronização durante commits/push.
- Se o campo do Google Sites recusar `dist/index.html`, use `dist/embed.html`.
