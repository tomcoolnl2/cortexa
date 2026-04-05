import { Container, Text } from '@mantine/core';
import { getViewer } from '../../../lib/viewer';
import { DeckForm } from '../deck-form';

export default async function NewDeckPage() {

    const viewer = await getViewer();

    if (!viewer) {
        return (
            <Container size="md" py="xl">
                <Text>Please sign in to create a deck.</Text>
            </Container>
        );
    }

    if (!viewer.canCreate) {
        return (
            <Container size="md" py="xl">
                <Text c="red">
                    You do not have permission to create decks. Contact an admin
                    to be granted creator access.
                </Text>
            </Container>
        );
    }

    return (
        <DeckForm
            mode='create'
            apiToken={viewer.apiToken}
            scenarioRole={viewer.scenarioRole}
        />
    );
}
