<template>
  <div :class="GenerateModifiers('m-form-field-line', { [props.size]: props.size > 1 })">
    <FormFieldContainer
      v-for="i in slots"
      :key="i"
      :modifiers="props.modifiers"
    >
      <slot v-if="props.size > 1" :name="`field${i}`" />
      <slot v-else />
    </FormFieldContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import FormFieldContainer from '@/components/Materials/Form/FieldContainer.vue';

defineOptions({ name: 'FormFieldLine' });

defineSlots<{
  default(): void;
  [key: string]: () => void;
}>();

interface IProps {
  size?: number;
  modifiers?: Record<string, boolean>;
}

const props = withDefaults(defineProps<IProps>(), {
  size: 1,
  modifiers: () => ({}),
});

const slots = computed(() => [...Array(props.size).keys()]);
</script>

<style lang="scss" src="./FieldLine.scss">
</style>
