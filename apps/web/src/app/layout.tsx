import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppHeader } from './app-header';
import { auth } from '../auth';
import { cookies } from 'next/headers';
import { USER_ROLES } from '@cortexa/types';

export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const scenarioCookie = (await cookies()).get('cortexa_role_scenario')?.value;
    const scenarioRole = USER_ROLES.find((role) => role === scenarioCookie);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript defaultColorScheme="auto" />
            </head>
            <body>
                <MantineProvider defaultColorScheme="auto">
                    <AppHeader
                        viewer={
                            session?.user
                                ? {
                                      name: session.user.name,
                                      email: session.user.email,
                                      image: session.user.image,
                                      role: session.user.role,
                                  }
                                : null
                        }
                        scenarioRole={scenarioRole}
                    />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
