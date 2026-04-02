import { api } from '@cortexa/api-client';
import { Deck } from '@cortexa/models';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Card,
    Group,
    Badge,
} from '@mantine/core';
import Link from 'next/link';
import { getViewer } from '../../../lib/viewer';
import { ClientDecks } from './ClientDecks';

export default async function PublicDecksPage() {
    const viewer = await getViewer();
    let publicDecks: Deck[] = [];
    let userDecks: Deck[] = [];
    try {
        publicDecks = await api.decks.listPublic();
        if (viewer) {
            userDecks = await api.decks.list(viewer.authContext);
        }
    } catch {
        publicDecks = [];
        userDecks = [];
    }

    // Only pass private decks to ClientDecks if user is admin or creator
    const canSeePrivate = viewer && (viewer.effectiveRole === 'admin' || viewer.effectiveRole === 'creator');
    const filteredUserDecks = canSeePrivate ? userDecks : userDecks.filter((d) => d.isPublic);

    // Merge and deduplicate decks by id
    const allDecksMap = new Map<string, Deck>();
    for (const deck of publicDecks) {
        allDecksMap.set(deck.id, deck);
    }
    for (const deck of filteredUserDecks) {
        allDecksMap.set(deck.id, deck);
    }
    const allDecks = Array.from(allDecksMap.values());

    // Pass effectiveRole to ClientDecks for client-side role checks
    const effectiveRole = viewer?.effectiveRole ?? null;

    return (
        <Container size="md" py="xl">
            <Title mb="lg">All Decks</Title>
            {/* Only show filter if logged in */}
            {viewer ? (
                <ClientDecks allDecks={allDecks} publicDecks={publicDecks} userDecks={filteredUserDecks} effectiveRole={effectiveRole} />
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    {publicDecks.length === 0 ? (
                        <Text c="dimmed">No public decks available yet.</Text>
                    ) : (
                        publicDecks.map((deck) => (
                            <Link
                                key={deck.id}
                                href={`/decks/${deck.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    <Group justify="space-between" mb="xs">
                                        <Text fw={500}>{deck.title}</Text>
                                        <Badge variant="light">
                                            {deck.cards.length} cards
                                        </Badge>
                                    </Group>
                                    {deck.description && (
                                        <Text size="sm" c="dimmed">
                                            {deck.description}
                                        </Text>
                                    )}
                                </Card>
                            </Link>
                        ))
                    )}
                </SimpleGrid>
            )}
        </Container>
    );
}
