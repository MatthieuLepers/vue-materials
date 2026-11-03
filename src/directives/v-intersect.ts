import type { Directive } from 'vue';

type Callback = (entry: IntersectionObserverEntry) => void;

type ElType = HTMLElement & {
  __observer__?: IntersectionObserver;
};

export const vIntersect: Directive<ElType, Callback> = {
  beforeMount(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      binding.value?.(entry);
    });

    observer.observe(el);
    el.__observer__ = observer;
  },

  unmounted(el) {
    el.__observer__?.disconnect();
  },
};
