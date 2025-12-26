# Console de Ordens de Serviço (Vue + PrimeVue)

Painel web para acompanhar a operação de ordens de serviço, alinhar checklists customizados e ajustar preferências do time técnico. O layout usa Vue 3, PrimeVue e Tailwind para entregar uma experiência responsiva com suporte a modo claro/escuro e navegação por rotas protegidas.

## ✨ Principais recursos

- Visão inicial com fila de OS por status, riscos de SLA e andamento dos checklists.
- Menu por áreas operacionais: painéis de OS, cadastros da equipe, credenciais e alertas.
- Ajustes rápidos para checklists obrigatórios, uploads de evidências e integrações externas.
- Preferências de tema e densidade para alinhar o console à identidade da operação.
- Storybook configurado para evoluir os componentes de interface.

## 🛠️ Stack utilizada

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [PrimeVue](https://www.primefaces.org/primevue/) e PrimeIcons
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest) para dados reativos
- [Storybook 10](https://storybook.js.org/) para documentação de UI

## 🚀 Como executar

1. Copie o arquivo de variáveis de ambiente e ajuste os valores conforme sua API de OS:

   ```bash
   cp .env.example .env
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação fica acessível em [http://localhost:5173/os](http://localhost:5173/os).

4. Execute o Storybook (opcional):

   ```bash
   npm run storybook
   ```

   A documentação de componentes abre em [http://localhost:6006](http://localhost:6006).

5. Para gerar o build de produção:

   ```bash
   npm run build
   ```

   Depois visualize o resultado com:

   ```bash
   npm run preview
   ```

### Variáveis de ambiente

As variáveis usam o prefixo `VITE_` para ficarem disponíveis no client:

- `VITE_OS_API_BASE_URL`: URL base da API de ordens de serviço (ex.: `http://localhost:3333`).
- `VITE_OS_APP_TITLE`: nome do console exibido no topo do layout.

Um exemplo preenchido está em `.env.example`.

### ▶️ Executar com Docker

Também é possível subir o ambiente de desenvolvimento sem instalar o Node localmente. Certifique-se de ter o [Docker](https://docs.docker.com/get-docker/) e o [Docker Compose](https://docs.docker.com/compose/) instalados e então execute:

```bash
docker compose up --build
```

O comando monta os arquivos do projeto no container, instala dependências e inicia o Vite em modo desenvolvimento na porta `5173`. Ao finalizar, derrube o serviço com `Ctrl+C`. Para executar em segundo plano, utilize `docker compose up -d` e finalize com `docker compose down`. Os serviços ativos são `os-web` (console das OS) e `os-storybook` (documentação de componentes), e há um profile opcional `os-ci` para rodar lint, testes e build dentro do container.

## 🗂️ Estrutura de pastas

```
src/
├── assets/            # Estilos globais (Tailwind + ajustes PrimeVue)
├── components/        # Componentes de interface reutilizáveis
├── composables/       # Hooks reativos (tema, queries, media query)
├── config/            # Configurações de ambiente do console de OS
├── data/              # Definições de navegação e menus
├── router/            # Configuração do Vue Router
└── views/             # Telas e seções do painel de OS
```

As histórias do Storybook vivem próximas aos componentes (`*.stories.ts`).

## 🧭 Navegação e comportamento

- A rota base `/os` abre a visão geral com fila de OS e atalhos para checklists e alertas.
- Em telas grandes o menu lateral permanece visível; em mobile, a navegação usa back para alternar entre menu e conteúdo.
- O tema selecionado (claro ou escuro) é reaplicado automaticamente na próxima visita.
- O botão "Sair" abre um `DynamicDialog` de confirmação; a confirmação é tratada com um log (mockado).

## 📦 Scripts disponíveis

| Comando               | Descrição                                      |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Inicia o Vite em modo desenvolvimento          |
| `npm run build`       | Gera build de produção                         |
| `npm run preview`     | Visualiza o build gerado                       |
| `npm run lint`        | Checa os tipos com `vue-tsc`                   |
| `npm run ci:verify`   | Executa lint, testes e build em sequência      |
| `npm run storybook`   | Abre o Storybook com a documentação de UI      |
| `npm run build-storybook` | Gera a versão estática do Storybook       |

## 📄 Guia de deploy

Consulte o arquivo [`VERCEL_DEPLOY.md`](./VERCEL_DEPLOY.md) para o passo a passo de publicação na Vercel.

## 🔁 Fluxo de CI

Para entender como o pipeline de integração contínua foi estruturado, veja o guia dedicado em [`docs/ci-workflow.md`](./docs/ci-workflow.md).

---

Feito com ❤️ para acelerar a operação de ordens de serviço.
