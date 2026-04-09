import { notFound } from 'next/navigation';
import { Container, Text } from '@mantine/core';
import { api } from '@cortexa/api-client';
import { getViewer } from '../../../../lib/viewer';
import { DeckForm } from '../../../../components/deck-form';
import { DeckPageProps } from '../../model';

export default async function EditDeckPage({ params }: DeckPageProps) {

    const viewer = await getViewer();
    const { id } = await params;

    if (!viewer) {
        return (
            <Container size="md" py="xl">
                <Text>Please sign in to edit a deck.</Text>
            </Container>
        );
    }

    if (!viewer.canCreate) {
        return (
            <Container size="md" py="xl">
                <Text c="red">
                    You do not have permission to edit decks. Contact an admin
                    to be granted creator access.
                </Text>
            </Container>
        );
    }

    let deck;
    try {
        if (viewer) {
            deck = await api.decks.get(id, viewer.authContext);
        }
    } catch {
        notFound();
    }

    if (!deck) {
        return notFound();
    }

    return (
        <DeckForm
            mode='edit'
            apiToken={viewer.apiToken}
            scenarioRole={viewer.scenarioRole}
            deck={deck}
        />
    );
}