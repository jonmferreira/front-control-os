import { mount } from '@vue/test-utils';
import { vi } from 'vitest';

import LogoutConfirmationDialog from '@/components/settings/LogoutConfirmationDialog.vue';

const closeMock = vi.fn();

vi.mock('primevue/usedialog', () => ({
  useDialog: () => ({
    close: closeMock
  })
}));

describe('LogoutConfirmationDialog', () => {
  beforeEach(() => {
    closeMock.mockClear();
  });

  it('closes the dialog without payload when cancel is clicked', async () => {
    const wrapper = mount(LogoutConfirmationDialog);

    const [cancelButton] = wrapper.findAll('button');
    await cancelButton!.trigger('click');

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(closeMock).toHaveBeenCalledWith(undefined);
  });

  it('confirms the action and forwards the payload on confirm', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const wrapper = mount(LogoutConfirmationDialog);

    const buttons = wrapper.findAll('button');
    const confirmButton = buttons[1];
    await confirmButton!.trigger('click');

    expect(infoSpy).toHaveBeenCalledWith('Logout confirmado');
    expect(closeMock).toHaveBeenCalledWith({ confirmed: true });

    infoSpy.mockRestore();
  });
});
