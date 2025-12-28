export interface SettingsMenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  allowedRoles?: string[]; // Se não definido, todos têm acesso
}

export interface SettingsMenuGroup {
  id: string;
  label: string;
  items: SettingsMenuItem[];
  allowedRoles?: string[]; // Se não definido, todos têm acesso
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
        allowedRoles: ['tecnico', 'responsavel', 'gerente']
      },
      {
        id: 'meus-checklists',
        label: 'Meus Checklists',
        description: 'Checklists pendentes das minhas OS',
        icon: 'pi pi-check-square',
        allowedRoles: ['tecnico']
      },
      {
        id: 'checklists',
        label: 'Gerenciar Checklists',
        description: 'Criar e editar templates de checklist',
        icon: 'pi pi-list-check',
        allowedRoles: ['responsavel', 'gerente']
      }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    allowedRoles: ['gerente'], // Apenas administrativo (gerente)
    items: [
      {
        id: 'equipe',
        label: 'Equipe técnica',
        description: 'Dados operacionais de técnicos e responsáveis',
        icon: 'pi pi-users',
        allowedRoles: ['gerente']
      },
      {
        id: 'credenciais',
        label: 'Credenciais',
        description: 'Regras de login e sessão por perfil',
        icon: 'pi pi-shield',
        allowedRoles: ['gerente']
      }
    ]
  },
  {
    id: 'preferencias',
    label: 'Preferências',
    allowedRoles: ['gerente'], // Apenas administrativo (gerente)
    items: [
      {
        id: 'alertas',
        label: 'Alertas operacionais',
        description: 'Riscos de SLA e falhas de checklist',
        icon: 'pi pi-bell',
        allowedRoles: ['gerente']
      },
      {
        id: 'aparencia',
        label: 'Tema do console',
        description: 'Ajuste modo, densidade e cor de destaque',
        icon: 'pi pi-palette',
        allowedRoles: ['gerente']
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

export function filterMenuByRole(userRole?: string): SettingsMenuGroup[] {
  if (!userRole) return [];

  return settingsMenuGroups
    .filter(group => !group.allowedRoles || group.allowedRoles.includes(userRole))
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.allowedRoles || item.allowedRoles.includes(userRole))
    }))
    .filter(group => group.items.length > 0);
}
