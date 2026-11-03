import type { BaseValidation } from '@vuelidate/core';
import { computed, type Ref, ref } from 'vue';

// Not working when using with defineProps<T>() caused by @vue/compiler-sfc
// export type BaseFieldProps<TBaseProps, TValue> = TBaseProps & {
//   modelValue?: TValue;
//   validator?: BaseValidation;
// }

export type BaseFieldProps<TValue> = {
  modelValue?: TValue;
  validator?: BaseValidation;
}

export type FieldMessageList = Array<string>;

type Params<T> = {
  modelValue?: Ref<T | undefined>;
  validator?: BaseValidation;
  emit?: (value: T) => void;
};

export type UseFieldReturn<T = unknown> = {
  model: Ref<T>;
  field: {
    invalid: Ref<boolean | undefined>;
    dirty: Ref<boolean>;
    messages: Ref<FieldMessageList>;
  };
};

export function useField<T = unknown>(params: Params<T>): UseFieldReturn<T> {
  const internal = ref<T>();

  const model = computed<T>({
    get(): T {
      if (params.validator) return params.validator.$model as T;
      if (params.modelValue) return params.modelValue.value as T;
      return internal.value as T;
    },
    set(value: T) {
      if (params.validator) {
        params.validator.$model = value;
        return;
      }

      if (params.emit) {
        params.emit(value);
        return;
      }

      internal.value = value;
    },
  });

  const dirty = computed(() => params.validator?.$dirty ?? false);

  const invalid = computed<boolean | undefined>(() => {
    const v = params.validator?.$invalid;
    if (v === undefined) return undefined;
    return v;
  });

  const messages = computed<string[]>(() => {
    if (!params.validator || !dirty.value) return [];
    return params.validator.$errors.map((e) => e.$message as string);
  });

  return {
    model,
    field: {
      invalid,
      dirty,
      messages,
    },
  };
}
