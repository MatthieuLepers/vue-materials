import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: '../tsconfig.json',
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    // The repository's Vite config is configured for library output.
    // Storybook needs to keep control of its own build entry points.
    const { mergeConfig } = await import('vite');
    const merged = mergeConfig(config, {
      build: {
        emptyOutDir: false,
        cssCodeSplit: true,
      },
    });
    if (merged.build) {
      delete merged.build.lib;
    }
    return merged;
  },
};

export default config;
