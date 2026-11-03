<template>
  <div class="m-form-file-selector">
    <input
      class="m-form-file-selector__input"
      type="file"
      ref="input"
      :multiple="props.multiple"
      :name="props.name"
      @change="modelValue = Array.from(($event.target as HTMLInputElement).files ?? [])"
    />
    <MaterialButton
      class="m-form-file-selector__button"
      icon="icon-import"
      :disabled="props.disabled"
      @click.stop="handleClick"
    >
      {{ props.label }}
    </MaterialButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import MaterialButton from '@/components/Materials/Button/index.vue';

defineOptions({ name: 'FormFileSelector' });

const input = ref<HTMLInputElement | null>(null);

const modelValue = defineModel<Array<File>>();

const props = withDefaults(defineProps<{
  multiple?: boolean,
  disabled?: boolean,
  label?: string,
  name?: string,
}>(), {
  multiple: false,
  disabled: false,
});

function handleClick() {
  input.value?.click();
}
</script>

<style lang="scss" src="./FileSelector.scss">
</style>
