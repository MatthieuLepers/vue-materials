import type { Directive } from 'vue';

export const vScrollLock: Directive<HTMLElement, boolean> = {
  updated(_, binding) {
    document.body.style.overflow = binding.value ? 'hidden' : '';
  },
};
