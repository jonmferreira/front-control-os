# Fluxo de Integração Contínua

Este repositório do console de ordens de serviço possui um workflow do GitHub Actions em [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
Ele é acionado para todo pull request direcionado à branch `main` e valida o front-end Vue dedicado às OS, dividido em vários jobs que cooperam
por meio de execução condicional, cache e artefatos compartilhados.

## Visão geral dos jobs

```text
Detect Changes ──┐
                 ├─▶ Prepare Dependencies ──┐
                 │                          ├─▶ Build
                 │                          ├─▶ Lint
                 │                          └─▶ Tests
```

### Detect Changes (`changes`)
* **Objetivo**: decidir se os demais jobs devem ser executados.
* **Lógica principal**: utiliza [`dorny/paths-filter`](https://github.com/dorny/paths-filter) para verificar se o pull request alterou algum
  dos caminhos monitorados (`src/**`, `package.json`, arquivos de lock, configs do Vite e do TypeScript).
* **Resultados possíveis**:
  * Quando nenhum arquivo relevante muda, o restante do workflow é ignorado sem falhar o pipeline.
  * Quando os manifestos de dependências mudam, a informação é propagada para que o `npm ci` seja reexecutado.
* **Relatórios**: grava um resumo curto em Markdown no painel de resumo do job.

### Prepare Dependencies (`dependencies`)
* **Objetivo**: disponibilizar um diretório `node_modules` aquecido para os jobs seguintes.
* **Comportamento de cache**:
  * Restaura um cache com chave baseada no hash atual do `package-lock.json`.
  * Executa `npm ci` apenas quando o cache não é encontrado *ou* quando manifestos de dependências mudaram no pull request.
  * Publica o diretório como um artefato de curta duração (`node-modules`) para reutilização.
* **Relatórios**: sempre adiciona uma atualização de status ao resumo com detalhes de hit/miss do cache.

### Build, Lint e Tests
* **Objetivo**: validar o projeto em paralelo quando os pré-requisitos são satisfeitos.
* **Configuração compartilhada**:
  * Dependem dos jobs anteriores e só executam quando `Detect Changes` marcou o pull request como relevante.
  * Restauram o artefato `node-modules` produzido por `Prepare Dependencies` em vez de reinstalar pacotes.
* **Comandos**:
  * `Build`: executa `npm run build`.
  * `Lint`: executa `npm run lint`.
  * `Tests`: executa `npm test --if-present` (o job passa mesmo se não existir script de testes).
* **Relatórios**: cada job registra uma nota de sucesso/erro no resumo para facilitar a revisão.

### Execução local ou via container
- Para reproduzir o pipeline completo em um único comando, use `npm run ci:verify`, que encadeia lint, testes e build usando os mesmos scripts do CI.
- O `docker-compose.yml` expõe um profile opcional `os-ci` que utiliza o estágio `os-ci` do `Dockerfile` para executar lint, testes e build dentro do container: `docker compose --profile ci up --build os-ci`.

## Comportamento de skip
Quando um pull request altera apenas documentação ou outros arquivos não monitorados, o workflow encerra após o
job `Detect Changes`. O GitHub marca os jobs seguintes como "skipped" (não falharam), oferecendo feedback rápido
sem desperdiçar minutos de computação.

## Adicionando resumos mais ricos
Os resumos dos jobs aceitam Markdown estático, então você pode incorporar capturas de tela ou outros artefatos gerados usando a sintaxe
padrão de imagens. Para destacar um build em execução, gere a captura durante o job, envie-a como artefato (ou
armazene-a no workspace) e referencie-a no resumo. Streaming de log em tempo real ou prévia interativa não é suportado.
