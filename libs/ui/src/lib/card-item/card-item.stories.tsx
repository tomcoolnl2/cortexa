import type { Meta, StoryObj } from '@storybook/react';
import { MantineProvider } from '@mantine/core';
import { CardItem } from './card-item';

const meta: Meta<typeof CardItem> = {
  component: CardItem,
  title: 'CardItem',
  decorators: [
    (Story) => (
      <MantineProvider>
        <div style={{ maxWidth: 400, padding: 20 }}>
          <Story />
        </div>
      </MantineProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CardItem>;

export const Default: Story = {
  args: {
    term: 'Closure',
    definition:
      'A function that has access to variables in its outer scope, even after the outer function has returned.',
  },
};

export const WithActions: Story = {
  args: {
    term: 'Hoisting',
    definition:
      "JavaScript's behavior of moving declarations to the top of the current scope.",
    onEdit: () => console.log('edit'),
    onDelete: () => console.log('delete'),
  },
};

export const LongContent: Story = {
  args: {
    term: 'The Event Loop and Asynchronous Programming Model',
    definition:
      'The event loop is the mechanism that handles asynchronous callbacks in JavaScript by continuously monitoring the call stack and callback queue. When the call stack is empty, it dequeues the next callback and pushes it onto the stack for execution.',
  },
};
