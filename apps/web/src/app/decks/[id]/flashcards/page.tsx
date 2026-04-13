
import { notFound } from 'next/navigation';
import { api } from '@cortexa/api-client';
import { Container, Title, Group } from '@mantine/core';
import { getViewer } from '../../../../lib/viewer';
import { DeckPageProps } from '../../model';
import { Deck } from '@cortexa/types';
import { DeckFlashCards } from '../../../../components/deck-flashcards';
import { DeckBreadcrumbs } from '../../../../components/deck-breadcrumbs';


export default async function DeckPage({ params }: DeckPageProps) {

    const viewer = await getViewer();
    const { id } = await params;

    let deck: Deck | null = null;
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
        <Container size="md" py="xl">
            <DeckBreadcrumbs deck={deck} />
            <Group justify="space-between" align='flex-start' mt="md" mb="lg">
                <Title>{deck.title}</Title>
            </Group>
            <DeckFlashCards cards={deck.cards} />
        </Container>
    );
}
