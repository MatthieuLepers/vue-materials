import type { Preview } from '@storybook/vue3-vite';

import '../src/styles';

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
