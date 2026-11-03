import {
 nextTick,
 onBeforeUnmount,
 type Ref,
 watch,
} from 'vue';

function getFocusable(el: HTMLElement) {
  return Array
    .from(el.querySelectorAll<HTMLElement>([
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')))
    .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
  ;
}

export function useFocusTrap(
  elRef: Ref<HTMLElement | null>,
  active: Ref<boolean>,
) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (!active.value || e.key !== 'Tab' || !elRef.value) return;

    const focusables = getFocusable(elRef.value);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  watch([active, elRef], async ([isActive, el]) => {
    if (isActive && el) {
      document.addEventListener('keydown', onKeyDown);

      await nextTick();

      // focus initial
      const focusables = getFocusable(el);
      focusables[0]?.focus();
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, { immediate: true });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeyDown);
  });
}
