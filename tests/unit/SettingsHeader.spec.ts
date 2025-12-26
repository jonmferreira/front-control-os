import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import SettingsHeader from '@/components/settings/SettingsHeader.vue';

describe('SettingsHeader', () => {
  it('renders title, subtitle and actions slot', () => {
    const wrapper = mount(SettingsHeader, {
      props: {
        title: 'Configurações',
        subtitle: 'Personalize sua experiência',
        isDark: false
      },
      slots: {
        actions: '<span data-test="actions-slot">Ação extra</span>'
      }
    });

    expect(wrapper.text()).toContain('Configurações');
    expect(wrapper.text()).toContain('Personalize sua experiência');
    expect(wrapper.find('[data-test="actions-slot"]').exists()).toBe(true);
  });

  it('emits back when the back button is clicked', async () => {
    const wrapper = mount(SettingsHeader, {
      props: {
        title: 'Configurações',
        showBack: true,
        isDark: false
      }
    });

    await wrapper.get('button[aria-label="Voltar"]').trigger('click');

    expect(wrapper.emitted('back')).toHaveLength(1);
  });

  it('forwards the toggle event from the ThemeToggle component', async () => {
    const themeToggleStub = defineComponent({
      emits: ['update:modelValue'],
      setup(_, { emit, attrs }) {
        return () =>
          h(
            'button',
            {
              'data-test': 'theme-toggle-stub',
              ...attrs,
              onClick: () => emit('update:modelValue', true)
            }
          );
      }
    });

    const wrapper = mount(SettingsHeader, {
      props: {
        title: 'Configurações',
        isDark: false
      },
      global: {
        stubs: {
          ThemeToggle: themeToggleStub
        }
      }
    });

    await wrapper.get('[data-test="theme-toggle-stub"]').trigger('click');

    expect(wrapper.emitted('toggle-theme')).toEqual([[true]]);
  });
});
