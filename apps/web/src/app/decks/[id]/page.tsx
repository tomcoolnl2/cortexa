import { api } from '@cortexa/api-client';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Group,
    Badge,
    Alert,
} from '@mantine/core';
import Link from 'next/link';
import { FlashCard } from '@cortexa/ui';
import { auth } from '../../../auth';
import { cookies } from 'next/headers';
import { USER_ROLES } from '@cortexa/types';

interface DeckPageProps {
    params: Promise<{ id: string }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
    const session = await auth();
    const { id } = await params;
    const scenarioCookie = (await cookies()).get('cortexa_role_scenario')?.value;
    const scenarioRole = USER_ROLES.find((role) => role === scenarioCookie);

    let deck;
    try {
        if (session?.user) {
            deck = await api.decks.get(id, {
                token: session.apiToken,
                scenarioRole,
            });
        } else {
            deck = await api.decks.getPublic(id);
        }
    } catch {
        return (
            <Container size="md" py="xl">
                <Link href="/" style={{ textDecoration: 'none' }}>
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

            {scenarioRole === 'reader' ? (
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
