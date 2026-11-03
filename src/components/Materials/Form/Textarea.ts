import type { TextFieldIconData } from '@/components/Materials/Form/Input';
import type { IEmits as IFieldStateEmits } from '@/components/Materials/Headless/FieldState';

export interface IEmits extends IFieldStateEmits {
  click: [],
  keydown: [e: KeyboardEvent],
  icon: [e: MouseEvent],
}

export interface IProps {
  // Form
  id?: string;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  autocomplete?: string; // InputAutoCompleteAttribute
  rows?: number;
  // Design system related
  iconData?: TextFieldIconData;
  variant?: 'default' | 'intline' | 'box';
  modifiers?: Record<string, boolean>;
}
