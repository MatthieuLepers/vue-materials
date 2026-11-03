<template>
  <div :class="GenerateModifiers('m-form-textarea', modifiers)">
    <div class="m-form-textarea__container">
      <textarea
        :id="fieldId"
        :placeholder="props.placeholder"
        :required="props.required"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :value="model"
        :name="props.name"
        :autocomplete="props.autocomplete"
        :rows="props.rows"
        @input="model = ($event.target as HTMLTextAreaElement).value"
        @click="emit('click')"
        @keydown="emit('keydown', $event)"
        @focus="onFocus"
        @blur="onBlur"
      />
      <label
        v-if="props.label"
        class="m-form-textarea__label"
        :for="fieldId"
      >
        {{ props.label }}
      </label>
      <component
        v-if="props.iconData?.icon || props.iconData?.text"
        type="button"
        :is="props.iconData?.clickable ? 'button' : 'span'"
        :class="[props.iconData.icon, GenerateModifiers('m-form-textarea__adornment', { clickable: !!props.iconData?.clickable })]"
        :aria-label="props.iconData?.ariaLabel"
        :aria-hidden="!props.iconData?.clickable"
        @click.stop="emit('icon', $event)"
      >
        {{ props.iconData?.text || '' }}
      </component>
    </div>

    <MaterialFormMessageList :field="field" />
  </div>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, toRef} from 'vue';

import MaterialFormMessageList from '@/components/Materials/Form/MessageList.vue';

import type { IEmits,IProps } from '@/components/Materials/Form/Textarea';
import { type BaseFieldProps,useField } from '@/components/Materials/Headless/Field';
import { useFieldState } from '@/components/Materials/Headless/FieldState';

defineOptions({ name: 'FormTextarea' });

const props = withDefaults(defineProps<IProps & BaseFieldProps<string>>(), {
  required: false,
  readonly: false,
  disabled: false,
  variant: 'default',
  modifiers: () => ({}),
});

defineModel<string>();

const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `textarea${$uid}`;

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: string];
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

const isEmpty = computed(() => !model.value?.length && !props.placeholder?.length);

const modifiers = computed(() => ({
  ...props.modifiers,
  [props.variant]: true,
  focus: focused.value,
  empty: isEmpty.value,
  required: props.required,
  readonly: props.readonly,
  disabled: props.disabled,
  adornment: !!props.iconData?.icon || !!props.iconData?.text,
  noLabel: !props.label || !props.label.length,
  valid: field.invalid.value === false,
  invalid: field.invalid.value === true,
}));
</script>

<style lang="scss" src="./Textarea.scss">
</style>
