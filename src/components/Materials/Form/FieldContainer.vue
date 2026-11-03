<template>
  <div :class="GenerateModifiers('m-form-field-container', props.modifiers)">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'FormFieldContainer' });

defineSlots<{
  default(): void;
}>();

interface IProps {
  modifiers: Record<string, boolean>;
}

const props = withDefaults(defineProps<IProps>(), {
  modifiers: () => ({}),
});
</script>

<style lang="scss" src="./FieldContainer.scss">
</style>
