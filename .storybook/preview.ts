import { setup } from '@storybook/vue3-vite';
import type { Preview } from '@storybook/vue3-vite';

import DateFormat from '../src/plugins/DateFormat';
import GenerateModifiers from '../src/plugins/GenerateModifiers';
import i18n from '../src/plugins/i18n';
import '../src/styles';

setup((app) => {
  app.use(GenerateModifiers);
  app.use(DateFormat);
  app.use(i18n);
});

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    docs: {
      toc: true,
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default preview;
