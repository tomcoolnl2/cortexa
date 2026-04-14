import { notFound } from 'next/navigation';
import { api } from '@cortexa/api-client';
import { Container, Title, Text, Group, Badge, Alert, ActionIcon, Flex } from '@mantine/core';
import { IconEdit, IconTestPipe } from "@tabler/icons-react";
import { getViewer } from '../../../lib/viewer';
import { DeckPageProps } from '../model';
import { Deck } from '@cortexa/types';
import { DeckCards } from '../../../components/deck-cards';
import { ActionDeleteDeck } from '../../../components/action-delete-deck';
import { DeckBreadcrumbs } from '../../../components/breadcrumbs';


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
                <Flex direction="column" gap="xs">
                    <Title>{deck.title}</Title>
                    {deck.description 
                        ? <Text c="dimmed">{deck.description}</Text>
                        : null}
                    <Badge size="md" variant="light" mt="md">
                        {deck.cards.length} cards
                    </Badge>
                </Flex>
                {viewer && viewer.canCreate
                    ? <Flex direction="row" gap="xs" align='center'>
                        <ActionIcon variant="subtle" size="xl" component="a" href={`/decks/${deck.id}/flashcards`} title="Edit Deck">
                            <IconTestPipe size={24} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" size="xl" component="a" href={`/decks/${deck.id}/edit`} title="Edit Deck">
                            <IconEdit size={24} />
                        </ActionIcon>
                        <ActionDeleteDeck id={deck.id} apiToken={viewer?.apiToken} scenarioRole={viewer?.scenarioRole} /> 
                    </Flex>
                    : null}
            </Group>

            {viewer?.scenarioRole === 'reader' ? (
                <Alert color="blue" variant="light" mb="lg">
                    Reader scenario active: card/deck create, edit, and delete
                    endpoints are blocked.
                </Alert>
            ) : null}

            <DeckCards cards={deck.cards} viewer={viewer} />
        </Container>
    );
}
