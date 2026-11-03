import { computed, type Ref } from 'vue';

import type { FileEntity } from '@/core/entities/file';
import { useElementSize } from '@/composables/useElementSize';

export type JustifiedGalleryItem = {
  file: FileEntity;
  width: number;
  height: number;
};

export type JustifiedGalleryRow = {
  items: Array<JustifiedGalleryItem>;
};

export const useJustifiedGallery = (
  files: Ref<Array<FileEntity>>,
  container: Ref<HTMLElement | null>,
  targetRowHeight: number = 250,
  gap: number = 8,
) => {
  const { width } = useElementSize(container);

  const rows = computed<JustifiedGalleryRow[]>(() => {
    const result: JustifiedGalleryRow[] = [];

    let currentRow: FileEntity[] = [];
    let currentRatioSum = 0;

    files.value.forEach((file) => {
      currentRow.push(file);
      currentRatioSum += file.aspectRatio;

      const estimatedWidth = currentRatioSum * targetRowHeight + (currentRow.length - 1) * gap;

      if (estimatedWidth >= width.value) {
        const rowHeight = (width.value - (currentRow.length - 1) * gap) / currentRatioSum;

        result.push({
          items: currentRow.map((file) => ({
            file,
            width: file.aspectRatio * rowHeight,
            height: rowHeight,
          })),
        });

        currentRow = [];
        currentRatioSum = 0;
      }
    });

    if (currentRow.length > 0) {
      result.push({
        items: currentRow.map((file) => ({
          file,
          width: file.aspectRatio * targetRowHeight,
          height: targetRowHeight,
        })),
      });
    }

    return result;
  });

  return {
    rows,
  };
};
