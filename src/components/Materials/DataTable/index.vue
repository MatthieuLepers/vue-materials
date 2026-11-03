<template>
  <div class="m-datatable">
    <div class="m-datatable__header">
      <DataTableRow>
        <DataTableColumn
          v-if="props.showActionRow"
          :modifiers="{ action: true }"
        />
        <DataTableColumn :modifiers="{ inner: true, noActionRow: !props.showActionRow }">
          <DataTableColumn
            v-for="([column, columnData], i) in Object.entries(props.columns)"
            :key="i"
            :class="columnData.className"
            :data-label="columnData.label"
            :id="`${toCamelCase(columnData.label)}${$uid}`"
          >
            <DataTableButton
              v-if="!actions.isSortDisabled(column)"
              :modifiers="{
                longRound: true,
                [`sort${actions.getSortingDirection(column)}`]: true,
              }"
              @click="actions.sortBy(column)"
            >
              {{ columnData.label }}
            </DataTableButton>
            <span v-else>
              {{ columnData.label }}
            </span>
          </DataTableColumn>
        </DataTableColumn>
      </DataTableRow>
    </div>
    <div class="m-datatable__body">
      <VueDraggableNext
        :list="[...State.result]"
        :move="State.isGrabbable ? props.allowMoveFn : () => false"
        itemKey="id"
        @change="actions.handleOrderChange"
      >
        <slot name="beforeData" />
        <div
          v-for="(element, i) in State.result"
          :key="i"
        >
          <DataTableBodyRow
            :columns="props.columns"
            :obj="element"
            :showActionRow="props.showActionRow"
            :showSelectionRow="props.showSelectionRow"
            @selectLine="emit('selectLine', $event)"
          >
            <template #actionColumnInner="{ obj, close }">
              <slot name="actionColumnInner" :obj="obj" :close="close" />
            </template>
            <template #actionColumn="{ obj }">
              <slot name="actionColumn" :obj="obj" />
            </template>
            <template
              v-for="(columnName, j) in Object.keys(props.columns)"
              :key="j"
              #[columnName]="{ obj, value, column }"
            >
              <slot
                :name="columnName"
                :obj="obj"
                :value="value"
                :column="column"
              >
                {{ value }}
              </slot>
            </template>
            <template #secretArea="{ obj }">
              <slot name="afterRow" :obj="obj" />
            </template>
          </DataTableBodyRow>
          <slot name="lastRow" :obj="element" />
        </div>
        <slot name="afterData" />
      </VueDraggableNext>
    </div>
    <div
      v-if="props.paginate && State.paginated.length > 1"
      class="m-datatable__footer"
    >
      <DataTablePagination :data="State.paginated" :perPage="perPage" v-model="page" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="E, T extends Record<string, E>">
import {
  computed,
  getCurrentInstance,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';

import DataTableBodyRow from '@/components/Materials/DataTable/BodyRow.vue';
import DataTableButton from '@/components/Materials/DataTable/Button.vue';
import DataTableColumn from '@/components/Materials/DataTable/Column.vue';
import DataTablePagination from '@/components/Materials/DataTable/Pagination.vue';
import DataTableRow from '@/components/Materials/DataTable/Row.vue';

import { chunkArray, toCamelCase } from '@/core/utils';

import type { IProps, ISlots, IState } from '.';

defineOptions({ name: 'DataTable' });

defineSlots<ISlots<T, unknown>>();

const $uid = getCurrentInstance()?.uid;
const emit = defineEmits<{
  selectLine: [obj: T];
}>();

provide('uid', $uid);

const page = defineModel('page', { type: Number, default: 1 });

const props = withDefaults(defineProps<IProps<T>>(), {
  columns: () => ({}),
  data: () => [],
  perPage: 20,
  filters: () => ({}),
  paginate: true,
  showActionRow: true,
  showSelectionRow: false,
  allowMoveFn: () => true,
});

const perPage = ref(props.perPage);

const sorting = reactive<IState>({
  key: null,
  direction: '',
});

const State = computed(() => {
  const filtered = Object
    .values(props.filters)
    .reduce((objList, fn) => objList.filter(fn), props.data)
  ;
  const sorted = (() => {
    const { key, direction } = sorting;
    if (!key || !direction) {
      return filtered;
    }
    return filtered.slice().sort((a: T, b: T) => props.columns[key].sort!(a, b, direction === 'Desc'));
  })();
  const paginated = chunkArray(sorted, perPage.value);
  const result = props.paginate
    ? paginated[page.value - 1] || []
    : sorted
  ;
  const isGrabbable = result.every((obj) => obj.order !== undefined);

  return {
    filtered,
    sorted,
    paginated,
    result,
    isGrabbable,
  };
});

const actions = {
  isSortDisabled(key: string) {
    return !props.columns[key].sort;
  },
  getSortingDirection(key: string) {
    if (sorting.key && sorting.key === key) {
      return sorting.direction || '';
    }
    return '';
  },
  sortBy(key: string) {
    const sortDirection = actions.getSortingDirection(key);
    sorting.key = key;
    sorting.direction = !sortDirection || sortDirection === 'Desc' ? 'Asc' : 'Desc';
  },
  handleOrderChange() {
    State.value.result.forEach((obj, i) => {
      // @ts-expect-error - Can be better...
      obj.order = i;
    });
  },
};

watch(() => props.perPage, (value) => {
  perPage.value = value;
});
</script>

<style lang="scss" src="./index.scss">
</style>
