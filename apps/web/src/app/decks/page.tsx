import { IconCards } from '@tabler/icons-react';
import { Container, Title, Text, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api } from '@cortexa/api-client';
import { Deck } from '@cortexa/types';
import { getViewer } from '../../lib/viewer';
import { DeckListItem } from '../../components/deck-list-item';


export default async function DecksPage() {

    const viewer = await getViewer();
    
    let decks: Deck[] = [];
    try {
        if (viewer) {
            decks = await api.decks.list(viewer.authContext);
        }
    } catch(e: unknown) {
        console.error('Failed to fetch decks:', e);
        notifications.show({
            title: 'Failed to delete deck',
            message: 'An error occurred while trying to delete the deck. Please try again.',
            color: 'red',
            withCloseButton: true
        });
    }

    return (
        <Container size="lg" py="xl">
            <Title mb="lg"><IconCards size={30} /> Decks</Title>
            {viewer ? 
                decks.length === 0 
                    ? <Text c="dimmed">No decks available.</Text>
                    : <Group mt="xl" component='ul' px={0}>
                        {decks.map((deck) => <DeckListItem key={deck.id} deck={deck} viewer={viewer} />)}
                    </Group>
                : <Text c="dimmed">Please log in to view decks.</Text>
            }
        </Container>
    );
}
