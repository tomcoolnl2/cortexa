import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppHeader } from './app-header';

export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <MantineProvider defaultColorScheme="auto">
                    <AppHeader />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
