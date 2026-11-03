import { computed, type Ref } from 'vue';

import { useElementSize } from '@/composables/useElementSize';

export type TFileEntity = {
  id: number;
  aspectRatio: number;
  width: number;
  height: number;
};

export type JustifiedGalleryItem<TFile extends TFileEntity = TFileEntity> = {
  file: TFile;
  width: number;
  height: number;
};

export type JustifiedGalleryRow<TFile extends TFileEntity = TFileEntity> = {
  items: Array<JustifiedGalleryItem<TFile>>;
};

export const useJustifiedGallery = <TFile extends TFileEntity>(
  files: Ref<Array<TFile>>,
  container: Ref<HTMLElement | null>,
  targetRowHeight: number = 250,
  gap: number = 8,
) => {
  const { width } = useElementSize(container);

  const rows = computed<JustifiedGalleryRow<TFile>[]>(() => {
    const result: JustifiedGalleryRow<TFile>[] = [];

    let currentRow: TFile[] = [];
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

  return { rows };
};
