import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import { settingsMenuGroups } from '@/data/settings-menu';
import SettingsSidebar from './SettingsSidebar.vue';

const meta: Meta<typeof SettingsSidebar> = {
  title: 'Settings/SettingsSidebar',
  component: SettingsSidebar,
  args: {
    groups: settingsMenuGroups,
    activeId: 'perfil',
    name: 'Maria Eduarda',
    email: 'maria@example.com'
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderFactory = (args: Story['args']) => ({
  components: { SettingsSidebar },
  setup() {
    const activeId = ref(args?.activeId ?? 'perfil');

    watch(
      () => args?.activeId,
      (value) => {
        if (typeof value === 'string') {
          activeId.value = value;
        }
      }
    );

    const handleSelect = (id: string) => {
      activeId.value = id;
    };

    const handleLogout = () => {
      console.info('Logout acionado a partir da story.');
    };

    return { args, activeId, handleSelect, handleLogout };
  },
  template: `
    <div class="w-full max-w-xs">
      <SettingsSidebar v-bind="args" :active-id="activeId" @select="handleSelect" @logout="handleLogout" />
    </div>
  `
});

export const Padrao: Story = {
  render: renderFactory
};

export const OutroItemSelecionado: Story = {
  render: renderFactory,
  args: {
    activeId: 'notificacoes'
  }
};
