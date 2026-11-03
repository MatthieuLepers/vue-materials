import {
  onUnmounted,
  type Ref,
  ref,
  watch,
} from 'vue';

export const useElementSize = (element: Ref<HTMLElement | null>) => {
  const width = ref(0);
  const height = ref(0);

  const observer = new ResizeObserver(([entry]) => {
    width.value = entry.contentRect.width;
    height.value = entry.contentRect.height;
  });

  watch(element, (newElement, oldElement) => {
    if (oldElement) {
      observer.unobserve(oldElement);
    }

    if (newElement) {
      width.value = newElement.clientWidth;
      height.value = newElement.clientHeight;

      observer.observe(newElement);
    }
  }, {
    immediate: true,
  });

  onUnmounted(() => {
    observer.disconnect();
  });

  return {
    width,
    height,
  };
};
