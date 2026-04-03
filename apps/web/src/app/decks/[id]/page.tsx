import { api } from '@cortexa/api-client';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Group,
    Badge,
    Alert,
    Button,
} from '@mantine/core';
import Link from 'next/link';
import { FlashCard } from '@cortexa/ui';
import { getViewer } from '../../../lib/viewer';

interface DeckPageProps {
    params: Promise<{ id: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
    const viewer = await getViewer();
    const { id } = await params;

    let deck;
    try {
        if (viewer) {
            deck = await api.decks.get(id, viewer.authContext);
        } else {
            deck = await api.decks.getPublic(id);
        }
    } catch {
        return (
            <Container size="md" py="xl">
                <Link href="/decks/public" style={{ textDecoration: 'none' }}>
                    &larr; Back to decks
                </Link>
                <Text c="red" mt="md">
                    Deck not found, API unavailable, or access denied.
                </Text>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Link href="/decks/public" style={{ textDecoration: 'none' }}>
                &larr; Back to decks
            </Link>

            <Group justify="space-between" mt="md" mb="lg">
                <div>
                    <Title>{deck.title}</Title>
                    {deck.description && (
                        <Text c="dimmed" mt={4}>
                            {deck.description}
                        </Text>
                    )}
                </div>
                <Badge size="lg" variant="light">
                    {deck.cards.length} cards
                </Badge>
            </Group>

            {/* Show Edit button for users with edit permissions */}
            {viewer && viewer.canCreate && (
                <Group mb="lg">
                    <Link href={`/decks/${deck.id}/edit`} passHref>
                        <Button component="a" variant="light">Edit Deck</Button>
                    </Link>
                </Group>
            )}

            {viewer?.scenarioRole === 'reader' ? (
                <Alert color="blue" variant="light" mb="lg">
                    Reader scenario active: card/deck create, edit, and delete
                    endpoints are blocked.
                </Alert>
            ) : null}

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {deck.cards.map((card) => (
                    <FlashCard
                        key={card.id}
                        term={card.term}
                        definition={card.definition}
                    />
                ))}
            </SimpleGrid>
        </Container>
    );
}
