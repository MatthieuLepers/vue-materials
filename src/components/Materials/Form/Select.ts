import type {
  ComboboxOption,
  IEmits as IComboboxEmits,
  IProps as IComboboxProps,
  ISlots as IComboboxSlots,
} from '@/components/Materials/Headless/Combobox';

export interface IEmits<TOption extends ComboboxOption = ComboboxOption> extends IComboboxEmits<TOption> {
}

export interface ISlots<TOption extends ComboboxOption = ComboboxOption> extends IComboboxSlots<TOption> {
}

export interface IProps<TOption extends ComboboxOption = ComboboxOption> extends IComboboxProps<TOption> {
}