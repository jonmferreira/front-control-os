export interface SettingsMenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface SettingsMenuGroup {
  id: string;
  label: string;
  items: SettingsMenuItem[];
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
        icon: 'pi pi-briefcase'
      },
      {
        id: 'checklists',
        label: 'Checklists',
        description: 'Itens obrigatórios e inputs customizados',
        icon: 'pi pi-list-check'
      }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    items: [
      {
        id: 'equipe',
        label: 'Equipe técnica',
        description: 'Dados operacionais de técnicos e responsáveis',
        icon: 'pi pi-users'
      },
      {
        id: 'credenciais',
        label: 'Credenciais',
        description: 'Regras de login e sessão por perfil',
        icon: 'pi pi-shield'
      }
    ]
  },
  {
    id: 'preferencias',
    label: 'Preferências',
    items: [
      {
        id: 'alertas',
        label: 'Alertas operacionais',
        description: 'Riscos de SLA e falhas de checklist',
        icon: 'pi pi-bell'
      },
      {
        id: 'aparencia',
        label: 'Tema do console',
        description: 'Ajuste modo, densidade e cor de destaque',
        icon: 'pi pi-palette'
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
