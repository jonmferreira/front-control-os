import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import ThemeToggle from './ThemeToggle.vue';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Settings/ThemeToggle',
  component: ThemeToggle,
  args: {
    modelValue: false
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderFactory = (args: Story['args']) => ({
  components: { ThemeToggle },
  setup() {
    const value = ref(args?.modelValue ?? false);

    watch(
      () => args?.modelValue,
      (newValue) => {
        if (typeof newValue === 'boolean') {
          value.value = newValue;
        }
      }
    );

    const handleUpdate = (next: boolean) => {
      value.value = next;
    };

    return { value, handleUpdate };
  },
  template: '<ThemeToggle :model-value="value" @update:modelValue="handleUpdate" />'
});

export const Claro: Story = {
  render: renderFactory,
  args: {
    modelValue: false
  }
};

export const Escuro: Story = {
  render: renderFactory,
  args: {
    modelValue: true
  }
};
