import type { Meta, StoryObj } from '@storybook/react';
import {
    IconSun,
    IconMoon,
    IconCards,
    IconBook,
    IconUser,
    IconSearch,
    IconPlus,
    IconTrash,
    IconEdit,
    IconCheck,
    IconX,
    IconArrowLeft,
    IconArrowRight,
    IconHome,
    IconSettings,
    IconLogout,
    IconBrain,
    IconSchool,
    IconBulb,
    IconTrophy,
    IconFlame,
    IconChartBar,
    IconClock,
    IconRefresh,
    IconDownload,
    IconUpload,
} from '@tabler/icons-react';
import { SimpleGrid, Stack, Text, ActionIcon, Tooltip } from '@mantine/core';

/**
 * Showcase of Tabler icons used throughout Cortexa.
 *
 * Full icon reference: https://tabler.io/icons
 *
 * Install: `npm install @tabler/icons-react`
 */

const icons = [
    { Icon: IconSun, name: 'IconSun', usage: 'Light mode toggle' },
    { Icon: IconMoon, name: 'IconMoon', usage: 'Dark mode toggle' },
    { Icon: IconCards, name: 'IconCards', usage: 'Decks / flashcards' },
    { Icon: IconBook, name: 'IconBook', usage: 'Study / learning' },
    { Icon: IconUser, name: 'IconUser', usage: 'User profile' },
    { Icon: IconSearch, name: 'IconSearch', usage: 'Search' },
    { Icon: IconPlus, name: 'IconPlus', usage: 'Create / add' },
    { Icon: IconTrash, name: 'IconTrash', usage: 'Delete' },
    { Icon: IconEdit, name: 'IconEdit', usage: 'Edit' },
    { Icon: IconCheck, name: 'IconCheck', usage: 'Success / correct' },
    { Icon: IconX, name: 'IconX', usage: 'Close / incorrect' },
    { Icon: IconArrowLeft, name: 'IconArrowLeft', usage: 'Navigate back' },
    { Icon: IconArrowRight, name: 'IconArrowRight', usage: 'Navigate forward' },
    { Icon: IconHome, name: 'IconHome', usage: 'Home' },
    { Icon: IconSettings, name: 'IconSettings', usage: 'Settings' },
    { Icon: IconLogout, name: 'IconLogout', usage: 'Sign out' },
    { Icon: IconBrain, name: 'IconBrain', usage: 'Quiz / knowledge' },
    { Icon: IconSchool, name: 'IconSchool', usage: 'Learning' },
    { Icon: IconBulb, name: 'IconBulb', usage: 'Hint / tip' },
    { Icon: IconTrophy, name: 'IconTrophy', usage: 'Achievement' },
    { Icon: IconFlame, name: 'IconFlame', usage: 'Streak' },
    { Icon: IconChartBar, name: 'IconChartBar', usage: 'Stats / progress' },
    { Icon: IconClock, name: 'IconClock', usage: 'Timer / history' },
    { Icon: IconRefresh, name: 'IconRefresh', usage: 'Retry / reload' },
    { Icon: IconDownload, name: 'IconDownload', usage: 'Export' },
    { Icon: IconUpload, name: 'IconUpload', usage: 'Import' },
];

function IconGallery() {
    return (
        <Stack>
            <Text size="sm" c="dimmed">
                Full reference:{' '}
                <a
                    href="https://tabler.io/icons"
                    target="_blank"
                    rel="noreferrer"
                >
                    tabler.io/icons
                </a>
            </Text>
            <SimpleGrid cols={4} spacing="lg">
                {icons.map(({ Icon, name, usage }) => (
                    <Tooltip key={name} label={usage}>
                        <Stack align="center" gap={4}>
                            <ActionIcon variant="default" size="xl">
                                <Icon size={22} />
                            </ActionIcon>
                            <Text size="xs" c="dimmed">
                                {name}
                            </Text>
                        </Stack>
                    </Tooltip>
                ))}
            </SimpleGrid>
        </Stack>
    );
}

const meta: Meta = {
    title: 'Icons',
};

export default meta;

type Story = StoryObj;

export const Gallery: Story = {
    render: () => <IconGallery />,
};
