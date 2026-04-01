'use client';

import {
    Group,
    Title,
    ActionIcon,
    Text,
    Badge,
    Select,
    Button,
    Avatar,
    Stack,
    useMantineColorScheme,
    useComputedColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { UserRole } from '@cortexa/types';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface HeaderViewer {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
}

interface AppHeaderProps {
    viewer: HeaderViewer | null;
    scenarioRole?: UserRole;
}

export function AppHeader({ viewer, scenarioRole }: AppHeaderProps) {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');
    const router = useRouter();
    const [savingScenario, setSavingScenario] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const toggleColorScheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    };

    const roleInEffect = scenarioRole ?? viewer?.role;

    const onScenarioChange = async (value: string | null) => {
        if (!viewer || viewer.role !== 'admin') {
            return;
        }

        setSavingScenario(true);
        try {
            await fetch('/api/auth/scenario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenarioRole: value ?? undefined,
                }),
            });
            router.refresh();
        } finally {
            setSavingScenario(false);
        }
    };

    return (
        <Group
            justify="space-between"
            px="md"
            py="sm"
            style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
        >
            <Title order={3}>Cortexa</Title>

            <Group gap="sm">
                {viewer ? (
                    <>
                        <Stack gap={2} align="flex-end">
                            <Group gap={6}>
                                <Text size="sm" fw={500}>
                                    {viewer.name ?? viewer.email}
                                </Text>
                                <Badge variant="light" tt="capitalize">
                                    {roleInEffect}
                                </Badge>
                            </Group>
                            {viewer.role === 'admin' ? (
                                <Select
                                    size="xs"
                                    w={180}
                                    disabled={savingScenario}
                                    aria-label="User scenario"
                                    value={roleInEffect ?? 'admin'}
                                    onChange={onScenarioChange}
                                    data={[
                                        { value: 'admin', label: 'Scenario: Admin' },
                                        { value: 'creator', label: 'Scenario: Creator' },
                                        { value: 'reader', label: 'Scenario: Reader' },
                                    ]}
                                />
                            ) : null}
                        </Stack>

                        <Avatar
                            src={viewer.image ?? undefined}
                            radius="xl"
                            size="sm"
                        >
                            {(viewer.name ?? viewer.email ?? 'U')[0]}
                        </Avatar>
                        <Button
                            variant="light"
                            size="xs"
                            component="a"
                            href="/api/auth/signout?callbackUrl=/"
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <Button component="a" href="/api/auth/signin" size="xs">
                        Sign in with Google
                    </Button>
                )}

                <ActionIcon
                    variant="default"
                    size="lg"
                    onClick={toggleColorScheme}
                    aria-label="Toggle color scheme"
                >
                    {mounted ? (
                        computedColorScheme === 'dark' ? (
                            <IconSun size={18} />
                        ) : (
                            <IconMoon size={18} />
                        )
                    ) : (
                        <IconSun size={18} />
                    )}
                </ActionIcon>
            </Group>
        </Group>
    );
}
