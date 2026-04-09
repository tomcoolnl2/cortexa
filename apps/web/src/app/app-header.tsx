'use client';

import { signIn, signOut, } from 'next-auth/react';
import {
    Group,
    Title,
    ActionIcon,
    Text,
    Badge,
    Select,
    Button,
    Avatar,
    useMantineColorScheme,
    useComputedColorScheme,
    Menu,
} from '@mantine/core';
import { IconBrain, IconSun, IconMoon, IconUser } from '@tabler/icons-react';
import { UserRole } from '@cortexa/types';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface HeaderViewer {
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
            w="100%"
        >
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Title order={3} m={0}>
                    <IconBrain size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Cortexa
                </Title>
            </Link>

            <Group gap="sm">
                {viewer ? (
                    <>
                        {viewer.role === 'admin' ? (
                            <Select
                                size="xs"
                                w={120}
                                disabled={savingScenario}
                                aria-label="Role"
                                value={roleInEffect ?? 'admin'}
                                onChange={onScenarioChange}
                                data={[
                                    { value: 'admin', label: 'Admin' },
                                    { value: 'creator', label: 'Creator' },
                                    { value: 'reader', label: 'Reader' },
                                ]}
                            />
                        ) : null}

                        <Menu withArrow position="bottom-end" offset={8}>
                            <Menu.Target>
                                <Avatar
                                    src={viewer.image ?? undefined}
                                    radius="xl"
                                    size="sm"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {(viewer.name ?? viewer.email ?? 'U')[0]}
                                </Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                <Group gap={6} px="sm" py={2}>
                                    <Text size="sm" fw={500}>
                                        {viewer.name ?? viewer.email}
                                    </Text>
                                    <Badge variant="light" tt="capitalize">
                                        {roleInEffect}
                                    </Badge>
                                </Group>
                                <Menu.Divider />
                                <Menu.Item
                                    onClick={async () => {
                                        await signOut({ redirect: false });
                                        router.push('/');
                                        router.refresh();
                                    }}
                                >
                                    Sign out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </>
                ) : (
                    <Button
                        size="xs"
                        leftSection={<IconUser size={16} />}
                        onClick={async () => {
                            const res = await signIn('google', { redirect: false, callbackUrl: '/' });
                            if (res?.url) {
                                router.push(res.url);
                            }
                        }}
                    >
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
