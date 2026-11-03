import { type Ref, watch } from 'vue';

export function useRestoreFocus(active: Ref<boolean>) {
  const isFocusable = (el: HTMLElement | null) => el && typeof el.focus === 'function';

  let previous: HTMLElement | null = null;

  const save = () => {
    const el = document.activeElement as HTMLElement;
    if (isFocusable(el)) previous = el;
  };

  const restore = () => {
    previous?.focus?.();
    previous = null;
  };

  watch(active, (isOpen) => {
    if (isOpen) {
      save();
    } else {
      restore();
    }
  },
  { immediate: true });
}