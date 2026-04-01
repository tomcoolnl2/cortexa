import { api } from '@cortexa/api-client';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Group,
    Badge,
} from '@mantine/core';
import Link from 'next/link';
import { FlashCard } from '@cortexa/ui';

interface DeckPageProps {
    params: Promise<{ id: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { id } = await params;

    let deck;
    try {
        deck = await api.decks.get(id);
    } catch {
        return (
            <Container size="md" py="xl">
                <Link href="/" style={{ textDecoration: 'none' }}>
                    &larr; Back to decks
                </Link>
                <Text c="red" mt="md">
                    Deck not found or API unavailable.
                </Text>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Link href="/" style={{ textDecoration: 'none' }}>
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
