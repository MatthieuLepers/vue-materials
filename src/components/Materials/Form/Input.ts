import { computed, type Ref, ref } from 'vue';

import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export type TextFieldIconData = {
  icon?: string;
  text?: string;
  clickable?: boolean;
  ariaLabel?: string;
}

export interface IEmits extends IFieldStateEmits {
  click: [];
  keydown: [e: KeyboardEvent];
  icon: [e: MouseEvent];
}

export interface IProps {
  // Form
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  autocomplete?: string; // InputAutoCompleteAttribute
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
  // Design system related
  iconData?: TextFieldIconData;
  variant?: 'default' | 'inline' | 'underlined' | 'box';
  modifiers?: Record<string, boolean>;
}

export function usePasswordVisibility(type?: string) {
  const passwordVisible = ref(false);

  const isPassword = computed(() => type === 'password');

  const inputType = computed(() => {
    if (!isPassword.value) return type;

    return passwordVisible.value
      ? 'text'
      : 'password'
    ;
  });

  const icon = computed(() => {
    if (!isPassword.value) return null;

    return passwordVisible.value
      ? 'icon-eye-slash'
      : 'icon-eye'
    ;
  });

  function toggle() {
    if (!isPassword.value) return;

    passwordVisible.value = !passwordVisible.value;
  }

  return {
    passwordVisible,
    inputType,
    icon,
    toggle,
  };
}

type Options = {
  min?: number;
  max?: number;
  step?: number;
};

export function useNumberInput(
  value: Ref<number>,
  focused: Ref<boolean>,
  options: Options = {},
) {
  const {
    min = 0,
    max,
    step = 1,
  } = options;

  function increment() {
    const next = value.value + Math.abs(step);

    value.value = max !== undefined
      ? Math.min(max, next)
      : next
    ;
  }

  function decrement() {
    const next = value.value - Math.abs(step);

    value.value = Math.max(min, next);
  }

  function handleMouseWheel(e: WheelEvent) {
    if (!focused.value) return;

    e.preventDefault();

    if (e.deltaY < 0) {
      increment();
      return;
    }

    decrement();
  }

  return {
    increment,
    decrement,
    handleMouseWheel,
  };
}
