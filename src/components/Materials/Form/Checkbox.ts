import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export type TValue = string | number | boolean | null;

export type TModelValue = Array<TValue> | TValue;

export interface IClickEmitDetails {
  value: TValue;
  checked: boolean;
}

export interface IEmits extends IFieldStateEmits {
  click: [e: MouseEvent, details: IClickEmitDetails];
}

export interface IProps {
  // Form
  id?: string;
  value: TValue;
  name?: string;
  label: string;
  disabled?: boolean;
  // Design system related
  variant?: 'default' | 'small' | 'x-small';
  modifiers?: Partial<Record<'reverse', boolean>>;
}
