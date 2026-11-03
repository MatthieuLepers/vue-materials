<template>
  <div :class="GenerateModifiers('m-progress-bar', props.modifiers)">
    <span v-if="props.label || slots.label" class="m-progress-bar__label">
      <slot name="label">
        {{ props.label }}
      </slot>
    </span>
    <div
      class="m-progress-bar__track"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round((props.percent * 100) * 10) / 10"
      :aria-valuetext="`${Math.round((props.percent * 100) * 10) / 10}%`"
      :aria-label="props.ariaLabel"
    >
      <span
        class="m-progress-bar__progress"
        :style="{ width: `calc(${props.percent * 100}% - 4px)` }"
      >
        <slot name="track">
          {{ Math.round((props.percent * 100) * 10) / 10 }}%
        </slot>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

defineOptions({ name: 'ProgressBar' });

defineSlots<{
  label?:() => void;
  track?:() => void;
}>();

const slots = useSlots();

interface IProps {
  label?: string;
  ariaLabel?: string;
  percent?: number;
  modifiers?: Record<string, boolean>;
}

const props = withDefaults(defineProps<IProps>(), {
  percent: 0,
  modifiers: () => ({}),
});
</script>

<style lang="scss" src="./index.scss">
</style>
