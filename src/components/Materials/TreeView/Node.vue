<template>
  <li :class="GenerateModifiers('m-tree-node', {
    addable: props.allowAdd,
    expandable: hasChildren,
    root: item.id === 0,
  })">
    <component
      :is="item.id === 0 || !props.selectable ? 'div' : 'button'"
      :type="item.id === 0 || !props.selectable ? undefined : 'button'"
      :class="GenerateModifiers('m-tree-node__item', {
        thumb: props.index > 0,
      })"
      @click.stop="item.id === 0 || !props.selectable ? void(0) : emit('select', item)"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="m-tree-node__toggle"
        @click.stop="handleToggleTreeNode(item)"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </button>

      <div class="m-tree-node__body">
        <slot
          :item="item"
          :selected="props.selectable && selected?.id === item.id"
        >
          {{ item.id }}
        </slot>
      </div>
    </component>

    <ul
      v-if="(isExpanded && hasChildren) || (!hasChildren && props.allowRecursiveAdd)"
      class="m-tree-node__children"
    >
      <TreeViewNode
        v-for="(child, index) in item.children"
        :key="child.id"
        :item="child"
        :index="index"
        :allowAdd="props.allowAdd"
        :allowRecursiveAdd="props.allowRecursiveAdd"
        :selectable="props.selectable"
        v-model:expandedIds="expandedIds"
        v-model:selected="selected"
        @toggle="handleToggleTreeNode"
        @select="handleSelectTreeNode"
        @add="handleAddNode"
      >
        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>
      </TreeViewNode>
      <TreeViewAdd
        v-if="props.allowAdd || props.allowRecursiveAdd"
        :parent="item"
        @submit="handleAddNode"
      >
        <template #default="props">
          <slot name="add" v-bind="props" />
        </template>
      </TreeViewAdd>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import TreeViewAdd from '@/components/Materials/TreeView/Add.vue';

import type { TreeNode, TreeNodeId } from '@/components/Materials/TreeView';

defineOptions({ name: 'TreeViewNode' });

defineSlots<{
  default(props: { item: TreeNode, selected: boolean }): void;
  add(props: { parent: TreeNode }): void;
}>();

const props = withDefaults(defineProps<{
  item: TreeNode;
  index: number;
  allowAdd?: boolean;
  allowRecursiveAdd?: boolean;
  selectable?: boolean;
}>(), {
  allowAdd: false,
  allowRecursiveAdd: false,
  selectable: true,
});

const expandedIds = defineModel<Set<TreeNodeId>>('expandedIds', { required: false, default: () => new Set<TreeNodeId>() });
const selected = defineModel<TreeNode>('selected', { required: false });

const emit = defineEmits<{
  select: [node: TreeNode];
  add: [title: string, parent?: TreeNode];
}>();

const isExpanded = computed(() => expandedIds.value.has(props.item.id));

const hasChildren = computed(() => !!props.item.children?.length);

function handleToggleTreeNode(node: TreeNode) {
  if (expandedIds.value.has(node.id)) {
    expandedIds.value.delete(node.id);
  } else {
    expandedIds.value.add(node.id);
  }
}

function handleSelectTreeNode(node: TreeNode) {
  if (!props.selectable) return;

  selected.value = node;
  emit('select', node);
}

function handleAddNode(title: string, parent?: TreeNode) {
  emit('add', title, parent?.id !== 0 ? parent : undefined);
}
</script>

<style lang="scss" src="./index.scss">
</style>
