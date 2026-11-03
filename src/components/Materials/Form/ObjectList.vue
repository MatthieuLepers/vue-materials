<template>
  <div class="m-object-list">
    <h3 class="m-object-list__title">
      {{ props.title }}
      <button
        v-if="!props.max || (!!props.max && modelList.length < props.max)"
        type="button"
        :aria-label="t('Materials.Form.ObjectList.addModel')"
        :class="GenerateModifiers('m-object-list__button', { add: true })"
        @click="addModel"
      >+</button>
    </h3>
    <ul class="m-object-list__list">
      <li
        v-for="(item, i) in modelList"
        :key="i"
        :class="GenerateModifiers('m-object-list__list-item', { removable: modelList.length > props.min })"
      >
        <slot :index="i" :model="item" />
        <button
          v-if="modelList.length > props.min"
          type="button"
          :aria-label="t('Materials.Form.ObjectList.removeModel')"
          :class="GenerateModifiers('m-object-list__button', { remove: true })"
          @click="removeModel(item)"
        >-</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" generic="O extends Record<string, unknown>">
import {
  onMounted,
  type Ref,
  ref,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'FormObjectList' });

const { t } = useI18n();

const modelValue = defineModel<Array<O>>({ default: () => [] });

const props = withDefaults(defineProps<{
  title?: string;
  model: O;
  min?: number;
  max?: number;
}>(), {
  min: 1,
});

const modelList = ref(modelValue.value) as Ref<Array<O>>;

function addModel() {
  modelList.value.push({ ...props.model } as O);
  modelValue.value = modelList.value;
}

function removeModel(model: O) {
  modelList.value = modelList.value.filter((m) => m !== model);
  modelValue.value = modelList.value;
}

const updateModelValue = () => {
  if (modelList.value.length < props.min) {
    modelList.value.push(...Array.from({ length: props.min - modelList.value.length }, () => ({ ...props.model } as O)));
  }
  if (props.max) {
    modelList.value = modelList.value.slice(0, props.max);
  }
};

watch(() => modelValue.value, (newVal) => {
  modelList.value = newVal;
});

watch(() => props.min, () => {
  updateModelValue();
});

watch(() => props.max, () => {
  updateModelValue();
});

onMounted(() => {
  updateModelValue();
});
</script>

<style lang="scss" src="./ObjectList.scss">
</style>
