import crypto from "node:crypto";
import React from 'react';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { themeColors, themeDarkColors } from './colors';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import './styles.css';


const defaultTheme = createTheme({
    colors: {
        theme: themeColors,
        dark: themeDarkColors,
    },
    primaryColor: 'theme',
    defaultRadius: 'xs',
});

interface AppProviderProps {
    theme?: ReturnType<typeof createTheme>;
    children: React.ReactNode;
}

export function AppProvider({ theme = defaultTheme, children }: AppProviderProps) {
    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <ModalsProvider>
                {children}
            </ModalsProvider>
            <Notifications />
        </MantineProvider>
    );
}

export const ColorSchemeScriptTag = ({ defaultColorScheme }: { defaultColorScheme: 'light' | 'dark' | 'auto' }) => {
    
    const scriptContent = `
        (function() {
            function getPreferredColorScheme() {
                if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    return 'light';
                }
                return 'dark';
            }
            var colorScheme = '${defaultColorScheme}' === 'auto' ? getPreferredColorScheme() : '${defaultColorScheme}';
            document.documentElement.setAttribute('data-color-scheme', colorScheme);
        })();
    `;
    
    const nonce = crypto.randomBytes(16).toString('base64');

    return (
        <ColorSchemeScript nonce={nonce} dangerouslySetInnerHTML={{ __html: scriptContent }} />
    );
};