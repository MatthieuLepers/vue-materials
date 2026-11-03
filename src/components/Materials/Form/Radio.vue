<template>
  <div :class="GenerateModifiers('m-form-radio', modifiers)">
    <input
      type="radio"
      :id="fieldId"
      :value="props.value"
      :name="props.name"
      :disabled="props.disabled"
      :checked="model === props.value"
      @click="model = props.value"
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

import type { IEmits, IProps, TModelValue } from '@/components/Materials/Form/Radio';
import { type BaseFieldProps, useField } from '@/components/Materials/Headless/Field';
import { useFieldState } from '@/components/Materials/Headless/FieldState';

defineOptions({ name: 'FormRadio' });

const props = withDefaults(defineProps<IProps & BaseFieldProps<TModelValue>>(), {
  disabled: false,
  variant: 'default',
});

defineModel<TModelValue>();

defineSlots<{
  default: () => void;
}>();

const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `radio${$uid}`;

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: TModelValue];
}>();

const { model } = useField({
  modelValue: toRef(props, 'modelValue'),
  validator: props.validator,
  emit: (v) => emit('update:modelValue', v),
});

const { focused, onFocus, onBlur } = useFieldState({
  focus: (v) => emit('focus', v),
  blur: (v) => emit('blur', v),
});

const modifiers = computed(() => ({
  focus: focused.value,
  [props.variant]: true,
}));
</script>

<style lang="scss" src="./Radio.scss">
</style>
