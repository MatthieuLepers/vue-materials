declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    GenerateModifiers: (baseClass: string, modifiers: Record<string, boolean>) => string;
    dateFormat: (date: Date, format: string) => string;
  }
}

export {};
