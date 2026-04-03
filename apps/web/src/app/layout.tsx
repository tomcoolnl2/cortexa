import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { AppShellWrapper } from './app-shell';
import { getViewer } from '../lib/viewer';


const themeColors: MantineColorsTuple = [
    '#fdfce4',
    '#f8f6d3',
    '#f0ecaa',
    '#e7e17c',
    '#e0d856',
    '#dbd33e',
    '#d9d02f',
    '#c0b820',
    '#aaa317',
    '#928d03',
];

export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const viewer = await getViewer();

    const theme = createTheme({
        colors: {
            myColor: themeColors,
        },
        primaryColor: 'myColor',
        defaultRadius: 'xs',
    });

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <AppShellWrapper
                        viewer={
                            viewer
                                ? {
                                    name: viewer.name,
                                    email: viewer.email,
                                    image: viewer.image,
                                    role: viewer.role,
                                }
                                : null
                        }
                        scenarioRole={viewer?.scenarioRole}
                    >
                        {children}
                    </AppShellWrapper>
                </MantineProvider>
            </body>
        </html>
    );
}
