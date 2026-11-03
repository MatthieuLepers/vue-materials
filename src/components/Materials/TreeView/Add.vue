<template>
  <li class="m-tree-node m-tree-node--add">
    <button
      v-if="!adding"
      type="button"
      class="m-tree-node__item"
      @click.stop="adding = true"
    >
      <span v-icon:plus />
      <span>
        <slot :parent="parent">
          Ajouter un noeud dans « {{ parent.title }} »
        </slot>
      </span>
    </button>
    <div v-else class="m-tree-node__form">
      <button
        type="button"
        class="m-tree-node__close"
        @click.stop="adding = false"
      >
        <span v-icon:close />
      </button>
      <input
        v-model="title"
        autofocus
        type="text"
        class="m-tree-node__input"
        :placeholder="props.placeholder"
        @keydown.enter="handleSubmit"
      />
      <button
        type="button"
        class="m-tree-node__submit"
        @click.stop="handleSubmit"
      >
        <span v-icon:check />
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { TreeNode } from '@/components/Materials/TreeView';

defineOptions({ name: 'TreeViewAddNode' });

defineSlots<{
  default(props: { parent: TreeNode }): void;
}>();

const title = ref<string>('');
const adding = ref<boolean>(false);

const props = withDefaults(defineProps<{
  placeholder?: string;
  parent: TreeNode;
}>(), {
  placeholder: 'Nom du nouveau noeud',
});

const emit = defineEmits<{
  submit: [title: string, parent?: TreeNode];
}>();

function handleSubmit() {
  emit('submit', title.value, props.parent?.id !== 0 ? props.parent : undefined);
  title.value = '';
}
</script>

<style lang="scss" src="./index.scss">
</style>
