import { mount } from '@vue/test-utils';

import ThemeToggle from '@/components/settings/ThemeToggle.vue';

describe('ThemeToggle', () => {
  it('renders the switch with the default accessible label', () => {
    const wrapper = mount(ThemeToggle, {
      props: { modelValue: false }
    });

    const switchButton = wrapper.get('button[role="switch"]');
    expect(switchButton.attributes('aria-label')).toBe('Alternar tema');
  });

  it('passes a custom label to the input switch', () => {
    const wrapper = mount(ThemeToggle, {
      props: { modelValue: true, label: 'Mudar contraste' }
    });

    const switchButton = wrapper.get('button[role="switch"]');
    expect(switchButton.attributes('aria-label')).toBe('Mudar contraste');
  });

  it('emits update:modelValue when toggled', async () => {
    const wrapper = mount(ThemeToggle, {
      props: { modelValue: false }
    });

    await wrapper.get('button[role="switch"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });
});
