import type { Ref } from 'vue';

export type ClickOutsideHandler = (event: PointerEvent | KeyboardEvent) => void;

export type ClickOutsideIgnore =
  HTMLElement
  | null
  | undefined
  | Ref<HTMLElement | null>
  | (() => Array<HTMLElement | null | undefined>);

export type ClickOutsideConfig = {
  handler: ClickOutsideHandler;
  ignore?: Array<ClickOutsideIgnore>;
  disabled?: Ref<boolean>;
  detectEscape?: boolean;
};

export type Entry = {
  el: HTMLElement;
  config: ClickOutsideConfig;
};

const registry = new Map<HTMLElement, Entry>();

let isListening = false;

const resolveElements = (item: ClickOutsideIgnore): HTMLElement[] => {
  if (!item) return [];

  if (typeof item === 'function') {
    return item().filter((element): element is HTMLElement => !!element);
  }

  if ('value' in item) {
    return item.value ? [item.value] : [];
  }

  return [item];
};

const onPointerDown = (event: PointerEvent) => {
  const path = event.composedPath();

  Array.from(registry.values())
    .reverse()
    .forEach(({ el: rootElement, config }) => {
      if (config.disabled?.value) return;

      const isInside = path.includes(rootElement);
      const isIgnored = config.ignore?.some((item) => resolveElements(item).some((ignoredElement) => path.includes(ignoredElement)));

      if (!isInside && !isIgnored) {
        config.handler(event);
      }
    })
  ;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;

  for (const entry of Array.from(registry.values()).reverse()) {
    if (entry.config.disabled?.value || !entry.config.detectEscape) continue;

    entry.config.handler(event);
    break;
  }
};

function ensureListeners() {
  if (!isListening) {
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    isListening = true;
  }
}

function cleanupListeners() {
  if (isListening && registry.size === 0) {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKeyDown);
    isListening = false;
  }
}

export function addEntry(entry: Entry) {
  registry.set(entry.el, entry);
  ensureListeners();
}

export function removeEntry(el: HTMLElement) {
  registry.delete(el);
  cleanupListeners();
}

export function updateEntry(el: HTMLElement, config: ClickOutsideConfig) {
  const entry = registry.get(el);
  if (entry) {
    entry.config = config;
  }
}
