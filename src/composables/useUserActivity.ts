import {
  onMounted,
  onUnmounted,
  type Ref,
  ref,
} from 'vue';

export const useUserActivity = (
  element: Ref<HTMLElement | null>,
  timeout = 2000,
) => {
  const isActive = ref(true);

  let timer: number | undefined;

  const markActive = () => {
    isActive.value = true;

    clearTimeout(timer);

    timer = window.setTimeout(() => {
      isActive.value = false;
    }, timeout);
  };

  onMounted(() => {
    const el = element.value;

    if (!el) return;

    [
      'mousemove',
      'mousedown',
      'touchstart',
      'touchmove',
      'pointermove',
      'keydown',
    ].forEach((event) => {
      el.addEventListener(event, markActive, {
        passive: true,
      });
    });

    markActive();
  });

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return {
    isActive,
  };
};
