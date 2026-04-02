import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppShellWrapper } from './app-shell';
import { getViewer } from '../lib/viewer';

export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const viewer = await getViewer();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <MantineProvider defaultColorScheme="auto">
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
