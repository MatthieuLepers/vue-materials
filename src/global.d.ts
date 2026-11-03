declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    GenerateModifiers: (baseClass: string, modifiers: Record<string, boolean>) => string;
    dateFormat: (date: Date, format: string) => string;
  }
}

export {};
