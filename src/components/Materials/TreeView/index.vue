<template>
  <ul class="m-tree-view">
    <MaterialTreeNode
      v-for="(item, index) in sanitizedData"
      :key="item.id"
      :item="item"
      :index="index"
      :allowAdd="props.allowAdd"
      :allowRecursiveAdd="props.allowRecursiveAdd"
      :selectable="props.selectable"
      v-model:expandedIds="expandedIds"
      v-model:selected="selected"
      @select="handleSelectTreeNode"
      @add="(title, parent) => emit('add', title, parent)"
    >
      <template #default="props">
        <slot v-bind="props" />
      </template>
      <template #add="props">
        <slot name="add" v-bind="props" />
      </template>
    </MaterialTreeNode>
  </ul>
</template>

<script setup lang="ts">
import { computed, onMounted,watch } from 'vue';

import MaterialTreeNode from '@/components/Materials/TreeView/Node.vue';

import type { TreeNode, TreeNodeId } from '@/components/Materials/TreeView';

defineOptions({ name: 'TreeView' });

defineSlots<{
  default(props: { item: TreeNode, selected: boolean }): void;
  add(props: { parent: TreeNode }): void;
}>();

const props = withDefaults(defineProps<{
  data?: Array<TreeNode>;
  root?: string | TreeNode;
  allowAdd?: boolean;
  allowRecursiveAdd?: boolean;
  selectable?: boolean;
}>(), {
  data: () => ([]),
  allowAdd: false,
  allowRecursiveAdd: false,
  selectable: true,
});

const expandedIds = defineModel<Set<TreeNodeId>>('expandedIds', { required: false, default: () => new Set<TreeNodeId>() });
const selected = defineModel<TreeNode>('selected', { required: false });

const emit = defineEmits<{
  select: [node?: TreeNode];
  add: [title: string, parent?: TreeNode];
}>();

const sanitizedData = computed(() => {
  if (props.root) {
    if (typeof props.root === 'string') {
      return [{
        id: 0,
        title: props.root,
        children: props.data,
      }];
    }
    return [props.root];
  }

  return props.data;
});

function handleSelectTreeNode(node: TreeNode) {
  if (node.id === 0 || !props.selectable) return;

  if (selected.value?.id === node?.id) {
    selected.value = undefined;
  } else {
    selected.value = node;
  }

  emit('select', selected.value);
}

watch(() => props.root, (root) => {
  const rootId = typeof root ==='string' ? 0 : (root?.id ?? 0);

  if (root && !expandedIds.value.has(rootId)) {
    expandedIds.value.add(rootId);
  }
  if (!root && expandedIds.value.has(rootId)) {
    expandedIds.value.delete(rootId);
  }
});

onMounted(() => {
  if (props.root) {
    const rootId = typeof props.root ==='string' ? 0 : (props.root?.id ?? 0);

    expandedIds.value.add(rootId);
  }
});
</script>

<style lang="scss" src="./index.scss">
</style>
