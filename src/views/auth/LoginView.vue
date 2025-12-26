<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_45%)]" />
    <div class="pointer-events-none absolute left-[-12%] top-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
    <div class="pointer-events-none absolute right-[-14%] top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

    <div class="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 lg:px-6 lg:py-16">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">Console OS</p>
          <h1 class="text-3xl font-bold leading-tight text-white lg:text-4xl">{{ appTitle }}</h1>
          <p class="mt-2 max-w-2xl text-sm text-slate-200 lg:text-base">
            Acompanhe ordens de serviço com contexto em tempo real, checklists obrigatórios e perfis alinhados à operação.
          </p>
        </div>
        <Tag value="Acesso seguro" severity="success" class="self-start" />
      </header>

      <div class="mt-8 grid flex-1 gap-6 lg:grid-cols-2">
        <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-emerald-200">Shell operacional</p>
              <h2 class="text-2xl font-semibold text-white">Checklist + OS em um só lugar</h2>
              <p class="mt-2 text-sm text-slate-200">
                Painel com fila de OS, status de checklist, alertas críticos e atalhos rápidos por perfil.
              </p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p class="text-xs uppercase tracking-wide text-emerald-100">Último SLA crítico</p>
              <p class="text-2xl font-semibold text-white">+3h</p>
              <p class="text-xs text-slate-200">Checklist em atraso</p>
            </div>
          </div>

          <ul class="mt-6 grid gap-4 text-sm text-slate-100 lg:grid-cols-2">
            <li class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-lg text-emerald-200">
                <i class="pi pi-verified"></i>
              </span>
              <div>
                <p class="font-semibold">Checklists obrigatórios</p>
                <p class="text-xs text-slate-200">Inputs customizados e bloqueio de conclusão sem evidências.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-lg text-cyan-200">
                <i class="pi pi-chart-line"></i>
              </span>
              <div>
                <p class="font-semibold">Dashboards por perfil</p>
                <p class="text-xs text-slate-200">Ritmo diário, pendências e meta vs realizado por técnico.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg text-indigo-200">
                <i class="pi pi-link"></i>
              </span>
              <div>
                <p class="font-semibold">Autenticação centralizada</p>
                <p class="text-xs text-slate-200">Sessão por perfil (técnico, responsável, gerente) com refresh curto.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-lg text-amber-200">
                <i class="pi pi-shield"></i>
              </span>
              <div>
                <p class="font-semibold">Rotas protegidas</p>
                <p class="text-xs text-slate-200">Guard de sessão expirada e acesso limitado por escopo.</p>
              </div>
            </li>
          </ul>
        </section>

        <Card class="login-card-gradient h-full rounded-3xl border border-white/10 shadow-2xl backdrop-blur lg:ml-auto lg:w-full">
          <template #title>
            <div class="flex items-center justify-between">
              <span>Entrar no console</span>
              <Tag value="OS + Checklists" severity="info" />
            </div>
          </template>
          <template #content>
            <form class="space-y-5" @submit.prevent="handleSubmit">
              <Message v-if="sessionMessage" severity="warn" :closable="false" class="rounded-xl">{{ sessionMessage }}</Message>
              <Message v-if="errorMessage" severity="error" :closable="false" class="rounded-xl">{{ errorMessage }}</Message>

              <div class="space-y-3">
                <span class="p-float-label">
                  <InputText id="identifier" v-model="form.identifier" class="w-full" autocomplete="username" />
                  <label for="identifier">E-mail ou usuário</label>
                </span>
                <span class="p-float-label">
                  <Password
                    id="password"
                    v-model="form.password"
                    class="w-full"
                    :feedback="false"
                    toggle-mask
                    input-class="w-full"
                    autocomplete="current-password"
                  />
                  <label for="password">Senha</label>
                </span>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div class="flex items-center gap-2">
                  <Checkbox id="remember" v-model="remember" binary />
                  <label for="remember" class="text-slate-600">Manter sessão estendida</label>
                </div>
                <span class="text-xs text-slate-500">Revalidação automática em acessos longos.</span>
              </div>

              <Button
                type="submit"
                label="Acessar painel"
                icon="pi pi-sign-in"
                class="w-full justify-center"
                :loading="loading"
              />

              <div class="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Perfis disponíveis</p>
                <div class="mt-3 grid gap-2 md:grid-cols-3">
                  <Button
                    v-for="option in quickIdentities"
                    :key="option.identifier"
                    type="button"
                    size="small"
                    class="justify-between"
                    severity="secondary"
                    text
                    @click="applyIdentity(option)"
                  >
                    <span class="flex items-center gap-2 text-left">
                      <i :class="['pi', option.icon]" aria-hidden="true"></i>
                      <span class="text-sm font-semibold text-slate-700">{{ option.label }}</span>
                    </span>
                    <Tag :value="option.roleLabel" severity="secondary" class="ml-auto text-xs uppercase" />
                  </Button>
                </div>
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Tag from 'primevue/tag';
import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import { OS_APP_TITLE } from '@/config/env';

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const form = reactive({
  identifier: '',
  password: ''
});

const remember = ref(true);
const loading = ref(false);
const errorMessage = ref('');

const redirectPath = computed(() => {
  const redirect = route.query.redirect;
  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/os';
});

const sessionMessage = computed(() => {
  const reason = route.query.reason;
  if (reason === 'expired') {
    return 'Sua sessão expirou. Faça login novamente para continuar navegando.';
  }
  if (reason === 'forbidden') {
    return 'Seu perfil não tem permissão para acessar a área solicitada.';
  }
  if (reason === 'unauthorized') {
    return 'Faça login para abrir o console de ordens de serviço.';
  }
  return '';
});

const quickIdentities = [
  { label: 'Técnico de campo', identifier: 'tecnico@os.app.br', password: 'Admin@123', roleLabel: 'Técnico', icon: 'pi pi-wrench' },
  { label: 'Responsável', identifier: 'responsavel@os.app.br', password: 'Admin@123', roleLabel: 'Resp.', icon: 'pi pi-users' },
  { label: 'Gerente', identifier: 'gerente@os.app.br', password: 'Admin@123', roleLabel: 'Gerente', icon: 'pi pi-briefcase' }
];

const appTitle = OS_APP_TITLE;

const applyIdentity = (identity: (typeof quickIdentities)[number]) => {
  form.identifier = identity.identifier;
  form.password = identity.password;
  errorMessage.value = '';
};

const handleSubmit = async () => {
  console.log('[LoginView] handleSubmit chamado', form);
  errorMessage.value = '';
  loading.value = true;

  try {
    console.log('[LoginView] Chamando auth.login()');
    await auth.login({ ...form }, { remember: remember.value });
    console.log('[LoginView] Login com sucesso, redirecionando para:', redirectPath.value);
    await router.replace(redirectPath.value);
    console.log('[LoginView] Redirecionamento completo');
  } catch (error) {
    console.error('[LoginView] Erro no login:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Não foi possível realizar login';
  } finally {
    loading.value = false;
  }
};
</script>
