import { ref } from 'vue';

export interface IEmits {
  focus: [focused: boolean];
  blur: [focused: boolean];
}

export function useFieldState(
  emit?: {
    focus?: (focused: boolean) => void;
    blur?: (focused: boolean) => void;
  },
) {
  const focused = ref(false);
  const touched = ref(false);

  function setFocus(value: boolean) {
    touched.value ||= true;
    focused.value = value;
  }

  function onFocus() {
    setFocus(true);
    emit?.focus?.(focused.value);
  }

  function onBlur() {
    setFocus(false);
    emit?.blur?.(focused.value);
  }

  return {
    focused,
    touched,
    onFocus,
    onBlur,
  };
}
