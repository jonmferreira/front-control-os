import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import Button from 'primevue/button';

import SettingsHeader from './SettingsHeader.vue';

const meta: Meta<typeof SettingsHeader> = {
  title: 'Settings/SettingsHeader',
  component: SettingsHeader,
  args: {
    title: 'Configurações',
    subtitle: 'Gerencie suas preferências',
    isDark: false,
    showBack: false
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderFactory = (args: Story['args']) => ({
  components: { SettingsHeader, Button },
  setup() {
    const isDark = ref(args?.isDark ?? false);
    const showBack = ref(args?.showBack ?? false);

    watch(
      () => args?.isDark,
      (value) => {
        if (typeof value === 'boolean') {
          isDark.value = value;
        }
      }
    );

    watch(
      () => args?.showBack,
      (value) => {
        if (typeof value === 'boolean') {
          showBack.value = value;
        }
      }
    );

    const handleToggle = (value: boolean) => {
      isDark.value = value;
    };

    const handleBack = () => {
      // ação apenas para exibição na story
    };

    return { args, isDark, showBack, handleToggle, handleBack };
  },
  template: `
    <SettingsHeader
      v-bind="args"
      :is-dark="isDark"
      :show-back="showBack"
      @toggle-theme="handleToggle"
      @back="handleBack"
    >
      <template #actions>
        <Button icon="pi pi-ellipsis-h" text severity="secondary" />
      </template>
    </SettingsHeader>
  `
});

export const Padrao: Story = {
  render: renderFactory
};

export const ComVoltar: Story = {
  render: renderFactory,
  args: {
    showBack: true,
    title: 'Privacidade',
    subtitle: 'Controle quem pode ver suas informações'
  }
};
