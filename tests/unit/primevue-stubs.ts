import { defineComponent, h } from 'vue';

type Attrs = Record<string, unknown>;

const extractLabel = (attrs: Attrs) => {
  const cloned = { ...attrs };
  const label = cloned.label;
  delete cloned.label;
  return { cloned, label };
};

const ButtonStub = defineComponent({
  name: 'PrimeButtonStub',
  inheritAttrs: false,
  emits: ['click'],
  setup(_, { slots, emit, attrs }) {
    return () => {
      const { cloned, label } = extractLabel(attrs as Attrs);
      return h(
        'button',
        {
          type: 'button',
          ...cloned,
          onClick: (event: MouseEvent) => emit('click', event)
        },
        slots.default?.() ?? (typeof label === 'string' ? label : label != null ? String(label) : undefined)
      );
    };
  }
});

const CardStub = defineComponent({
  name: 'PrimeCardStub',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'section',
        attrs,
        [slots.title?.(), slots.content?.(), slots.default?.()].filter(Boolean) as []
      );
  }
});

const PanelStub = defineComponent({
  name: 'PrimePanelStub',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'section',
        attrs,
        [slots.header?.(), slots.default?.()].filter(Boolean) as []
      );
  }
});

const AvatarStub = defineComponent({
  name: 'PrimeAvatarStub',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { cloned, label } = extractLabel(attrs as Attrs);
    return () =>
      h(
        'div',
        { ...cloned, role: 'img' },
        typeof label === 'string' ? label : label != null ? String(label) : undefined
      );
  }
});

const InputSwitchStub = defineComponent({
  name: 'PrimeInputSwitchStub',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          role: 'switch',
          'aria-checked': props.modelValue ? 'true' : 'false',
          ...attrs,
          onClick: () => emit('update:modelValue', !props.modelValue)
        }
      );
  }
});

export const primeVueStubs = {
  Button: ButtonStub,
  Card: CardStub,
  Panel: PanelStub,
  Avatar: AvatarStub,
  InputSwitch: InputSwitchStub
};
