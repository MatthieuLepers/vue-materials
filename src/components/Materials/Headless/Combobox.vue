<template>
  <div
    ref="root"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="combobox.open.value"
    :aria-controls="listboxId"
    :class="GenerateModifiers('m-combobox', {
      ...props.modifiers,
      [props.variant]: true,
      focus: focused || combobox.open.value,
      empty: !combobox.filtered.value.length,
      required: props.required,
      disabled: props.disabled,
      open: combobox.open.value,
      multiple: combobox.multiple.value,
    })"
    @keydown="combobox.onKeydown"
  >
    <!-- NATIVE FALLBACK -->
    <select
      class="m-combobox__original"
      :name="props.name"
      :multiple="combobox.multiple.value"
      :required="props.required"
      :disabled="props.disabled"
      @focus="() => {
        actions.open();
        onFocus();
      }"
      @blur="() => {
        actions.close();
        onBlur();
      }"
    >
      <option
        v-for="(option, i) in props.options"
        :key="i"
        :value="option.value"
        :selected="combobox.isSelected(option.value)"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- TRIGGER -->
    <div
      class="m-combobox__container"
      @click="actions.toggle"
    >
      <label
        v-if="props.label"
        class="m-combobox__label"
        :for="fieldId"
      >
        {{ props.label }}
        <strong v-if="combobox.hasSelection.value && combobox.multiple.value">
          ({{ combobox.selectedValues.value.length }})
        </strong>
      </label>

      <div class="m-combobox__outer">
        <!-- selected display SLOT -->
        <div class="m-combobox__outer__item-list">
          <template
            v-for="(opt, i) in combobox.selectedOptions.value"
            :key="i"
          >
            <slot
              name="selectedOption"
              :option="opt"
            >
              <component
                :is="props.allowRemoveSelected ? 'button' : 'span'"
                :type="props.allowRemoveSelected ? 'button' : undefined"
                :aria-label="props.allowRemoveSelected
                  ? t('Materials.Headless.Combobox.removeOption', [opt.label])
                  : undefined"
                class="m-combobox__outer__item"
              >
                {{ opt.label }}

                <span
                  v-if="props.allowRemoveSelected"
                  class="icon-close"
                  aria-hidden="true"
                />
              </component>
            </slot>
          </template>
        </div>

        <!-- search input -->
        <input
          v-if="props.searchable"
          v-model="search"
          class="m-combobox__input"
          :placeholder="props.inputPlaceholder"
          :disabled="props.disabled"
          :id="fieldId"
          autofocus
        />

        <span class="m-combobox__outer-arrow" aria-hidden="true" />
      </div>
    </div>

    <!-- DROPDOWN -->
    <div
      v-if="combobox.open"
      v-click-outside="{
        handler: actions.close,
        ignore: [root, dropdown],
        disabled: computed(() => !combobox.open.value),
      }"
      :id="listboxId"
      role="listbox"
      ref="dropdown"
      :class="GenerateModifiers('m-combobox__dropdown', {
        [props.dropdownPosition]: true,
      })"
      @wheel.stop
    >
      <!-- GROUPED -->
      <template v-if="combobox.isGroupable.value">
        <div
          v-for="(group, key) in combobox.grouped.value"
          :key="key"
          class="m-combobox__dropdown__group"
        >
          <!-- optgroup SLOT -->
          <slot name="optgroup" :group="key">
            <div class="m-combobox__dropdown__group-label">
              {{ key }}
            </div>
          </slot>

          <button
            v-for="(option, i) in group"
            :key="i"
            type="button"
            role="option"
            :aria-selected="combobox.isSelected(option.value)"
            :class="GenerateModifiers('m-combobox__dropdown__item', {
              removable: combobox.isSelected(option.value) && props.allowRemoveSelected,
              active: i === combobox.activeIndex.value,
              selected: combobox.isSelected(option.value),
            })"
            @click="actions.select(option)"
          >
            <slot name="option" :option="option">
              {{ option.label }}
            </slot>

            <span
              v-if="combobox.isSelected(option.value) && props.allowRemoveSelected"
              class="icon-close"
              aria-hidden="true"
            />
          </button>
        </div>
      </template>

      <!-- SIMPLE -->
      <template v-else>
        <button
          v-for="(option, i) in combobox.filtered.value"
          :key="i"
          :class="GenerateModifiers('m-combobox__dropdown__item', {
            removable: combobox.isSelected(option.value) && props.allowRemoveSelected,
            active: i === combobox.activeIndex.value,
            selected: combobox.isSelected(option.value),
          })"
          type="button"
          role="option"
          :aria-selected="combobox.isSelected(option.value)"
          :id="actions.optionId(i)"
          @click="actions.select(option)"
        >
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>

          <span
            v-if="combobox.isSelected(option.value) && props.allowRemoveSelected"
            class="icon-close m-combobox__dropdown__item__remove"
            aria-hidden="true"
          />
        </button>
      </template>

      <!-- EMPTY SLOT -->
      <div v-if="!combobox.filtered.value.length" class="m-combobox__empty">
        <slot name="empty" :search="search">
          {{ t('Materials.Headless.Combobox.emptyResult', [search]) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TOption extends ComboboxOption = ComboboxOption">
import {
 computed,
 getCurrentInstance,
 ref,
 toRef,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type {
  ComboboxModelValue,
  ComboboxOption,
  IEmits,
  IProps,
  ISlots,
} from '@/components/Materials/Headless/Combobox';
import { useCombobox } from '@/components/Materials/Headless/Combobox';

import { useFieldState } from './FieldState';

defineOptions({ name: 'Combobox' });

defineSlots<ISlots<TOption>>();

const props = withDefaults(defineProps<IProps<TOption>>(), {
  required: false,
  disabled: false,
  variant: 'default',
  options: () => [],
  searchable: false,
  dropdownPosition: 'bottom',
  allowRemoveSelected: false,
  modifiers: () => ({}),
});

const modelValue = defineModel<ComboboxModelValue>();
const search = defineModel<string>('search', { default: '' });

const $uid = getCurrentInstance()?.uid;
const listboxId = props.id ?? `combobox${$uid}`;
const fieldId = `combobox-input${$uid}`;
const root = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);
const { t } = useI18n();

const emit = defineEmits<IEmits<TOption>>();

const { focused, onFocus, onBlur } = useFieldState({
  focus: (v) => emit('focus', v),
  blur: (v) => emit('blur', v),
});

let combobox = useCombobox<TOption>({
  options: toRef(props, 'options'),
  modelValue,
  search,
  searchable: props.searchable,
});

const actions = {
  toggle() {
    if (props.disabled) return;
    combobox.open.value = !combobox.open.value;
  },
  open() {
    combobox.open.value = true;
  },
  close() {
    combobox.open.value = false;
  },
  select(option: TOption) {
    const { modelValue: result, removed, added } = combobox.select(option);
    modelValue.value = result;
    if (removed) emit('optionUnselected', removed);
    if (added) emit('optionSelected', added);
  },
  optionId(i: number) {
    return `opt-${listboxId}-${i}`;
  },
};
</script>

<style lang="scss" src="./Combobox.scss">
</style>
