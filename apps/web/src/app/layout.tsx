
import Script from 'next/script';
import { AppShellWrapper } from '@cortexa/ui';
import { getViewer } from '../lib/viewer';
import { COLORS, ColorSchemeScriptTag, AppProvider } from '@cortexa/ui';
// import './global.css';




export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const viewer = await getViewer();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script id="set-hex-bg-color" strategy="beforeInteractive">
                    {`
                        // Inject background color into global variable for hex-bg.js
                        window.__HEX_BG_COLOR__ = '${COLORS.background}';
                    `}
                </Script>
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
                <AppProvider>
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
                <Script
                    src="https://unpkg.com/three@0.153.0/build/three.min.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="/hex-bg.js"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
