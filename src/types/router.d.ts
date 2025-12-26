import type { UserRole } from '@/services/auth';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    allowedRoles?: UserRole[];
  }
}
