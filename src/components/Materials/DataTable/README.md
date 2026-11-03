[Home](/README.md) > Front-End > components > Materials > [DataTable](/src/components/Materials/DataTable/README.md)

# Datatable

A datatable is complexe but fully customizable dataviewer

It become easyer to use if your already use [entity system](/src/core/entities/README.md). But it's not required to use entity system.

## Datatable props

- **columns**: definition of datatable's columns
- **data**: an array of entities to display in the datatable
- **perPage**: if pagination is enabled,define how much entities are display per pages (default: 20)
- **filters**: custom entity filters
- **paginate**: enable pagination (default: true)
- **variant**: choose style variant, you can also define new styles but you will have to update SCSS

## Slots

- **[columnName]**: You can customize each column cell by using it slot defined by the column name

Column slot provide props defined by this typescript type :

```typescript
interface IColumnSlotProps<T1, T2> {
  obj: T1;
  value: T2, // typeof obj[value]
  column: IColumn<T1>, // See bellow for this type
}
```

where:
- **obj**: the entity to display
- **value**: the current column value to display in cell
- **column**: The current column object in case you need some of these properties into this cell

Example:
```html
<template>
  <DataTable
    :columns="..."
    :data="..."
  >
    <template #myColumnName="props">
      {{ props.obj.otherField }}
      {{ props.value }}
      {{ props.column.className }}
      {{ props.column.label }}
    </template>

    <!-- OR -->

     <template #myColumnName="{ obj, value, column }">
      {{ obj.otherField }}
      {{ value }}
      {{ column.className }}
      {{ column.label }}
     </template>
  </DataTable>
</template>
```

### About custom entity `filters` prop

You can filter entities by using custom filter passed to the datatable `filters`prop.

Filters prop is an object defined by this typescript type :

```typescript
type FiltersProp<T> = Record<string, (entity: T) => number>;
```

example:

```html
<template>
  <DataTable
    ...
    :data="entityList"
    :filters="dataFilters"
    ...
  />
</template>

<script setup>
  const entityList = [...];

  const filters = {
    firstFilter: (entity) => entity.id > 0 && entity.id < 100,
    secondFilter: (entity) => entity.getI18n('title').includes('Niji'),
  };
</script>
```

## About columns props and column definition

Columns prop is typed with this typescript type :

```typescript
interface IColumn<T> {
  label: string;
  filter?: (a: T, b: T, desc: boolean) => number;
  className?: string;
}

type ColumnsProp = Record<string, IColumn>;
```

Interface `IColumn` :
- **label**: Mandatory, define the displayed text for this column
- **filter**: Optional, when define, allow the column to be sorted
- **className**: Optional, define a custom class for this column and it cells

## Full example

```html
<template>
  <main>
    <button @click="state.currentFilter = 'all'">
      All
    </button>
    <button @click="state.currentFilter = 'fruit'">
      Fruits
    </button>
    <button @click="state.currentFilter = 'vegatable'">
      Vegetables
    </button>
    <MaterialDataTable
      :column="column"
      :data="state.objList"
      :paginate="false"
      :filters="{
        [state.currentFilter]: filters[state.currentFilter],
      }"
    >
      <template #colors="{ value }">
        {{ value.join(', ') }}
      </template>
    </MaterialDataTable>
  </main>
</template>

<script setup>
import { reactive, computed } from 'vue';

import MaterialDataTable from '@/components/Materials/DataTable/index.vue';

const state = reactive({
  currentFilter: 'all',
  objList: [
    {
      id: 1,
      name: 'Apple',
      colors: ['green', 'red', 'yellow', 'black'],
      period: 'July to november',
      type: 'fruit',
    },
    {
      id: 2,
      name: 'Pumpkin',
      colors: ['orange', 'green'],
      period: 'September to october',
      type: 'vegetable',
    },
    {
      id: 3,
      name: 'Cherry',
      colors: ['white', 'red', 'green'],
      period: 'end of spring to autumn',
      type: 'fruit',
    },
  ],
});

const filters = {
  all: () => true,
  fruit: (obj) => obj.type === 'fruit',
  vegetable: (obj) => obj.type === 'vagetable',
};

const columns = {
  id: {
    label: 'Identifiant',
    filter: (a, b, desc) => (desc ? a.id - b.id : b.id - a.id),
  },
  name: {
    label: 'Nom',
  },
  type: {
    label: 'Type',
    filter: (a, b, desc) => desc ? b.type.localeCompare(a.type) : a.type.localeCompare(b.type),
  },
  colors: {
    label: 'Couleurs possibles',
  },
  period: {
    label: 'Période de récolte',
  },
};
</script>
```

Should exactly result into :

| Identifiant ↕️ | Nom | Type ↕️ | Couleurs possibles | Période de récolte
| ---- | ---- | ---- | ---- | ---- |
| 1 | Apple | fruit | green, red, yellow, black | July to november |
| 2 | Pumpkin | vegetable | orange, green | September to october |
| 3 | Cherry | fruit | white, red, green | end of spring to autumn |
