'use client';

import {
    Group,
    Title,
    ActionIcon,
    useMantineColorScheme,
    useComputedColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function AppHeader() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');

    const toggleColorScheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Group
            justify="space-between"
            px="md"
            py="sm"
            style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
        >
            <Title order={3}>Cortexa</Title>
            <ActionIcon
                variant="default"
                size="lg"
                onClick={toggleColorScheme}
                aria-label="Toggle color scheme"
            >
                {computedColorScheme === 'dark' ? (
                    <IconSun size={18} />
                ) : (
                    <IconMoon size={18} />
                )}
            </ActionIcon>
        </Group>
    );
}
