import { api } from '@cortexa/api-client';
import { Deck } from '@cortexa/types';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Card,
    Group,
    Badge,
    Alert,
} from '@mantine/core';
import Link from 'next/link';
import { auth } from '../auth';
import { cookies } from 'next/headers';
import { USER_ROLES } from '@cortexa/types';

export default async function DecksPage() {
    const session = await auth();
    const scenarioCookie = (await cookies()).get('cortexa_role_scenario')?.value;
    const scenarioRole = USER_ROLES.find((role) => role === scenarioCookie);

    let decks: Deck[] = [];
    try {
        if (session?.user) {
            decks = await api.decks.list({
                token: session.apiToken,
                scenarioRole,
            });
        } else {
            decks = await api.decks.listPublic();
        }
    } catch {
        decks = [];
    }

    return (
        <Container size="md" py="xl">
            <Title mb="lg">Your Decks</Title>

            {scenarioRole === 'reader' ? (
                <Alert color="blue" variant="light" mb="md">
                    Reader scenario is active. Mutating actions are disabled by
                    API role checks.
                </Alert>
            ) : null}

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
