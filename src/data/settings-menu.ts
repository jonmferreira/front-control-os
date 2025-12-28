import type { UserRole } from '@/services/auth';
import { UserRole as UserRoleEnum } from '@/types/roles';

export interface SettingsMenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  allowedRoles?: UserRole[]; // Se não definido, todos têm acesso
}

export interface SettingsMenuGroup {
  id: string;
  label: string;
  items: SettingsMenuItem[];
  allowedRoles?: UserRole[]; // Se não definido, todos têm acesso
}

export const DEFAULT_SECTION = 'painel-os';

export const settingsMenuGroups: SettingsMenuGroup[] = [
  {
    id: 'operacao',
    label: 'Operação',
    items: [
      {
        id: 'painel-os',
        label: 'Painel de OS',
        description: 'Fila por status, prioridades e responsáveis',
        icon: 'pi pi-briefcase',
        allowedRoles: [UserRoleEnum.TECNICO, UserRoleEnum.ANALISTA, UserRoleEnum.ADMINISTRADOR]
      },
      {
        id: 'meus-checklists',
        label: 'Meus Checklists',
        description: 'Checklists pendentes das minhas OS',
        icon: 'pi pi-check-square',
        allowedRoles: [UserRoleEnum.TECNICO]
      },
      {
        id: 'checklists',
        label: 'Gerenciar Checklists',
        description: 'Criar e editar templates de checklist',
        icon: 'pi pi-list-check',
        allowedRoles: [UserRoleEnum.ANALISTA, UserRoleEnum.ADMINISTRADOR]
      }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    allowedRoles: [UserRoleEnum.ADMINISTRADOR], // Apenas administrativo
    items: [
      {
        id: 'equipe',
        label: 'Equipe técnica',
        description: 'Dados operacionais de técnicos e responsáveis',
        icon: 'pi pi-users',
        allowedRoles: [UserRoleEnum.ADMINISTRADOR]
      },
      {
        id: 'credenciais',
        label: 'Credenciais',
        description: 'Regras de login e sessão por perfil',
        icon: 'pi pi-shield',
        allowedRoles: [UserRoleEnum.ADMINISTRADOR]
      }
    ]
  },
  {
    id: 'preferencias',
    label: 'Preferências',
    allowedRoles: [UserRoleEnum.ADMINISTRADOR], // Apenas administrativo
    items: [
      {
        id: 'alertas',
        label: 'Alertas operacionais',
        description: 'Riscos de SLA e falhas de checklist',
        icon: 'pi pi-bell',
        allowedRoles: [UserRoleEnum.ADMINISTRADOR]
      },
      {
        id: 'aparencia',
        label: 'Tema do console',
        description: 'Ajuste modo, densidade e cor de destaque',
        icon: 'pi pi-palette',
        allowedRoles: [UserRoleEnum.ADMINISTRADOR]
      }
    ]
  }
];

export function findMenuItemById(id?: string | null): SettingsMenuItem | undefined {
  if (!id) {
    return undefined;
  }

  return settingsMenuGroups.flatMap((group) => group.items).find((item) => item.id === id);
}

export function isValidSection(id?: string | null): id is string {
  return Boolean(findMenuItemById(id));
}

export function filterMenuByRole(userRole?: UserRole): SettingsMenuGroup[] {
  if (!userRole) return [];

  return settingsMenuGroups
    .filter(group => !group.allowedRoles || group.allowedRoles.includes(userRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.allowedRoles || item.allowedRoles.includes(userRole))
    }))
    .filter(group => group.items.length > 0);
}
