<template>
  <MaterialCombobox
    v-bind="{
      ...props,
      modifiers,
    }"
    v-model="model"
    v-model:search="search"
    @keydownEnter="emit('keydownEnter', $event)"
    @optionSelected="emit('optionSelected', $event)"
    @optionUnselected="emit('optionUnselected', $event)"
  >
    <template #selectedOption="props">
      <slot name="selectedOption" v-bind="props" />
    </template>

    <template #optgroup="props">
      <slot name="optgroup" v-bind="props" />
    </template>

    <template #option="props">
      <slot name="option" v-bind="props" />
    </template>

    <template #empty="props">
      <slot name="empty" v-bind="props" />
    </template>
  </MaterialCombobox>

  <MaterialFormMessageList :field="field" />
</template>

<script setup lang="ts" generic="TOption extends ComboboxOption = ComboboxOption">
import { computed, toRef } from 'vue';

import MaterialFormMessageList from '@/components/Materials/Form/MessageList.vue';
import MaterialCombobox from '@/components/Materials/Headless/Combobox.vue';

import type { IEmits, IProps, ISlots } from '@/components/Materials/Form/Select';
import type { ComboboxModelValue, ComboboxOption } from '@/components/Materials/Headless/Combobox';
import { type BaseFieldProps, useField } from '@/components/Materials/Headless/Field';

defineOptions({ name: 'FormSelect' });

defineSlots<ISlots<TOption>>();

const props = withDefaults(defineProps<IProps<TOption> & BaseFieldProps<ComboboxModelValue>>(), {
  required: false,
  disabled: false,
  variant: 'default',
  options: () => [],
  searchable: false,
  dropdownPosition: 'bottom',
  allowRemoveSelected: false,
  modifiers: () => ({}),
});

defineModel<ComboboxModelValue>();
const search = defineModel<string>('search', { default: '' });

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: ComboboxModelValue];
}>();

const { model, field } = useField({
  modelValue: toRef(props, 'modelValue'),
  validator: props.validator,
  emit: (v) => emit('update:modelValue', v),
});

const modifiers = computed(() => ({
  ...props.modifiers,
  valid: field.invalid.value === false,
  invalid: field.invalid.value === true,
}));
</script>
