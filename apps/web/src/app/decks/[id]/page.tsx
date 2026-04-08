import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@cortexa/api-client';
import { Container, Title, Text, Group, Badge, Alert, ActionIcon } from '@mantine/core';
import { IconEdit } from "@tabler/icons-react";
import { getViewer } from '../../../lib/viewer';
import { DeckPageProps } from '../model';
import { Deck } from '@cortexa/types';
import DeckCards from './deck-cards';


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
            <Link href="/decks" style={{ textDecoration: 'none' }}>
                &larr; Back to decks
            </Link>

            <Group justify="space-between" align='top' mt="md" mb="lg">
                <div>
                    <Title>{deck.title}</Title>
                    {deck.description && (
                        <Text c="dimmed" mt={4}>
                            {deck.description}
                        </Text>
                    )}
                    <Badge size="md" variant="light" mt="md">
                        {deck.cards.length} cards
                    </Badge>
                </div>
                {viewer && viewer.canCreate && (
                    <ActionIcon variant="subtle" size="xl" component="a" href={`/decks/${deck.id}/edit`} title="Edit Deck">
                        <IconEdit size={24} />
                    </ActionIcon>
                )}
            </Group>

            {viewer?.scenarioRole === 'reader' ? (
                <Alert color="blue" variant="light" mb="lg">
                    Reader scenario active: card/deck create, edit, and delete
                    endpoints are blocked.
                </Alert>
            ) : null}

            <DeckCards cards={deck.cards} />
        </Container>
    );
}
