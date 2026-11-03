<template>
  <div :class="GenerateModifiers('m-form-toggle', modifiers)">
    <input
      type="checkbox"
      :id="fieldId"
      :checked="model"
      :name="props.name"
      :disabled="props.disabled"
      @input="model = ($event.target as HTMLInputElement).checked"
      @focus="onFocus"
      @blur="onBlur"
    />
    <label
      class="m-form-toggle__label"
      :for="fieldId"
    >
      <slot>{{ props.label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, toRef } from 'vue';

import type { IEmits, IProps } from '@/components/Materials/Form/Toggle';
import { type BaseFieldProps,useField } from '@/components/Materials/Headless/Field';
import { useFieldState } from '@/components/Materials/Headless/FieldState';

defineOptions({ name: 'FormToggle' });

const props = withDefaults(defineProps<IProps & BaseFieldProps<boolean>>(), {
  disabled: false,
  variant: 'default',
  direction: 'left',
});

defineModel({ type: Boolean, default: false });

defineSlots<{
  default: () => void;
}>();

const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `toggle${$uid}`;

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: boolean];
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

const modifiers = computed(() => ({
  [props.variant]: true,
  [props.direction]: true,
  focus: focused.value,
  disabled: props.disabled,
  valid: field.invalid.value === false,
  invalid: field.invalid.value === true,
}));
</script>

<style lang="scss" src="./Toggle.scss">
</style>
