import {
 onBeforeUnmount,
 onMounted,
 type Ref,
 watch,
} from 'vue';

import {
 addEntry,
 type ClickOutsideConfig,
 removeEntry,
 updateEntry,
} from '@/directives/v-clickOutside/registry';

export function useClickOutside(
  elRef: Ref<HTMLElement | null>,
  config: ClickOutsideConfig,
) {
  let currentEl: HTMLElement | null = null;

  onMounted(() => {
    if (!elRef.value) return;

    currentEl = elRef.value;
    addEntry({ el: currentEl, config });
  });

  onBeforeUnmount(() => {
    if (currentEl) {
      removeEntry(currentEl);
    }
  });

  watch(() => config, (newConfig) => {
    if (currentEl) {
      updateEntry(currentEl, newConfig);
    }
  },
  { deep: true });
}
