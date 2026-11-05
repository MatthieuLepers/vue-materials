import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed } from 'vue';

import Button from '../src/components/Materials/Button/index.vue';
import type { IProps, Modifiers } from '../src/components/Materials/Button';

const modifierOptions: Modifiers[] = [
  'primary',
  'secondary',
  'success',
  'danger',
  'grey200',
  'grey400',
  'fill',
  'stroke',
  'squared',
  'responsive',
];

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    disabled: { control: 'boolean' },
    icon: {
      control: 'radio',
      options: [false, true, 'icon-check'],
      description:
        'false: no icon; true: use the icon slot; string: use the provided CSS icon class.',
    },
    iconSide: { control: 'inline-radio', options: ['left', 'right'] },
    iconSlot: {
      control: 'text',
      description: 'Content of the icon slot. Only available when icon is true.',
      if: { arg: 'icon', eq: true },
    },
    modifiers: {
      control: { type: 'check' },
      options: modifierOptions,
      description: 'Select the visual modifiers to apply.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderButton = (args: IProps & { iconSlot?: string }) => ({
  components: { Button },
  setup: () => ({
    args,
    normalizedModifiers: computed(() =>
      Object.fromEntries(
        ((args.modifiers as unknown as string[]) ?? []).map((modifier) => [modifier, true]),
      ),
    ),
  }),
  template: `
    <Button
      :type="args.type"
      :disabled="args.disabled"
      :icon="args.icon"
      :icon-side="args.iconSide"
      :modifiers="normalizedModifiers"
    >
      <template v-if="args.icon === true" #icon>{{ args.iconSlot || '✓' }}</template>
      Button
    </Button>
  `,
});

export const Default: Story = {
  render: renderButton,
  args: { icon: false, modifiers: [] as unknown as IProps['modifiers'] },
};

export const Primary: Story = {
  render: renderButton,
  args: { modifiers: ['primary'] as unknown as IProps['modifiers'] },
};

export const Secondary: Story = {
  render: renderButton,
  args: { modifiers: ['secondary'] as unknown as IProps['modifiers'] },
};

export const Success: Story = {
  render: renderButton,
  args: { modifiers: ['success'] as unknown as IProps['modifiers'] },
};

export const Danger: Story = {
  render: renderButton,
  args: { modifiers: ['danger'] as unknown as IProps['modifiers'] },
};

export const Stroke: Story = {
  render: renderButton,
  args: { modifiers: ['secondary', 'stroke'] as unknown as IProps['modifiers'] },
};

export const Squared: Story = {
  render: renderButton,
  args: { modifiers: ['primary', 'squared'] as unknown as IProps['modifiers'] },
};

export const Disabled: Story = {
  render: renderButton,
  args: {
    disabled: true,
    modifiers: ['primary'] as unknown as IProps['modifiers'],
  },
};

export const WithIconSlot: Story = {
  render: renderButton,
  args: {
    icon: true,
    iconSlot: '＋',
    modifiers: ['primary'] as unknown as IProps['modifiers'],
  },
};

export const WithIconClass: Story = {
  render: renderButton,
  args: {
    icon: 'icon-check',
    modifiers: ['primary'] as unknown as IProps['modifiers'],
  },
};
