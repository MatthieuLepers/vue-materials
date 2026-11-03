<template>
  <div class="justified-gallery" ref="container">
    <div
      class="justified-gallery__row"
      v-for="(row, i) in rows"
      :key="i"
      :style="{
        maxHeight: `${props.rowHeight}px`,
      }"
    >
      <div
        :class="GenerateModifiers('justified-gallery__item', {
          loaded: isLoaded(item.file.id),
        })"
        v-for="(item, j) in row.items"
        :key="j"
        :style="{
          width: `${item.width}px`,
          height: `${item.height}px`,
        }"
      >
        <div
          v-if="!isLoaded(item.file.id)"
          class="justified-gallery__skeleton"
        />

        <slot
          name="item"
          :item="item"
          :onLoad="() => handleLoad(item.file.id)"
          :onError="() => handleError(item.file.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TFile extends GalleryFile = GalleryFile">
import { ref, toRef, watch } from 'vue';

import { type JustifiedGalleryItem, useJustifiedGallery } from '@/composables/useJustifiedGallery';

type GalleryFile = {
  id: number;
  aspectRatio: number;
};

const props = withDefaults(defineProps<{
  files: Array<TFile>;
  rowHeight?: number;
  gap?: number;
}>(), {
  rowHeight: 320,
  gap: 8,
});

type ItemSlotProps = {
  item: JustifiedGalleryItem<TFile>;
  onLoad: () => void;
  onError: () => void;
};

defineSlots<{
  item(props: ItemSlotProps): void;
}>();

const container = ref<HTMLElement | null>(null);
const loaded = ref(new Set<number>());
const errored = ref(new Set<number>());

function handleLoad(id: number) {
  loaded.value.add(id);
}

function handleError(id: number) {
  errored.value.add(id);
}

const isLoaded = (id: number) => loaded.value.has(id);

const { rows } = useJustifiedGallery(
  toRef(props, 'files'),
  container,
  props.rowHeight,
  props.gap,
);

watch(() => props.files, (files) => {
  const currentIds = new Set(files.map((file) => file.id));

  loaded.value.forEach((id) => {
    if (!currentIds.has(id)) {
      loaded.value.delete(id);
    }
  });

  errored.value.clear();
});
</script>

<style lang="scss" src="./JustifiedGallery.scss">
</style>
