<template>
  <div :class="GenerateModifiers('m-form-segmented', {
    [props.direction]: true,
    [props.variant]: true,
  })">
    <label :for="fieldId" class="m-form-segmented__label">
      <slot name="label">
        {{ props.label }}
      </slot>
    </label>
    <div :id="fieldId" class="m-form-segmented__options">
      <div
        class="m-form-segmented__indicator"
        aria-hidden="true"
        :style="indicatorStyle"
      />

      <button
        v-for="(option, i) in props.options"
        :key="i"
        type="button"
        :class="GenerateModifiers('m-form-segmented__option', {
          selected: isSelected(option.value),
        })"
        @click="handleClickOption(option.value)"
      >
        <slot name="option" :option="option">
          {{ option.label }}
        </slot>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';

import type { ComboboxModelValue, ComboboxOption, ComboboxOptionValue } from '@/components/Materials/Headless/Combobox';

const $uid = getCurrentInstance()?.uid ?? 0;
const fieldId = `segmentedControl${$uid}`;

const modelValue = defineModel<ComboboxModelValue>();

defineSlots<{
  label: () => void;
  option: (props: { option: ComboboxOption }) => void;
}>();

const props = withDefaults(defineProps<{
  options?: Array<ComboboxOption>;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  variant?: 'default',
}>(), {
  options: () => [],
  direction: 'horizontal',
  variant: 'default',
});

const selectedIndex = computed(() => {
  const index = props.options
    .findIndex((o) => Array.isArray(modelValue.value) ? modelValue.value?.includes(o.value) : o.value === modelValue.value)
  ;

  return index >= 0 ? index : 0;
});

const indicatorStyle = computed(() => props.direction === 'horizontal' ? {
  width: `${100 / props.options.length}%`,
  transform: `translateX(${selectedIndex.value * 100}%)`,
  borderRadius: (selectedIndex.value === 0 && '8px 0 0 8px')
    || (selectedIndex.value === props.options.length - 1 && '0 8px 8px 0')
    || '0',
} : {
  height: `${100 / props.options.length}%`,
  transform: `translateY(${selectedIndex.value * 100}%)`,
  borderRadius: (selectedIndex.value === 0 && '8px 8px 0 0')
    || (selectedIndex.value === props.options.length - 1 && '0 0 8px 8px')
    || '0',
});

function isSelected(value: ComboboxOptionValue) {
  return Array.isArray(modelValue.value)
    ? modelValue.value.includes(value)
    : modelValue.value === value
  ;
}

function handleClickOption(value: ComboboxOptionValue) {
  if (Array.isArray(modelValue.value)) {
    const optionValues = new Set(props.options.map(option => option.value));

    modelValue.value = [
      ...modelValue.value.filter((currentValue) => !optionValues.has(currentValue)),
      value,
    ];
  } else {
    modelValue.value = value;
  }
}
</script>

<style lang="scss" src="./Segmented.scss">
</style>
