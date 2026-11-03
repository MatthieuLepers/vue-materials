<template>
  <div class="m-form-droparea">
    <button
      :class="GenerateModifiers('m-form-droparea__button', props.modifiers)"
      @drop.prevent="actions.handleDrop"
      @dragover.prevent
      @click="actions.handleClick"
      @dragenter.prevent="hover = true"
      @dragleave="hover = false"
    >
      {{ t('Materials.Form.DropArea.areaLabel') }}<br />
      <span class="icon-import" />
    </button>
    <input
      class="m-form-droparea__input"
      multiple
      tabindex="-1"
      ref="input"
      type="file"
      @input="actions.handleUploadFiles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'FormDropArea' });

const { t } = useI18n();
const emit = defineEmits<{
  fileUpload: [files: Array<File>];
}>();

const input = ref<HTMLInputElement | null>(null);

interface IProps {
  modifiers?: Record<string, boolean>;
}

const props = withDefaults(defineProps<IProps>(), {
  modifiers: () => ({}),
});

const hover = ref(false);

const actions = {
  handleDrop(e: DragEvent) {
    const [...droppedFiles] = e.dataTransfer?.files ?? [];
    if (!droppedFiles) return;
    emit('fileUpload', droppedFiles);
    hover.value = false;
  },
  handleUploadFiles(e: Event) {
    const [...droppedFiles] = (e.target as HTMLInputElement)?.files ?? [];
    if (!droppedFiles) return;
    emit('fileUpload', droppedFiles);
  },
  handleClick() {
    input.value?.click();
  },
};
</script>

<style lang="scss" src="./DropArea.scss">
</style>
