import type { Ref } from 'vue';

import type {
  IProps as ISelectProps,
  ISlots as ISelectSlots,
} from '@/components/Materials/Form/Select';
import type { ComboboxOption } from '@/components/Materials/Headless/Combobox';

export interface IEmits<TOption extends ComboboxOption = ComboboxOption> {
  keydownEnter: [searchText: Ref<string>];
  optionUnselected: [option: TOption];
  optionSelected: [option: TOption];
  focus: [focused: boolean];
  blur: [focused: boolean];
  fetchOptions: [options: Array<TOption>];
}

export interface ISlots<TOption extends ComboboxOption = ComboboxOption> extends ISelectSlots<TOption> {
}

export interface IProps<TOption extends ComboboxOption = ComboboxOption> extends Omit<ISelectProps<TOption>, 'options' | 'searchable'> {
  // Business logic
  find: (search: string) => Promise<Array<TOption>>;
  preFetch?: boolean;
}
