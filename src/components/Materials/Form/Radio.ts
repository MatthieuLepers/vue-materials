import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export type TModelValue = string | number | boolean;

export interface IEmits extends IFieldStateEmits {
}

export interface IProps {
  // Form
  id?: string;
  value: TModelValue;
  name?: string;
  label: string;
  disabled?: boolean;
  variant?: 'default' | 'tiny';
}
