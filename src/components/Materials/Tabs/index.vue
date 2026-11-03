<template>
  <div :class="GenerateModifiers('m-tabs', props.modifiers)">
    <nav
      class="m-tabs__navigation"
      @wheel="actions.handleMouseWheel"
    >
      <VueDraggableNext
        v-model="tabs"
        :move="props.allowMoveFn"
        class="m-tabs__navigation-list"
        tag="ul"
        @change="actions.handleChangeOrder"
      >
        <li
          v-for="(tab, i) in tabs"
          :key="tab.id"
          :data-tab="tab.label"
          :class="GenerateModifiers('m-tabs__navigation-list__item', {
            current: tab.id === modelValue,
            hidden: offset > i,
          })"
        >
          <button
            type="button"
            class="m-tabs__navigation-button"
            @click="modelValue = tab.id"
          >
            <slot :name="`${tab.id}Nav`" :tab="tab">
              {{ tab.label }}
            </slot>
          </button>
        </li>
        <li
          v-if="props.allowAdd"
          class="m-tabs__navigation-list__item"
        >
          <button
            type="button"
            class="m-tabs__navigation-list__add"
            @click="emit('newTab')"
          >
            <span class="icon-plus" />
          </button>
        </li>
      </VueDraggableNext>
    </nav>
    <div class="m-tabs__container">
      <slot :name="currentTab!.id" :tab="currentTab!" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';

defineOptions({ name: 'Tabs' });

export interface ITab {
  id: string | number;
  label: string;
  order?: number;
}

interface ITabSlotProps {
  tab: ITab;
}

defineSlots<{
  [key: string]:(props: ITabSlotProps) => void;
}>();

const emit = defineEmits<{
  newTab: [];
}>();

const modelValue = defineModel<string | number, string>();
const tabs = defineModel<Array<ITab>>('tabs', { default: () => [] });

interface IProps {
  allowAdd?: boolean;
  allowMoveFn?: () => boolean;
  modifiers?: Record<string, boolean>;
}

const props = withDefaults(defineProps<IProps>(), {
  allowAdd: false,
  allowMoveFn: () => true,
  modifiers: () => ({}),
});

const offset = ref(0);

const currentTab = computed(() => tabs.value.find(({ id }) => modelValue.value === id));

const actions = {
  handleMouseWheel(e: WheelEvent) {
    const delta = e.deltaY > 0 ? 1 : -1;
    offset.value = Math.max(0, Math.min(tabs.value.length - 1, offset.value + delta));
  },
  handleChangeOrder() {
    tabs.value.forEach((tab, i) => {
      tab.order = i;
    });
  },
};
</script>

<style lang="scss" src="./index.scss">
</style>
