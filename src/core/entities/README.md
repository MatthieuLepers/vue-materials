[Home](/README.md) > Materials > core > [Entity system](/src/core/entities/README.md)

# Entity system

## What is an entity ?

An entity is a front-end representation of a database row.
It's defined by minimum 2 files : a `i.ts` that define all interfaces relative to this entity and a `index.ts` taht define the entity itself.

## How to define an entity ?

It's quite simple since you choose the right base class between `AbstractEntity` and `AbstractI18nEntity`. Create a new directory named like your new entity (ex. user) then create both required files `i.ts` and `index.ts`

```typescript
// i.ts
export interface IUser {
  readonly id: number;
  name: string;
  // other fields here
}
```

```typescript
// index.ts
import AbstractEntity from '../AbstractEntity';
import type { IUser } from './i';

export class User extends AbstractEntity<IUser> {
  declare readonly id: number;

  declare name: string;

  constructor(data: IUser) {
    super(data, ['userProjects']);
  }

  // User methods, api call, custom getters/setters, etc...
}
```

#### About `super` constructor second param :

It's the list of fields you don't want to be mapped automatically by parent class AbstractEntity, example your database entity has a one-to-many or many-to-many association retrieved in an array field.

Example here User has a many-to-many association resulting in a `userProjects` field, we don't want this field to be mapped by AbstractEntity then we specify it in the list of fields we want to exclude from mapping. Then you can define your own getter and setter for these fields. This method is usable for any field of any type.

## Sub entities

When you define your own getters for non-automatically mapped fields, let's talk about sub entity system : for our example with User and **User <-> Project** many-to-many association, we want our custom getter to return entities instead of raw data

```typescript
...

export class User extends AbstractEntity<IUser> {
  ...

  get userProjects(): Array<UserProject> {
    return (this.data.userProjects ?? [])
      .map((data) => new UserProject(data))
    ;
  }

  ...
}
```

Here, our custom getter define a way to access `userProjects` field and return an array of `UserProject` sub entities.

Note: You can still access raw data by using `this.data` accessor that stores every fields of our entity in raw format.

## About AbstractI18nEntity

I18n entity is basically an AbstractEntity with a one-to-many association retrieved into a `i18n` array.

To use this type of entity, database entity must contain a one-to-many association named `i18n` and returns an array of i18n rows.

This i18n system only work if `vue-i18n` is installed an correctly configured.

Example:

```typescript
// i.ts

export interface MyEntityI18n {
  locale: string;
  title: string;
  description: string;
}

export interface MyEntity {
  readonly id: number;
  createdAt: Date;
  updatedAt: Date;
  i18n: Array<MyEntityI18n>;
}
```

```typescript
import AbstractI18nEntity from '../AbstractI18NEntity';
import type { MyEntity } from './i';

export class MyEntity extends AbstractI18nEntity<MyEntity> {
  declare readonly id: number;

  declare createdAt: Date;

  declare updatedAt: Date;

  constructor(data: MyEntity) {
    super(data, []); // i18n field is automatically excluded from mapping by AbstractI18nEntity
  }
}
```

Then if you want to get access to an i18n field :

```html
// vue file
<template>
  <span>{{ myEntity.getI18n('title') }}</span>
</template>

<script setup>
const myEntity = MyEntity.findOne(1); // get entity from api database

// or

const myEntity = new MyEntity({
  id: 1,
  createdAt: new Date(),
  updatedAt: null,
  i18n: [
    {
      locale: 'en-EN',
      title: 'Testing i18n entities!',
      description: 'English description',
    },
    {
      locale: 'fr-FR',
      title: 'Test des entités i18n',
      description: 'Description en français',
    },
  ],
});
</script>
```