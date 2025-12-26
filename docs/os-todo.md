# Plano de trabalho — Sistema de Ordem de Serviço (OS)

Este documento descreve o backlog inicial para migrar o projeto para o contexto de ordens de serviço, removendo referências ao antigo domínio e organizando as entregas para o front-end (Vue) — com ganchos para API e DevOps quando necessário.

## Objetivos gerais
- Autenticação contra API e controle de sessão por perfil (técnico, técnico responsável, gerente).
- CRUD completo de OS com checklist associada, fotos de comprovação e histórico de status.
- Checklist com itens parametrizáveis e inputs customizados renderizados via componentes dinâmicos.
- Dashboards por perfil (produção diária, status de OS, meta vs realizado, desempenho por colaborador).
- Containerização/Docker e CI/CD ajustados ao novo contexto de OS.

## Modelo de domínio proposto (frente + API)
- **Ordem de Serviço (OS)**: id, título, status (pendente, em andamento, finalizada), descrição, responsável técnico, timestamps, anexos (foto/URL), checklistId.
- **Checklist**: id, título, data de atualização, responsável técnico criador, itens[].
- **Item de Checklist**: id, descrição, hasCustomInput (bool), customInputId, valor (aprovado/rejeitado/não se aplica), evidências (fotos/links), observação.
- **Input Customizado**: id, nome, jsonBody (estrutura do form), componenteVue (ex.: `DadosCarro`) para renderização dinâmica.
- **Meta de Produção**: id, período (dia/semana/mês), metaNumOS, responsável pela definição, timestamps.

## Backlog — Front-end (Vue)
### Fase 0 — Higienização do contexto
- [x] Remover textos/imagens/configs do domínio antigo (estacionamento) de componentes, rotas, cópia e testes.
- [x] Atualizar README e docs para refletir o domínio de OS e o fluxo de checklist customizado.
- [x] Conferir variáveis de ambiente e configs (ex.: base URLs) para nomes alinhados ao novo domínio.

### Fase 1 — Fundamentos e autenticação
- [x] Ajustar layout/base (tema, shells) para o novo wording.
- [x] Implementar fluxo de login com chamada real à API e persistência do token.
- [x] Guard de rotas por perfil (técnico, responsável, gerente) e fallback de sessão expirada.
- [ ] Service layer para API (OS, checklist, inputs customizados, metas) com tipagem e interceptors (auth + carregamento de perfil com mock/fallback prontos; demais recursos ainda desconectados da API real).

### Fase 2 — CRUD de OS e checklist
- [x] Tela de lista de OS com três abas: **Pendentes**, **Em andamento**, **Finalizadas**; ações "Iniciar" (técnico) e abertura do detalhe.
- [x] Tela de detalhe/edição da OS com descrição, status, histórico e upload/visualização de fotos.
- [x] Vincular checklist à OS: renderizar itens, selecionar valor (aprovado/rejeitado/não se aplica) e anotar observações.
- [x] Componente dinâmico de input customizado: dado `hasCustomInput=true` e `customInputId`, renderizar o componente mapeado (ex.: `DadosCarro`) com schema `jsonBody`.
- [x] Validações: campos obrigatórios (título, responsável), checklist sem pendências antes de finalizar, tamanho/formatos de foto.

### Fase 3 — Gestão de checklist e inputs customizados (perfil: técnico responsável)
- [x] CRUD de checklists: criar/editar título, responsável, data de atualização, itens (estado local; persistência em API pendente).
- [x] CRUD de itens: descrição, toggle de input customizado, seleção do componente customizado e valor default com opção obrigatória.
- [x] Biblioteca de componentes customizados (ex.: `DadosCarro`) mapeados por `customInputId` → componente Vue; preview do form via `jsonBody` disponível na tela.
- [x] Reordenação de itens via drag-and-drop mantendo a ordem local e renumerando posição.
- [x] Versionamento leve: aviso quando checklist usada em OS finalizada for alterada (bump automático de versão ao salvar alterações).

### Fase 4 — Dashboards e gráficos (próxima prioridade)
- [x] **Técnico**: gráfico de OS realizadas por dia (últimos 30 dias) + tabela de OS pendentes/andamento/finalizadas com ação de iniciar.
- [x] **Técnico responsável**: visão de produtividade da equipe para priorizar criação/ajuste de checklists.
- [x] **Gerente**: gráficos de OS pendentes vs realizadas vs meta (dia/semana/mês); curva de OS por funcionário (6 meses) para detectar burnout; gráfico individual por colaborador com filtro.
- [x] Configuração de metas: formulário para definir meta diária/semanal/mensal consumindo API de metas.

### Fase 5 — UX, acessibilidade e qualidade
- [x] Estados de carregamento/erro/empty em todas as telas de OS/checklist.
- [x] Upload de fotos com preview e fallback quando offline (PWA opcional).
- [x] Acessibilidade: navegação por teclado e labels/ARIA nos formulários dinâmicos.
- [x] Testes unitários de componentes-chave (checklist renderer, custom input mapper) e testes de integração de rotas protegidas.

### Fase 6 — Infra/DevOps
- [x] Atualizar Dockerfile e docker-compose para serviços renomeados ao contexto de OS.
- [x] Ajustar pipelines de CI/CD (lint, tests, build) para refletir novos scripts/variáveis.
- [x] Templates de deploy (ex.: Vercel/containers) alinhados ao novo naming e variáveis de API.

## Notas sobre a API (apoio ao front)
- Sugestão: API em C# usando CodeFirst para OS, Checklist, Item, InputCustomizado e Metas; endpoints REST versionados.
- Endpoints prioritários: autenticação, CRUD de OS (com upload), CRUD de checklist/itens, CRUD de inputs customizados, consulta de métricas e metas.
- Checklist pode ser fixa ou mantida em banco; priorizar busca dinâmica para reordenar e reutilizar.

## Referências de UI
- Componentização de formulários dinâmicos (mapa id → componente Vue) para casos como `DadosCarro` (chassi, placa, modelo, ano) com binding no valor do item.
- Tabelas com filtros por status e busca por título/responsável.
- Gráficos: usar lib já adotada no projeto (ou adicionar) para linhas/colunas comparando período e meta.

---
Este plano é iterativo; cada fase deve gerar incrementos testáveis e removendo gradualmente o legado do contexto anterior.
