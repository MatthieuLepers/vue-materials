<template>
  <ul
    v-if="props.field.messages.value.length && ((props.field.invalid.value === true && props.field.dirty.value) || !props.field.invalid.value)"
    class="m-form-message-list"
  >
    <li
      v-for="(messageEntry, i) in props.field.messages.value"
      :key="i"
      :class="GenerateModifiers('m-form-message-item', { error: props.field.invalid.value === true })"
    >
      <span
        :class="['m-form-message__icon', {
          'icon-info': props.field.invalid.value === false,
          'icon-warning': props.field.invalid.value === true && props.field.dirty.value,
        }]">
      </span>
      {{ messageEntry }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { UseFieldReturn } from '@/components/Materials/Headless/Field';

defineOptions({ name: 'FormMessageList' });

const props = defineProps<{
  field: UseFieldReturn['field'];
}>();
</script>

<style lang="scss" src="./MessageList.scss">
</style>
