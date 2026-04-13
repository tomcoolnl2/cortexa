import type { Meta, StoryObj } from '@storybook/react';
import { CardItem, CardListItem } from './';

const meta: Meta<typeof CardItem> = {
    component: CardItem,
    title: 'CardItem',
};
export default meta;

type CardItemStory = StoryObj<typeof CardItem>;
type CardListItemStory = StoryObj<typeof CardListItem>;

export const Default: CardItemStory = {
    args: {
        term: 'Closure',
        definition:
            'A function that has access to variables in its outer scope, even after the outer function has returned.',
    },
};

export const ListItem: CardListItemStory = {
    args: {
        id: '1',
        deckId: '1',
        term: 'The Event Loop and Asynchronous Programming Model',
        definition: "JavaScript's behavior of moving declarations to the top of the current scope.",
        onDelete: () => console.log('delete'),
    },
};


export const LongContent: CardItemStory = {
    args: {
        term: 'The Event Loop and Asynchronous Programming Model',
        definition:
            'The event loop is the mechanism that handles asynchronous callbacks in JavaScript by continuously monitoring the call stack and callback queue. When the call stack is empty, it dequeues the next callback and pushes it onto the stack for execution.',
    },
};
