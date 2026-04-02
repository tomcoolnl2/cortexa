'use client';

import {
    AppShell,
    Group,
    NavLink,
} from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppHeader, type HeaderViewer } from './app-header';
import { UserRole } from '@cortexa/types';
import { useState } from 'react';
import { Burger } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface AppShellWrapperProps {
    viewer: HeaderViewer | null;
    scenarioRole?: UserRole;
    children: React.ReactNode;
}

export function AppShellWrapper({ viewer, scenarioRole, children }: AppShellWrapperProps) {
    const pathname = usePathname();
    const [navbarOpened, setNavbarOpened] = useState(false);
    const isMobile = useMediaQuery('(max-width: 48em)'); // Mantine sm = 48em

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !navbarOpened } }}
            padding="md"
        >
            <AppShell.Header px="md" py="sm">
                <Group h="100%" justify="center" align="center" wrap="nowrap" style={{ width: '100%' }}>
                    <AppHeader viewer={viewer} scenarioRole={scenarioRole} />
                    <div style={{ marginLeft: 'auto', display: isMobile ? 'block' : 'none' }}>
                        <Burger
                            opened={navbarOpened}
                            onClick={() => setNavbarOpened((o) => !o)}
                            size="sm"
                            aria-label="Open navigation"
                        />
                    </div>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="xs" withBorder={false}>
                <NavLink
                    component={Link}
                    href="/decks/public"
                    label="All Decks"
                    leftSection={<IconWorld size={18} />}
                    active={pathname === '/decks/public'}
                    onClick={() => setNavbarOpened(false)}
                />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
