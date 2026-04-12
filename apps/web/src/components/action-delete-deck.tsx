'use client';

import { useRouter } from 'next/navigation'
import { ActionIcon, MantineSize, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { UserRole } from '@cortexa/types';
import { api } from '@cortexa/api-client';


export interface ActionDeleteDeckProps {
    id: string;
    apiToken: string;
    scenarioRole: string;
    size?: MantineSize;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function ActionDeleteDeck({ id, apiToken, scenarioRole, size = 'lg', onConfirm, onCancel }: ActionDeleteDeckProps) {

    const router = useRouter();

    const removeDeck = async () => {
        try {
            await api.decks.remove(id, { token: apiToken, scenarioRole: scenarioRole as UserRole }).then(() => {
                notifications.show({
                    title: 'Deck deleted',
                    message: 'The deck has been successfully deleted.',
                    withCloseButton: true
                });
                onConfirm?.();
                router.push('/decks');
                router.refresh();
            }).catch((err) => {
                throw err;
            });
        } catch (err: unknown) {
            console.error('Failed to delete deck:', err);

            notifications.show({
                title: 'Failed to delete deck',
                message: 'An error occurred while trying to delete the deck. Please try again.',
                color: 'red',
                withCloseButton: true
            });
            onCancel?.();
            router.refresh();
        }
    };

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete this deck',
            centered: true,
            children: (
                <Text size="sm">
					Are you sure you want to delete this deck? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red', variant: 'outline' },
            onCancel,
            onConfirm: removeDeck,
        });

    return (
        <ActionIcon size={size} color="red" variant="outline" onClick={openDeleteModal} title="Delete deck">
            <IconTrash size={16} />
        </ActionIcon>
    );
}
