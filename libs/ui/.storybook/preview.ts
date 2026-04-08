import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import type { Preview } from '@storybook/react';

const preview: Preview = {
    globalTypes: {
        colorScheme: {
            description: 'Mantine color scheme',
            toolbar: {
                title: 'Color Scheme',
                icon: 'mirror',
                items: ['light', 'dark'],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: {
        colorScheme: 'dark',
    },
    decorators: [
        (Story, context) => {
            const colorScheme = context.globals.colorScheme || 'dark';
            const bg = colorScheme === 'dark' ? '#1a1b1e' : '#ffffff';
            return React.createElement(
                MantineProvider,
                { forceColorScheme: colorScheme },
                React.createElement(
                    ModalsProvider,
                    null,
                    React.createElement(
                        'div',
                        {
                            style: {
                                padding: 20,
                                background: bg,
                                minHeight: '100vh',
                            },
                        },
                        React.createElement(Story)
                    )
                )
            );
        },
    ],
};

export default preview;