import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MaterialButton from '@/components/Materials/Button/index.vue';

import type { IProps, Modifiers } from '@/components/Materials/Button';

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
  title: 'Components/Material/Button',
  component: MaterialButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'], table: { category: 'Props' } },
    disabled: { control: 'boolean', table: { category: 'Props' } },
    icon: {
      control: 'radio',
      options: [false, true, 'icon-check'],
      description: 'false: no icon; true: use the icon slot; string: use the provided CSS icon class.',
      table: { category: 'Props' },
    },
    iconSide: {
      control: 'inline-radio',
      options: ['left', 'right'],
      table: { category: 'Props' },
    },
    modifiers: {
      control: false,
      description: 'Visual modifiers applied to the component.',
      table: { category: 'Props' },
    },
  },
  parameters: {
    vueMaterials: {
      controls: {
        modifiers: {
          type: 'checkbox-group',
          label: 'Modifiers',
          options: modifierOptions,
        },
      },
      categories: {
        props: {
          icon: 'false disables the icon; true renders the icon slot; a string is used as a CSS icon class.',
          iconSide: 'Position of the icon.',
          modifiers: 'Partial<Record<Modifiers, boolean>> applied to the button.',
        },
        slots: {
          default: 'Content displayed inside the button.',
          icon: 'Custom content displayed in the icon container when the icon prop is true.',
        },
      },
    },
  },
} satisfies Meta<typeof MaterialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderButton = (args: IProps) => ({
  components: { MaterialButton },
  setup: () => ({ args }),
  template: `
    <MaterialButton
      :type="args.type"
      :disabled="args.disabled"
      :icon="args.icon"
      :icon-side="args.iconSide"
      :modifiers="args.modifiers"
    >
      <template v-if="args.icon === true" #icon>✓</template>
      Button
    </MaterialButton>
  `,
});

export const Default: Story = {
  render: renderButton,
  args: { icon: false, modifiers: {} },
};

export const Primary: Story = {
  render: renderButton,
  args: { modifiers: { primary: true } },
};

export const Secondary: Story = {
  render: renderButton,
  args: { modifiers: { secondary: true } },
};

export const Success: Story = {
  render: renderButton,
  args: { modifiers: { success: true } },
};

export const Danger: Story = {
  render: renderButton,
  args: { modifiers: { danger: true } },
};

export const Stroke: Story = {
  render: renderButton,
  args: { modifiers: { secondary: true, stroke: true } },
};

export const Squared: Story = {
  render: renderButton,
  args: { modifiers: { primary: true, squared: true } },
};

export const Disabled: Story = {
  render: renderButton,
  args: {
    disabled: true,
    modifiers: { primary: true },
  },
};

export const WithIconSlot: Story = {
  render: renderButton,
  args: {
    icon: true,
    modifiers: { primary: true },
  },
};

export const WithIconClass: Story = {
  render: renderButton,
  args: {
    icon: 'icon-check',
    modifiers: { primary: true },
  },
};
