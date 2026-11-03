import type { Directive, DirectiveBinding } from 'vue';

type IconValue = Record<string, boolean> | undefined;

type IconState = {
  arg?: string;
  value?: IconValue;
};

const KEY = Symbol('v-icon');

type IconHTMLElement = HTMLElement & {
  [KEY]?: IconState;
};

function apply(el: HTMLElement, binding: DirectiveBinding<IconValue>) {
  // mode arg
  if (binding.arg && !binding.value) {
    el.classList.add(`icon-${binding.arg}`);
    return;
  }

  // mode object
  if (binding.value && typeof binding.value === 'object') {
    Object.keys(binding.value).forEach((key) => {
      if (binding.value?.[key]) {
        el.classList.add(`icon-${key}`);
      }
    });
  }
}

function cleanup(el: HTMLElement, prev: IconState) {
  // mode arg
  if (prev.arg && !prev.value) {
    el.classList.remove(`icon-${prev.arg}`);
  }

  // mode object
  if (prev.value && typeof prev.value === 'object') {
    Object.keys(prev.value).forEach((key) => {
      if (prev.value?.[key]) {
        el.classList.remove(`icon-${key}`);
      }
    });
  }
}

export const vIcon: Directive<IconHTMLElement, IconValue> = {
  beforeMount(el, binding) {
    apply(el, binding);

    el[KEY] = {
      arg: binding.arg,
      value: binding.value,
    };
  },

  updated(el, binding) {
    const prev = el[KEY] || {};

    cleanup(el, prev);
    apply(el, binding);

    el[KEY] = {
      arg: binding.arg,
      value: binding.value,
    };
  },
};
