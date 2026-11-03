<template>
  <div :class="GenerateModifiers('m-form-checkbox', modifiers)">
    <input
      type="checkbox"
      :id="fieldId"
      :value="props.value"
      :name="props.name"
      :disabled="props.disabled"
      :checked="checked"
      @click="handleClick"
      @focus="onFocus"
      @blur="onBlur"
    />
    <label :for="fieldId">
      <slot>{{ props.label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, toRef } from 'vue';

import type { IEmits,IProps, TModelValue } from '@/components/Materials/Form/Checkbox';
import { type BaseFieldProps, useField } from '@/components/Materials/Headless/Field';
import { useFieldState } from '@/components/Materials/Headless/FieldState';

defineOptions({ name: 'FormCheckbox' });

const props = withDefaults(defineProps<IProps & BaseFieldProps<TModelValue>>(), {
  disabled: false,
  variant: 'default',
  modifiers: () => ({}),
});

defineModel<TModelValue>();

defineSlots<{
  default: () => void;
}>();

const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `checkbox${$uid}`;

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: TModelValue];
}>();

const { model, field } = useField({
  modelValue: toRef(props, 'modelValue'),
  validator: props.validator,
  emit: (v) => emit('update:modelValue', v),
});

const { focused, onFocus, onBlur } = useFieldState({
  focus: (v) => emit('focus', v),
  blur: (v) => emit('blur', v),
});

const sanitizedModel = computed({
  get: () => Array.isArray(model.value) ? model.value : [model.value],
  set(value: TModelValue) {
    model.value = value;
  },
});

const checked = computed(() => sanitizedModel.value.includes(props.value));

const modifiers = computed(() => ({
  ...props.modifiers,
  [props.variant]: true,
  focus: focused.value,
  checked: checked.value,
  disabled: props.disabled,
  valid: field.invalid.value === false,
  invalid: field.invalid.value === true,
}));

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLInputElement;

  if (target.checked && !sanitizedModel.value.includes(props.value)) {
    model.value = [...sanitizedModel.value, props.value];
  } else if (!target.checked && sanitizedModel.value.includes(props.value)) {
    model.value = sanitizedModel.value.filter((v) => v !== props.value);
  }
  emit('click', e, { value: props.value, checked: target.checked });
}
</script>

<style lang="scss" src="./Checkbox.scss">
</style>
