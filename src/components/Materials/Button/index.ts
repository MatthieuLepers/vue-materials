export interface ISlots {
  default(): void;
  icon(): void;
}

export type ColorModifiers = 'primary' | 'secondary' | 'success' | 'danger' | 'grey200' | 'grey400';

export type StyleModifiers = 'fill' | 'stroke' | 'squared';

export type Modifiers = ColorModifiers | StyleModifiers | 'responsive';

export interface IProps {
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  icon?: string | boolean;
  iconSide?: 'right' | 'left';
  modifiers?: Partial<Record<Modifiers, boolean>>;
}
