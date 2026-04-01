import { api } from '@cortexa/api-client';
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

export default async function DecksPage() {
    let decks;
    try {
        decks = await api.decks.list();
    } catch {
        return (
            <Container size="md" py="xl">
                <Title>Cortexa</Title>
                <Text c="red" mt="md">
                    Could not connect to the API. Make sure the API is running
                    on port 3333.
                </Text>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Title mb="lg">Your Decks</Title>

            {decks.length === 0 ? (
                <Text c="dimmed">
                    No decks yet. Create one via the API or Swagger UI.
                </Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    {decks.map((deck) => (
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
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
