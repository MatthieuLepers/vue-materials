import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      '~styles': fromRoot('./src/assets/styles'),
      '~fonts': fromRoot('./src/assets/fonts'),
    },
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: fromRoot('./src/index.ts'),
        components: fromRoot('./src/components/index.ts'),
        core: fromRoot('./src/core/index.ts'),
        utils: fromRoot('./src/utils/index.ts'),
        composables: fromRoot('./src/composables/index.ts'),
        directives: fromRoot('./src/directives/index.ts'),
        plugins: fromRoot('./src/plugins/index.ts'),
        i18n: fromRoot('./src/i18n/index.ts'),
        styles: fromRoot('./src/styles/index.ts'),
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: [
        'vue',
        '@vuelidate/core',
        '@vuelidate/validators',
        'axios',
        'vue-draggable-next',
        'vue-i18n',
      ],
    },
  },
});
