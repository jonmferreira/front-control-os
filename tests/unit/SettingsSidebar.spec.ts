import { mount } from '@vue/test-utils';

import SettingsSidebar from '@/components/settings/SettingsSidebar.vue';
import type { SettingsMenuGroup } from '@/data/settings-menu';

describe('SettingsSidebar', () => {
  const groups: SettingsMenuGroup[] = [
    {
      id: 'preferences',
      label: 'Preferências',
      items: [
        {
          id: 'profile',
          label: 'Perfil',
          description: 'Atualize suas informações pessoais',
          icon: 'pi-user'
        },
        {
          id: 'notifications',
          label: 'Notificações',
          description: 'Gerencie os alertas do sistema',
          icon: 'pi-bell'
        }
      ]
    }
  ];

  it('displays user information and initials', () => {
    const wrapper = mount(SettingsSidebar, {
      props: {
        groups,
        activeId: 'profile',
        name: 'João Silva',
        email: 'joao@example.com'
      }
    });

    expect(wrapper.text()).toContain('João Silva');
    expect(wrapper.text()).toContain('joao@example.com');
    expect(wrapper.text()).toContain('JS');
  });

  it('marks the active item and keeps secondary items outlined', () => {
    const wrapper = mount(SettingsSidebar, {
      props: {
        groups,
        activeId: 'profile',
        name: 'João Silva',
        email: 'joao@example.com'
      }
    });

    const buttons = wrapper.findAll('button');
    const profileButton = buttons.find((button) => button.text().includes('Perfil'))!;
    const notificationsButton = buttons.find((button) => button.text().includes('Notificações'))!;

    expect(profileButton.attributes('severity')).toBe('primary');
    expect(profileButton.attributes('outlined')).not.toBe('true');
    expect(profileButton.attributes('text')).not.toBe('true');

    expect(notificationsButton.attributes('severity')).toBe('secondary');
    expect(notificationsButton.attributes('outlined')).toBe('true');
    expect(notificationsButton.attributes('text')).toBe('true');
  });

  it('exibe o rótulo do perfil quando informado', () => {
    const wrapper = mount(SettingsSidebar, {
      props: {
        groups,
        activeId: 'profile',
        name: 'João Silva',
        email: 'joao@example.com',
        roleLabel: 'Técnico responsável'
      }
    });

    expect(wrapper.text()).toContain('Técnico responsável');
  });

  it('emits the select event when a menu item is clicked', async () => {
    const wrapper = mount(SettingsSidebar, {
      props: {
        groups,
        activeId: 'profile',
        name: 'João Silva',
        email: 'joao@example.com'
      }
    });

    const profileButton = wrapper.findAll('button').find((button) => button.text().includes('Perfil'))!;

    await profileButton.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[groups[0]!.items[0]!.id]]);
  });

  it('emits logout when the action button is pressed', async () => {
    const wrapper = mount(SettingsSidebar, {
      props: {
        groups,
        activeId: 'profile',
        name: 'João Silva',
        email: 'joao@example.com'
      }
    });

    const buttons = wrapper.findAll('button');
    const logoutButton = buttons[buttons.length - 1];
    await logoutButton!.trigger('click');

    expect(wrapper.emitted('logout')).toHaveLength(1);
  });
});
