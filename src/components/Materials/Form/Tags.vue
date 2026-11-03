<template>
  <div class="m-form-tags__container">
    <label
      v-if="props.label && (!props.allowAdd || (props.allowAdd && !canAdd))"
      class="m-form-tags__label"
    >
      {{ props.label }}
    </label>
    <MaterialFormInput
      v-else-if="props.allowAdd && canAdd"
      v-model="labelRef"
      :label="props.label"
      :placeholder="props.addPlaceholder"
      :iconData="{
        clickable: true,
        icon: 'icon-plus',
        ariaLabel: 'Add tag',
      }"
      class="m-form-tags__add"
      name="tagLabel"
      @keydown.enter.stop="actions.handleAddTag"
      @icon="actions.handleAddTag"
    />
    <ul class="m-form-tags">
      <li
        v-for="(tag, i) in modelValue"
        :key="i"
        class="m-form-tags__item"
      >
        <slot :tag="tag">{{ tag }}</slot>
        <button
          v-if="props.allowRemove && canRemove"
          type="button"
          class="m-form-tags__remove"
          @click="actions.handleRemoveTag(tag)"
        >
          <span v-icon:close />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';

import MaterialFormInput from '@/components/Materials/Form/Input.vue';

defineOptions({ name: 'FormTags' });

const modelValue = defineModel<Array<T>>({ type: Array, default: () => [] });

const props = withDefaults(defineProps<{
  label?: string;
  allowRemove?: boolean;
  allowAdd?: boolean;
  allowDuplicate?: boolean;
  min?: number;
  max?: number;
  addPlaceholder?: string;
}>(), {
  allowRemove: true,
  allowAdd: true,
  allowDuplicate: false,
  min: 0,
});

const labelRef = ref('');

const canAdd = computed(() => (!!props.max && modelValue.value.length <= props.max) || !props.max);
const canRemove = computed(() => props.min >= 0 && modelValue.value.length >= props.min);

const actions = {
  handleAddTag() {
    if (labelRef.value.length) {
      const newModelValue = [...modelValue.value, labelRef.value]
        .filter((tag, i, arr) => props.allowDuplicate || arr.indexOf(tag) === i)
      ;
      modelValue.value = newModelValue as Array<T>;
      labelRef.value = '';
    }
  },
  handleRemoveTag(tag: T) {
    modelValue.value = modelValue.value.filter((t) => t !== tag);
  },
};
</script>

<style lang="scss" src="./Tags.scss">
</style>
