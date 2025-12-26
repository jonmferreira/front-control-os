# Deploy na Vercel

Guia resumido para publicar este projeto na [Vercel](https://vercel.com/).

## ✅ Pré-requisitos

- Conta na Vercel.
- Repositório Git com o projeto (GitHub, GitLab ou Bitbucket) **ou** Vercel CLI instalada (`npm i -g vercel`).
- Variáveis de ambiente não são necessárias por padrão, mas você pode adicioná-las na seção *Environment Variables* (`VITE_OS_API_BASE_URL`, `VITE_OS_APP_TITLE`).  

## 1. Deploy via integração Git (recomendado)

1. Faça login em [vercel.com/new](https://vercel.com/new) e conecte a conta Git.
2. Escolha o repositório com este projeto.
3. Na etapa de configuração confirme os valores:
   - **Framework Preset:** `Vite` (Vercel detecta automaticamente).
   - **Build Command:** `npm run build`.
   - **Output Directory:** `dist`.
   - **Install Command:** `npm install` (padrão).
4. Clique em **Deploy** e aguarde o primeiro build.
5. Acesse a URL gerada. Cada push na branch monitorada dispara um novo deploy automático.

## 2. Deploy via Vercel CLI

1. Autentique-se: `vercel login`.
2. No diretório do projeto, execute `vercel` e informe:
   - Nome do projeto e diretório (`.`).
   - Comandos de build/instalação iguais à configuração acima.
   - Diretório de saída: `dist`.
3. Para produção, rode `vercel --prod` após revisar o preview.

## 3. Pós-deploy

- Ative Preview Deployments para cada pull request.
- Configure domínios customizados em **Settings → Domains**.
- Ajuste headers de cache e segurança em **Settings → Headers** se necessário.

## 4. Solução de problemas

| Erro/Comportamento                     | Como resolver                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| Build falha por dependências ausentes | Verifique `package.json` e reinstale localmente (`npm install`).              |
| Página em branco após deploy          | Confirme se o build foi feito com `npm run build` e se a pasta `dist` existe. |
| Mudanças de tema não persistem        | Limpe o cache do navegador; a preferência usa `localStorage`.                 |
 | Assets 404 (CSS PrimeVue)             | Garanta que `lara-light-blue.css` e `lara-dark-blue.css` estejam em `public/`.|

## 5. Atualização contínua

- Crie *Preview Deployments* para validar features antes de mesclar.
- Use *Environment Variables* para apontar para a API de ordens de serviço e customizar o título do console.
- Ative *Analytics* e *Monitoring* da Vercel para acompanhar performance.

Pronto! O console de ordens de serviço estará disponível em produção com poucos cliques.
