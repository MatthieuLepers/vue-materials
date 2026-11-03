import type { Directive } from 'vue';

export const vFocus: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    if (binding.value !== false) {
      el.focus();
    }
  },

  updated(el, binding) {
    if (binding.value) {
      el.focus();
    }
  },
};
