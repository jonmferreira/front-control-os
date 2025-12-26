import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { OS_API_BASE_URL } from '@/config/env';
import { useAuth } from './useAuth';
import type { AuthProfile } from '@/services/auth';
import { isSessionExpired, SessionExpiredError } from '@/services/auth';

export interface ProfileSettings {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  birthday: string;
  language: string;
  role?: string;
}

const PROFILE_QUERY_KEY = ['profile-settings'];

const PROFILE_ENDPOINT = `${OS_API_BASE_URL}/profiles/current`;

async function fetchProfile(token?: string, fallbackProfile?: AuthProfile | null): Promise<ProfileSettings> {
  try {
    const response = await fetch(PROFILE_ENDPOINT, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });

    if (response.status === 401) {
      throw new SessionExpiredError();
    }

    if (!response.ok) {
      throw new Error('Erro ao carregar perfil');
    }

    const data = await response.json();
    return normalizeProfile(data);
  } catch (error) {
    if (fallbackProfile) {
      console.warn('[mock] Não foi possível buscar perfil na API. Usando dados da sessão.', error);
      return normalizeProfile({
        id: fallbackProfile.id,
        name: fallbackProfile.name,
        username: fallbackProfile.username ?? fallbackProfile.id,
        email: fallbackProfile.email,
        phone: '',
        bio: '',
        location: '',
        birthday: new Date().toISOString(),
        language: 'pt-BR',
        role: fallbackProfile.role
      });
    }
    throw error;
  }
}

function normalizeProfile(profile: any): ProfileSettings {
  return {
    id: profile.id ?? 'user-1',
    name: profile.name ?? 'Usuário do console',
    username: profile.username ?? 'os-user',
    email: profile.email ?? 'usuario@os.app.br',
    phone: profile.phone ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    birthday: profile.birthday ?? new Date().toISOString(),
    language: profile.language ?? 'pt-BR',
    role: profile.role
  };
}

export function useProfileSettings() {
  const auth = useAuth();

  const queryFn = async () => {
    try {
      return await fetchProfile(auth.session.value.token ?? undefined, auth.session.value.profile);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        auth.logout();
      }
      throw error;
    }
  };

  return useQuery({
    queryKey: computed(() => [...PROFILE_QUERY_KEY, auth.session.value.profile?.id ?? 'anonymous']),
    queryFn,
    enabled: computed(() => auth.isAuthenticated.value && !isSessionExpired(auth.session.value.expiresAt)),
    staleTime: 1000 * 60 * 5,
    retry: false
  });
}
