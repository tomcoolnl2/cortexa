import Script from 'next/script';
import { ColorSchemeScript, MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AppShellWrapper } from '../components/app-shell';
import { getViewer } from '../lib/viewer';

import '@mantine/core/styles.css';
// import './global.css';


const themeColors: MantineColorsTuple = [
    '#fdfcf0',
    '#f6f2d6',
    '#ebe4b3',
    '#dfd58f',
    '#d4c871',
    '#cabd5c',
    '#b2a64f',
    '#948a41',
    '#766f34',
    '#5c5728',
];

export const COLORS = {
    // Mantine dark background (index 7)
    background: '#1A1B1E',
    // Add more shared colors as needed
};


export const metadata = {
    title: 'Cortexa',
    description: 'A flashcard-based learning platform',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const viewer = await getViewer();

    const theme = createTheme({
        colors: {
            theme: themeColors,
            // Mantine dark palette override with comments for each index
            dark: [
                '#C1C2C5', // 0: Text color (brightest)
                '#A6A7AB', // 1: Secondary text
                '#909296', // 2: Disabled text, icons
                '#5c5f66', // 3: Borders, subtle separators
                '#373A40', // 4: Card backgrounds, hover
                '#2C2E33', // 5: Input backgrounds, UI elements
                '#232429', // 6: Sidebar, navbar backgrounds
                COLORS.background, // 7: Main background (single source of truth)
                '#141517', // 8: Deepest background, modals
                '#101113', // 9: Popovers, tooltips, overlays
            ],
        },
        primaryColor: 'theme',
        defaultRadius: 'xs',
    });

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script id="set-hex-bg-color" strategy="beforeInteractive">
                    {`
                        // Inject background color into global variable for hex-bg.js
                        window.__HEX_BG_COLOR__ = '${COLORS.background}';
                    `}
                </Script>
                <ColorSchemeScript defaultColorScheme="auto" />
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
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <ModalsProvider>
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
                    </ModalsProvider>
                </MantineProvider>
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
