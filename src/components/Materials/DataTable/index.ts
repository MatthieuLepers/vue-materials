export type FilterFunction<T> = (obj: T) => number;

export type SortFunction<T> = (a: T, b: T, desc: boolean) => number;

export interface IColumn<T> {
  label: string;
  sort?: SortFunction<T>;
  className?: string;
}

export type Columns<T> = Record<string, IColumn<T>>;

export type Variant = 'default' | 'clear';

export interface IProps<T> {
  columns: Columns<T>;
  data: Array<T>;
  perPage?: number;
  filters?: Record<string, FilterFunction<T>>;
  paginate?: boolean;
  showActionRow?: boolean;
  showSelectionRow?: boolean;
  allowMoveFn?: () => boolean;
}

export interface IState {
  key: string | null;
  direction: string;
}

export interface IColumnSlotProps<T1, T2> {
  obj: T1;
  value: T2;
  column: IColumn<T1>;
}

export interface IColumnHeaderSlotProps<T> {
  obj: IColumn<T>;
  value: string;
  sortData?: {
    icon: string;
    onClick: () => void;
  };
}

export interface IActionColumnInnerSlotProps<T1> {
  obj: T1,
  close(): void;
}

export interface IActionColumnSlotProps<T1> {
  obj: T1;
}

export type ISlots<T1, T2> = {
  actionColumnInner(props: IActionColumnInnerSlotProps<T1>): void;
  actionColumn(props: IActionColumnSlotProps<T1>): void;
  afterRow(props: IActionColumnSlotProps<T1>): void;
  lastRow(props: IActionColumnSlotProps<T1>): void;
  beforeData(): void;
  afterData(): void;
} & {
  [key: keyof Columns<T1>]: (props: IColumnSlotProps<T1, T2>) => void;
};
