/**
 * Enum de perfis de usuário do sistema
 */
export enum UserRole {
  TECNICO = 'tecnico',
  ANALISTA = 'analista',
  ADMINISTRADOR = 'administrador'
}

/**
 * Labels de exibição para cada perfil
 */
export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.TECNICO]: 'TÉCNICO',
  [UserRole.ANALISTA]: 'ANALISTA',
  [UserRole.ADMINISTRADOR]: 'ADMINISTRADOR'
};

/**
 * Labels amigáveis para cada perfil
 */
export const UserRoleFriendlyLabel: Record<UserRole, string> = {
  [UserRole.TECNICO]: 'Técnico de campo',
  [UserRole.ANALISTA]: 'Analista de Dados',
  [UserRole.ADMINISTRADOR]: 'Gerente'
};

/**
 * Ícones para cada perfil
 */
export const UserRoleIcon: Record<UserRole, string> = {
  [UserRole.TECNICO]: 'pi pi-wrench',
  [UserRole.ANALISTA]: 'pi pi-chart-line',
  [UserRole.ADMINISTRADOR]: 'pi pi-briefcase'
};
