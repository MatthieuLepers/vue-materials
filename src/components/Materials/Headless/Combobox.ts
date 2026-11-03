import {
 computed,
 type Ref,
 ref,
 watch,
} from 'vue';

import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export type ComboboxOptionValue = string | number | boolean;

export type ComboboxModelValue = ComboboxOptionValue | ComboboxOptionValue[] | undefined;

export interface ComboboxOption {
  label: string;
  value: ComboboxOptionValue;
  group?: string;
}

export interface IEmits<TOption extends ComboboxOption = ComboboxOption> extends IFieldStateEmits {
  keydownEnter: [searchText: Ref<string>];
  optionUnselected: [option: TOption];
  optionSelected: [option: TOption];
}

export interface ISlots<TOption extends ComboboxOption = ComboboxOption> {
  selectedOption: (props: { option: TOption }) => void;
  optgroup: (props: { group: string }) => void;
  option: (props: { option: TOption }) => void;
  empty: (props: { search: string }) => void;
}

export interface IProps<TOption extends ComboboxOption = ComboboxOption> {
  // Form
  id?: string;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  // Design system related
  variant?: 'default' | 'box';
  modifiers?: Record<string, boolean>;
  // Business logic
  options?: Array<TOption>;
  searchable?: boolean;
  inputPlaceholder?: string;
  dropdownPosition?: 'top' | 'bottom';
  allowRemoveSelected?: boolean;
}

export function useCombobox<T extends ComboboxOption = ComboboxOption>(params: {
  options: Ref<T[]>;
  modelValue: Ref<ComboboxModelValue>;
  search: Ref<string>;
  searchable?: boolean;
}) {
  const open = ref(false);
  const activeIndex = ref(0);
  const selectedValues = ref<ComboboxOptionValue[]>([]);

  const multiple = computed(() => Array.isArray(params.modelValue.value));

  // filtered options
  const filtered = computed(() => {
    if (!params.searchable || !params.search.value) return params.options.value;

    return params.options.value
      .filter((o) => o.label.toLowerCase().includes(params.search.value.toLowerCase()))
    ;
  });

  // grouped options
  const grouped = computed(() => {
    return filtered.value.reduce((acc, opt) => {
      const key = opt.group ?? '__default__';
      acc[key] = acc[key] || [];
      acc[key].push(opt);
      return acc;
    }, {} as Record<string, T[]>);
  });

  const flat = computed(() => filtered.value);

  const hasSelection = computed(() => selectedValues.value.length > 0);

  const selectedOptions = computed(() => params.options.value.filter((o) => selectedValues.value.includes(o.value)));

  const isGroupable = computed(() => params.options.value.every((o) => !!o.group));

  const isSelected = (value: ComboboxOptionValue) => selectedValues.value.includes(value);

  function select(option: T): {
    modelValue: ComboboxModelValue;
    removed?: T;
    added?: T;
  } {
    if (multiple.value) {
      const current = selectedValues.value;

      if (current.includes(option.value)) {
        const next = current.filter(v => v !== option.value);
        params.modelValue.value = next;

        return {
          modelValue: next,
          removed: option,
        };
      }

      const next = [...current, option.value];
      params.modelValue.value = next;

      return {
        modelValue: next,
        added: option,
      };
    }

    const removed = params.options.value.find((o) => o.value === params.modelValue.value);
    params.modelValue.value = option.value;
    open.value = false;
    return {
      modelValue: option.value,
      removed,
      added: option,
    };
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open.value && (e.key === 'Enter' || e.key === 'ArrowDown')) {
      open.value = true;
      return;
    }

    if (!open.value) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex.value = Math.min(
        flat.value.length - 1,
        activeIndex.value + 1,
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex.value = Math.max(0, activeIndex.value - 1);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const opt = flat.value[activeIndex.value];
      if (opt) select(opt);
    }

    if (e.key === 'Escape') {
      open.value = false;
    }
  }

  // sync model -> internal state
  watch(() => params.modelValue.value, (v) => {
    selectedValues.value = Array.isArray(v) ? v : v != null ? [v] : [];
  }, { immediate: true });

  return {
    // state
    open,
    activeIndex,
    selectedValues,

    // derived
    filtered,
    grouped,
    flat,
    multiple,
    hasSelection,
    selectedOptions,
    isGroupable,

    // helpers
    isSelected,
    select,
    onKeydown,
  };
}
