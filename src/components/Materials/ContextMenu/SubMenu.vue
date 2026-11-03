<template>
  <div
    v-show="props.visible"
    :class="GenerateModifiers('m-contextmenu-item', {
      arrowRight: true,
      disabled: props.disabled,
    })"
    @mouseover="emit('over')"
    @mouseout="emit('out')"
  >
    <div class="ContextMenuItemName">
      {{ props.label }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContextSubMenu' });

defineSlots<{
  default(): void;
}>();

const emit = defineEmits<{
  over: [];
  out: [];
}>();

interface IProps {
  disabled?: boolean;
  visible?: boolean;
  label: string;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  visible: true,
});
</script>
