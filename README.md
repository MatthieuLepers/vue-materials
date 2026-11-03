# Vue Materials

A collection of Vue 3 components, composables, directives, plugins and utilities.

## Installation from GitHub

This repository is intentionally not published to the npm registry. Install it directly from GitHub:

```bash
npm install github:MatthieuLepers/vue-materials#feat/package-library
```

Vue 3.5 or newer is required and must be provided by the consuming application.

## Imports

Import only the modules you need:

```ts
import { Button, FormSelect, Modal } from 'vue-materials/components';
import { AbstractEntity, DateUtils } from 'vue-materials/core';
import { debounce, chunkArray } from 'vue-materials/utils';
import { useFocusTrap, useElementSize } from 'vue-materials/composables';
import { vClickOutside, vFocus } from 'vue-materials/directives';
import { DateFormat, GenerateModifiers, i18n } from 'vue-materials/plugins';
import 'vue-materials/styles';
```

The package root also re-exports the components:

```ts
import { Button, Modal } from 'vue-materials';
```

## Vue plugins

Register the plugins your application uses:

```ts
import { createApp } from 'vue';
import { DateFormat, GenerateModifiers, i18n } from 'vue-materials/plugins';

const app = createApp(App);

app.use(i18n);
app.use(DateFormat);
app.use(GenerateModifiers);
```

The i18n plugin configures the library's French and English messages. If you use the components that call `useI18n`, install this plugin or provide a compatible Vue I18n instance in your application.

## Directives

Directives are exported individually. Register only the ones you use:

```ts
import { vClickOutside, vFocus } from 'vue-materials/directives';

app.directive('click-outside', vClickOutside);
app.directive('focus', vFocus);
```

## Styles

Import `vue-materials/styles` once in your application entry point. It includes the library component styles, base styles, utility classes and bundled font assets.

The Sass utilities are also available as a Sass module:

```scss
@use 'vue-materials/utilities.scss' as *;
```

This module exposes the variables, functions and mixins from the library's Sass foundations.

## Development

```bash
npm install
npm run type-check
npm run build
```

The build emits JavaScript entry points, declaration files and a single stylesheet under `dist/`.
