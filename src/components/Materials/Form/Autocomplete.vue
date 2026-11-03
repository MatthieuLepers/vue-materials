<template>
  <MaterialFormSelect
    v-bind="{
      id: fieldId,
      label: props.label,
      name: props.name,
      required: props.required,
      disabled: props.disabled,
      variant: props.variant,
      modifiers: props.modifiers,
      options,
      searchable: true,
      inputPlaceholder: props.inputPlaceholder,
      dropdownPosition: props.dropdownPosition,
      allowRemoveSelected: props.allowRemoveSelected,
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
  </MaterialFormSelect>
</template>

<script setup lang="ts" generic="TOption extends ComboboxOption = ComboboxOption">
import {
  getCurrentInstance,
  onMounted,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue';

import MaterialFormSelect from '@/components/Materials/Form/Select.vue';

import { debounce } from '@/core/utils';
import type { IEmits, IProps,ISlots } from '@/components/Materials/Form/Autocomplete';
import type { ComboboxModelValue, ComboboxOption } from '@/components/Materials/Headless/Combobox';
import { type BaseFieldProps,useField } from '@/components/Materials/Headless/Field';

defineOptions({ name: 'FormAutocomplete' });

defineSlots<ISlots<TOption>>();

const props = withDefaults(defineProps<IProps<TOption> & BaseFieldProps<ComboboxModelValue>>(), {
  required: false,
  disabled: false,
  variant: 'default',
  dropdownPosition: 'bottom',
  allowRemoveSelected: false,
  modifiers: () => ({}),
  preFetch: false,
});

defineModel<ComboboxModelValue>();
const search = defineModel<string>('search', { default: '' });

const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `autocomplete${$uid}`;

const emit = defineEmits<IEmits<TOption> & {
  'update:modelValue': [value: ComboboxModelValue];
}>();

const { model } = useField({
  modelValue: toRef(props, 'modelValue'),
  validator: props.validator,
  emit: (v) => emit('update:modelValue', v),
});

const options = shallowRef<Array<TOption>>([]);
const loading = ref<boolean>(false);

async function loadData() {
  options.value = [];
  loading.value = true;
  try {
    options.value = await props.find(search.value);
  } finally {
    loading.value = false;
  }

  emit('fetchOptions', options.value);
}

watch(search, () => {
  debounce(loadData, 500)();
});

onMounted(async () => {
  if (props.preFetch) {
    await loadData();
  }
});
</script>
