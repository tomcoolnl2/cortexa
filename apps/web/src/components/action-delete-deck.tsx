'use client';

import { useRouter } from 'next/navigation'
import { ActionIcon, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { UserRole } from '@cortexa/types';
import { api } from '@cortexa/api-client';


export interface ActionDeleteDeckProps {
    id: string;
    apiToken: string;
    scenarioRole: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function ActionDeleteDeck({ id, apiToken, scenarioRole, onConfirm, onCancel }: ActionDeleteDeckProps) {

    const router = useRouter();

    const removeDeck = async () => {
        try {
            await api.decks.remove(id, { token: apiToken, scenarioRole: scenarioRole as UserRole });
            onConfirm?.();
            router.push('/decks');
            router.refresh();
        } catch (err: unknown) {
            // error notifocation can be added here
            console.error('Failed to delete deck:', err);
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
        <ActionIcon color="red" variant="outline" onClick={openDeleteModal} aria-label="Delete deck">
            <IconTrash size={16} />
        </ActionIcon>
    );
}
