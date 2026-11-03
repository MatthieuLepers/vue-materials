<template>
  <div
    :class="GenerateModifiers('m-form-input', modifiers)">
    <div class="m-form-input__container">
      <input
        :id="fieldId"
        :type="inputType"
        :placeholder="props.placeholder"
        :pattern="props.pattern"
        :required="props.required"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :value="model"
        :name="props.name"
        :autocomplete="props.autocomplete"
        :min="props.type === 'number' ? props.min : undefined"
        :max="props.type === 'number' && props.max ? props.max : undefined"
        :step="props.type === 'number' ? Math.abs(props.step) : undefined"
        @input="model = cast(($event.target as HTMLInputElement).value, typeof model)"
        @click="emit('click')"
        @keydown="emit('keydown', $event)"
        @focus="onFocus"
        @blur="onBlur"
        @mousewheel="handleMouseWheel"
      />
      <label
        v-if="props.label"
        class="m-form-input__label"
        :for="fieldId"
      >
        {{ props.label }}
      </label>
      <component
        v-if="(props.iconData?.icon && props.type !== 'password') || props.type === 'password' || props.iconData?.text"
        type="button"
        :is="props.iconData?.clickable || props.type === 'password' ? 'button' : 'span'"
        :class="[icon, GenerateModifiers('m-form-input__adornment', { clickable: props.iconData?.clickable || props.type === 'password' })]"
        :aria-label="props.iconData?.ariaLabel"
        :aria-hidden="!props.iconData?.clickable && props.type !== 'password'"
        @click.stop="(e: MouseEvent) => {
          toggle();
          emit('icon', e);
        }"
      >
        {{ props.iconData?.text || '' }}
      </component>
    </div>

    <MaterialFormMessageList :field="field" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  type Ref,
  toRef,
} from 'vue';

import MaterialFormMessageList from '@/components/Materials/Form/MessageList.vue';

import {
  type IEmits,
  type IProps,
  useNumberInput,
  usePasswordVisibility,
} from '@/components/Materials/Form/Input';
import { type BaseFieldProps,useField } from '@/components/Materials/Headless/Field';
import { useFieldState } from '@/components/Materials/Headless/FieldState';

defineOptions({ name: 'FormInput' });

const props = withDefaults(defineProps<IProps & BaseFieldProps<string | number>>(), {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  min: 0,
  step: 1,
  variant: 'default',
  modifiers: () => ({}),
});

defineModel<string | number>();
  
const $uid = getCurrentInstance()?.uid;
const fieldId = props.id ?? `textfield${$uid}`;

const emit = defineEmits<IEmits & {
  'update:modelValue': [value: string | number];
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

const { inputType, icon: passwordIcon, toggle } = usePasswordVisibility(props.type);

const { handleMouseWheel } = useNumberInput(model as Ref<number>, focused, props);

const icon = computed(() => (
  (props.iconData?.icon && props.type !== 'password' && props.iconData?.icon)
  || passwordIcon.value
  || props.iconData?.text
  || null
));

const isEmpty = computed(() => typeof model.value === 'string' && !model.value.length && !props.placeholder?.length)

const modifiers = computed(() => ({
  ...props.modifiers,
  [props.variant]: true,
  focus: focused.value,
  empty: isEmpty.value,
  required: props.required,
  readonly: props.readonly,
  disabled: props.disabled,
  adornment: !!props.iconData?.icon || !! props.iconData?.text || props.type === 'password',
  noLabel: !props.label?.length,
  valid: field.invalid.value === false,
  invalid: field.invalid.value === true,
}));


function cast(value: string, type: string) {
  if (type === 'number') {
    return parseFloat(value) || props.min || 0;
  }
  return value;
}
</script>

<style lang="scss" src="./Input.scss">
</style>
