
import { getViewer } from '../lib/viewer';
import { ColorSchemeScriptTag, AppProvider } from '@cortexa/ui';
import { AppShellWrapper } from '../components/app/app-shell';
import { dynastyDeckTheme } from '../ui/theme';
import '../ui/global.css';

export const metadata = {
    title: 'Dynasty Deck',
    description: 'A flashcard-based Chinese Dynasty Deck builder and quizzer',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

    const viewer = await getViewer();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScriptTag defaultColorScheme={'auto'} />
            </head>
            <body>
                <canvas
                    id="hex-bg-canvas"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: -1,
                        pointerEvents: 'none',
                    }}
                />
                <AppProvider theme={dynastyDeckTheme}>
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
                </AppProvider>
            </body>
        </html>
    );
}
