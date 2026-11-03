import { type DirectiveBinding, ref } from 'vue';

import {
 addEntry,
 type ClickOutsideConfig,
 type ClickOutsideHandler,
 removeEntry,
 updateEntry,
} from './registry';

type BindingValue =
  | ClickOutsideHandler
  | (ClickOutsideConfig & { handler: ClickOutsideHandler });

function normalize(value: BindingValue): ClickOutsideConfig {
  if (typeof value === 'function') {
    return {
      handler: value,
      ignore: [],
      disabled: ref(false),
      detectEscape: false,
    };
  }

  return {
    handler: value.handler,
    ignore: value.ignore ?? [],
    disabled: value.disabled ?? ref(false),
    detectEscape: value.detectEscape ?? false,
  };
}

export const vClickOutside = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding<BindingValue>) {
    const config = normalize(binding.value);

    addEntry({ el, config });
  },

  updated(el: HTMLElement, binding: DirectiveBinding<BindingValue>) {
    const config = normalize(binding.value);

    updateEntry(el, config);
  },

  unmounted(el: HTMLElement) {
    removeEntry(el);
  },
};
