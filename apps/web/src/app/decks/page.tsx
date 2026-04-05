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
import { getViewer } from '../../lib/viewer';


export default async function DecksPage() {

    const viewer = await getViewer();
    
    let decks: Deck[] = [];
    try {
        if (viewer) {
            decks = await api.decks.list(viewer.authContext);
        }
    } catch(e: unknown) {
        decks = [];
    }

    // Merge and deduplicate decks by id
    const allDecksMap = new Map<string, Deck>();
    for (const deck of decks) {
        allDecksMap.set(deck.id, deck);
    }

    return (
        <Container size="md" py="xl">
            <Title mb="lg">All Decks</Title>
            {viewer ? 
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    {allDecksMap.size === 0 ? (
                        <Text c="dimmed">No public decks available yet.</Text>
                    ) : (
                        Array.from(allDecksMap.values()).map((deck) => (
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
                : (
                    <Text c="dimmed">Please log in to view decks.</Text>
                )
            }
        </Container>
    );
}
