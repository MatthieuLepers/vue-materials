import { type Ref, watch } from 'vue';

export function useInertOthers(
  targetRef: Ref<HTMLElement | null>,
  active: Ref<boolean>,
) {
  let inerted: HTMLElement[] = [];

  const applyInert = () => {
    const el = targetRef.value;
    if (!el) return;

    const root = document.body;

    inerted = Array
      .from(root.children)
      .filter((child) => !el.contains(child)) as HTMLElement[]
    ;

    inerted.forEach((node) => node.setAttribute('inert', ''));
  };

  const clearInert = () => {
    inerted.forEach((node) => node.removeAttribute('inert'));
    inerted = [];
  };

  watch(active, (isActive) => {
    if (isActive) {
      applyInert();
    } else {
      clearInert();
    }
  },
  { immediate: true });
}