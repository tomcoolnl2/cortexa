import type { Meta, StoryObj } from '@storybook/react';
import { FlashCard } from './';

const meta: Meta<typeof FlashCard> = {
    component: FlashCard,
    title: 'FlashCard',
    argTypes: {
        term: {
            control: 'text',
            description: 'The front side of the card (question/term)',
        },
        definition: {
            control: 'text',
            description: 'The back side of the card (answer/definition)',
        },
        initialFlipped: {
            control: 'boolean',
            description: 'Start with the card flipped to show the definition',
        },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 400 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof FlashCard>;

export const Default: Story = {
    args: {
        term: 'Closure',
        definition:
            'A function that has access to variables in its outer scope, even after the outer function has returned.',
    },
};

export const ShortContent: Story = {
    args: {
        term: 'HTML',
        definition: 'HyperText Markup Language',
    },
};

export const LongContent: Story = {
    args: {
        term: 'Event Loop',
        definition:
            'The event loop is the mechanism that handles asynchronous callbacks in JavaScript. It continuously monitors the call stack and the callback queue. When the call stack is empty, it takes the first event from the queue and pushes it to the call stack, which effectively runs it. This is how JavaScript achieves concurrency despite being single-threaded.',
    },
};
