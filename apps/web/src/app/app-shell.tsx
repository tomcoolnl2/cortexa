'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AppShell, Group, NavLink } from '@mantine/core';
import { IconBrain, IconCards } from '@tabler/icons-react';
import { UserRole } from '@cortexa/types';
import { Burger } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { AppHeader, type HeaderViewer } from './app-header';

interface AppShellWrapperProps {
    viewer: HeaderViewer | null;
    scenarioRole?: UserRole;
    children: React.ReactNode;
}

export function AppShellWrapper({ viewer, scenarioRole, children }: AppShellWrapperProps) {
    const pathname = usePathname();
    const [navbarOpened, setNavbarOpened] = useState(false);
    const isMobile = useMediaQuery('(max-width: 48em)');

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

            <AppShell.Navbar p="xs" withBorder>
                <NavLink
                    component={Link}
                    href="/decks"
                    label="All Decks"
                    leftSection={<IconBrain size={18} />}
                    active={pathname === '/decks'}
                    onClick={() => setNavbarOpened(false)}
                />
                <NavLink
                    component={Link}
                    href="/decks/new"
                    label="New Deck"
                    leftSection={<IconCards size={18} />}
                    active={pathname === '/decks/new'}
                    onClick={() => setNavbarOpened(false)}
                />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
