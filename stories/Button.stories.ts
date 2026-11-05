import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Button from '../src/components/Materials/Button/index.vue';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    iconSide: { control: 'inline-radio', options: ['left', 'right'] },
    disabled: { control: 'boolean' },
    modifiers: { control: 'object', description: 'Visual modifiers applied to the button.' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Button</Button>',
  }),
};

export const Primary: Story = { ...Default, args: { modifiers: { primary: true } } };
export const Secondary: Story = { ...Default, args: { modifiers: { secondary: true } } };
export const Success: Story = { ...Default, args: { modifiers: { success: true } } };
export const Danger: Story = { ...Default, args: { modifiers: { danger: true } } };
export const Stroke: Story = { ...Default, args: { modifiers: { secondary: true, stroke: true } } };
export const Squared: Story = { ...Default, args: { modifiers: { primary: true, squared: true } } };
export const Disabled: Story = { ...Default, args: { disabled: true, modifiers: { primary: true } } };

export const WithIconSlot: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args" icon><template #icon>＋</template>Add item</Button>',
  }),
  args: { modifiers: { primary: true } },
};
