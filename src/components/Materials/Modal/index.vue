<template>
  <div
    :class="GenerateModifiers('m-modal__backdrop', {
      visible: State.backDropVisible,
      open: state.open,
      topMost: state.open && State.backDropVisible,
    })"
  >
    <div
      ref="modalRef"
      :id="props.name"
      :class="GenerateModifiers('m-modal', {
        ...props.modifiers,
        noFooter: !props.showFooter,
      })"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`${props.name}-title`"
      tabindex="-1"
    >
      <div
        class="m-modal__header"
        :id="`${props.name}-title`"
      >
        <slot name="header" :title="props.title">
          {{ props.title }}
        </slot>
      </div>
      <div class="m-modal__body">
        <slot />
      </div>
      <div
        v-if="props.showFooter"
        class="m-modal__footer"
      >
        <slot
          name="footer"
          :accept="actions.handleAccept"
          :refuse="actions.handleRefuse"
          :close="actions.handleClose"
        >
          <MaterialButton
            v-if="!props.acceptOnly"
            type="button"
            :class="GenerateModifiers('m-modal__btn', { refuse: true })"
            :modifiers="{ danger: true }"
            @click="actions.handleRefuse"
          >
            {{ props.refuseLabel }}
          </MaterialButton>
          <MaterialButton
            v-if="!props.refuseOnly"
            type="button"
            :class="GenerateModifiers('m-modal__btn', { accept: true })"
            :modifiers="{ secondary: true }"
            @click="actions.handleAccept"
          >
            {{ props.acceptLabel }}
          </MaterialButton>
        </slot>
      </div>
      <slot
        v-if="props.showClose"
        :close="actions.handleClose"
        name="close"
      >
        <button
          type="button"
          :class="GenerateModifiers('m-modal__btn', { close: true })"
          @click="actions.handleClose"
        >
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import MaterialButton from '@/components/Materials/Button/index.vue';

import { modalStore } from '@/components/Materials/Modal/Store';
import { useClickOutside } from '@/composables/useClickOutside';
import { useFocusTrap } from '@/composables/useFocusTrap';
import { useRestoreFocus } from '@/composables/useRestoreFocus';

import type { IProps, ISlots, IState } from '.';

defineOptions({ name: 'Modal' });

defineSlots<ISlots>();

const emit = defineEmits<{
  open: [];
  close: [];
  accept: [];
  refuse: [];
}>();

const modalRef = ref<HTMLDivElement | null>(null);

const props = withDefaults(defineProps<IProps>(), {
  showClose: true,
  showFooter: true,
  acceptOnly: false,
  refuseOnly: false,
  acceptLabel: 'Ok',
  refuseLabel: 'Cancel',
  modifiers: () => ({}),
  autofocus: true,
});

const state = reactive<IState>({
  open: false,
});

const State = computed(() => ({
  backDropVisible: modalStore.actions.isLastOpen(props.name),
}));

const actions = {
  handleClose() {
    if (!state.open) return;

    modalStore.actions.hide(props.name);
    emit('close');
  },
  handleAccept() {
    emit('accept');
    actions.handleClose();
  },
  handleRefuse() {
    emit('refuse');
    actions.handleClose();
  },
};

watch(() => state.open, (open) => {
  if (open) emit('open');
});

const modalObj = { name: props.name, state };

onMounted(() => {
  modalStore.actions.register(modalObj);

  useClickOutside(modalRef, {
    handler: actions.handleClose,
    ignore: [modalRef],
    disabled: computed(() => !state.open),
    detectEscape: true,
  });

  useFocusTrap(modalRef, computed(() => state.open));

  // useInertOthers(root, computed(() => state.open));

  useRestoreFocus(computed(() => state.open));
});

onUnmounted(() => {
  modalStore.actions.unregister(modalObj);
});
</script>

<style lang="scss" src="./index.scss">
</style>
