<template>
  <div
    :id="props.id"
    class="m-accordion"
  >
    <button
      type="button"
      :class="GenerateModifiers('m-accordion__button', { open: open })"
      @click="open = !open"
    >
      <slot name="title">
        {{ props.title }}
      </slot>
    </button>
    <div
      v-show="open"
      class="m-accordion__content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  id: { type: String, default: null },
  title: { type: String, required: true },
  open: { type: Boolean, default: false },
});

const open = ref(props.open);

watch(() => props.open, (value) => {
  open.value = value;
});
</script>

<style lang="scss" src="./Accordion.scss">
</style>
