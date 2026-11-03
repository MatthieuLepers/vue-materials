<template>
  <span :class="`${props.icon} m-loader-icon`" />
</template>

<script setup lang="ts">
defineOptions({ name: 'LoaderIcon' });

interface IProps {
  icon?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'icon-loader',
});
</script>

<style lang="scss" src="./Icon.scss"></style>
