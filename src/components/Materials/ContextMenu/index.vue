<template>
  <ul
    v-show="isVisible"
    :class="`${GenerateModifiers('m-contextmenu', { shadowed: props.shadowed })} ${props.anchor}`"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import type { IProps, ISlots, } from '.';

defineOptions({ name: 'ContextMenu' });

defineSlots<ISlots>();

const props = withDefaults(defineProps<IProps>(), {
  visible: false,
  anchor: 'bottom left',
  shadowed: false,
});

const isVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
});
</script>

<style lang="scss" src="./index.scss">
</style>
