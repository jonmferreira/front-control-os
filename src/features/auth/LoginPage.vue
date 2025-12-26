<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
    <Card class="w-full max-w-md">
      <template #title>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Console de Ordens de Serviço</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Faça login para continuar
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium mb-1">
              Email
            </label>
            <InputText
              id="email"
              v-model="credentials.email"
              type="email"
              class="w-full"
              placeholder="seu@email.com"
              :invalid="!!errors.email"
              autocomplete="email"
            />
            <small v-if="errors.email" class="text-red-500">
              {{ errors.email }}
            </small>
          </div>

          <!-- Senha -->
          <div>
            <label for="password" class="block text-sm font-medium mb-1">
              Senha
            </label>
            <Password
              id="password"
              v-model="credentials.password"
              class="w-full"
              :feedback="false"
              toggle-mask
              placeholder="••••••••"
              :invalid="!!errors.password"
              autocomplete="current-password"
            />
            <small v-if="errors.password" class="text-red-500">
              {{ errors.password }}
            </small>
          </div>

          <!-- Error Message -->
          <Message v-if="loginError" severity="error" :closable="false">
            {{ loginError }}
          </Message>

          <!-- Submit -->
          <Button
            type="submit"
            label="Entrar"
            class="w-full"
            :loading="loading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Password from 'primevue/password';

// Integrations
import { login } from './integrations/api';

// ============================================
// STATE
// ============================================

const router = useRouter();
const loading = ref(false);
const loginError = ref('');

const credentials = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

// ============================================
// VALIDATION
// ============================================

function validateForm(): boolean {
  errors.email = '';
  errors.password = '';

  if (!credentials.email) {
    errors.email = 'Email é obrigatório';
    return false;
  }

  if (!credentials.email.includes('@')) {
    errors.email = 'Email inválido';
    return false;
  }

  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
    return false;
  }

  if (credentials.password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres';
    return false;
  }

  return true;
}

// ============================================
// FUNCTIONS
// ============================================

async function handleLogin() {
  loginError.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await login(credentials);
    router.push('/os');
  } catch (e) {
    loginError.value = e instanceof Error ? e.message : 'Erro ao fazer login';
  } finally {
    loading.value = false;
  }
}
</script>
