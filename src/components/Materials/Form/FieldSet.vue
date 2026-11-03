<template>
  <fieldset class="m-form-fieldset">
    <legend class="m-form-fieldset__legend">
      <slot name="legend">
        {{ props.legend }}
      </slot>
    </legend>
    <div class="m-form-fieldset__content">
      <slot />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
defineOptions({ name: 'FormFieldSet' });

defineSlots<{
  default: () => void;
  legend: () => void;
}>();

const props = defineProps<{
  legend?: string;
}>();
</script>

<style lang="scss" src="./FieldSet.scss">
</style>
