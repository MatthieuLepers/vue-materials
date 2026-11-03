import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export interface IEmits extends IFieldStateEmits {
}

export interface IProps {
  // Form
  id?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  // Design system related
  variant?: 'default';
  direction?: 'left' | 'right';
}
