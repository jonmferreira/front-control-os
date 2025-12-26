import { describe, expect, it } from 'vitest';

import {
  customInputRegistry,
  displayCustomInputLabel,
  resolveCustomInputComponent
} from '@/helpers_and_formaters/customInputs';

describe('customInputs helper', () => {
  it('resolves registered components', () => {
    const component = resolveCustomInputComponent('dadosCarro');
    expect(component.name).toBe(customInputRegistry.dadosCarro.name);
  });

  it('returns empty component when no id is provided', () => {
    const component = resolveCustomInputComponent(null);
    expect(component.name).toBe('EmptyCustomInput');
  });

  it('returns fallback component for unknown ids', () => {
    const component = resolveCustomInputComponent('unknown-input');
    expect(component.name).toBe('FallbackCustomInput');
  });

  it('displays mapped labels with fallback when missing', () => {
    expect(displayCustomInputLabel('dadosCarro')).toBe('DadosCarro');
    expect(displayCustomInputLabel('not-mapped')).toBe('Componente não mapeado');
    expect(displayCustomInputLabel(null)).toBe('Sem componente customizado');
  });
});
