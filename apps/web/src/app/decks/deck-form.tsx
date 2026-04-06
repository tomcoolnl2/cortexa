'use client';

import { useState } from 'react';
import {
    Container,
    Title,
    TextInput,
    Textarea,
    Button,
    Group,
    Paper,
    ActionIcon,
    Text,
    Alert,
} from '@mantine/core';
import { IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Card, Deck, UserRole } from '@cortexa/models';
import { api } from '@cortexa/api-client';


type DeckFormProps =
    | {
        mode: 'create';
        apiToken: string;
        scenarioRole?: string;
    }
    | {
        mode: 'edit';
        apiToken: string;
        scenarioRole: string;
        deck: Deck
    };

const cardEntryPlaceholder: Card = { 
    id: null, 
    deckId: null,
    term: '', 
    definition: '',
};

export function DeckForm(formProps: DeckFormProps) {

    const isEditMode = formProps.mode === 'edit';

    const router = useRouter();
    const [title, setTitle] = useState(isEditMode && formProps.deck ? formProps.deck.title : '');
    const [description, setDescription] = useState(isEditMode && formProps.deck ? formProps.deck.description || '' : '');

    const [cards, setCards] = useState<Card[]>(() => {
        if (isEditMode && formProps.deck) {
            return formProps.deck.cards.length > 0
                ? formProps.deck.cards
                : [cardEntryPlaceholder];
        }
        return [cardEntryPlaceholder];
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    let successPage = '/decks';
    let cancelPage = '/';
    if (isEditMode && formProps.deck.id) {
        successPage = `/decks/${formProps.deck.id}`;
        cancelPage = `/decks/${formProps.deck.id}`;
    }

    const addCard = () => {
        setCards((prev) => [...prev, cardEntryPlaceholder]);
    };

    const removeCard = (index: number) => {
        setCards((prev) => prev.filter((_, i) => i !== index));
    };

    const updateCard = (index: number, field: keyof Card, value: string) => {
        setCards((prev) =>
            prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)),
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validCards = cards.filter((c) => c.term.trim() && c.definition.trim());

        if (!title.trim()) {
            setError('Title is required.');
            return;
        }

        if (validCards.length === 0) {
            setError('Add at least one card with both term and definition.');
            return;
        }

        setSubmitting(true);

        try {
            // Check for unique title only on create
            if (!isEditMode) {
                const existing = await api.decks.list({ token: formProps.apiToken });
                if (existing.some(deck => deck.title.trim().toLowerCase() === title.trim().toLowerCase())) {
                    setError('A deck with this title already exists. Please choose a unique title.');
                    setSubmitting(false);
                    return;
                }
            }

            if (isEditMode && formProps.deck) {
                // UPDATE
                await api.decks.update(
                    formProps.deck.id,
                    {
                        title: title.trim(),
                        description: description.trim() || undefined,
                        cards: validCards,
                    },
                    { token: formProps.apiToken, scenarioRole: formProps.scenarioRole as UserRole }
                );
            } else {
                // CREATE
                await api.decks.create(
                    {
                        title: title.trim(),
                        description: description.trim() || undefined,
                        cards: validCards,
                    },
                    { token: formProps.apiToken, scenarioRole: formProps.scenarioRole as UserRole }
                );
            }

            router.push(successPage);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save deck.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container size="sm" py="xl">
            <Title mb="lg">{isEditMode ? 'Edit' : 'Create'} Deck</Title>

            {error ? (
                <Alert color="red" variant="light" mb="md">
                    {error}
                </Alert>
            ) : null}

            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Title"
                    placeholder="e.g. JavaScript Fundamentals"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    mb="md"
                />

                <Textarea
                    label="Description"
                    placeholder="Optional description"
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    mb="md"
                />

                <Group justify="space-between" mb="sm">
                    <Text fw={500}>Cards</Text>
                    <Button
                        variant="light"
                        size="xs"
                        leftSection={<IconPlus size={14} />}
                        onClick={addCard}
                    >
                        Add Card
                    </Button>
                </Group>

                {cards.map((card, index) => (
                    <Paper key={index} withBorder p="sm" mb="sm">
                        <Group align="flex-start" wrap="nowrap">
                            <div style={{ flex: 1 }}>
                                <TextInput
                                    label="Term"
                                    placeholder="Front of card"
                                    value={card.term}
                                    onChange={(e) =>
                                        updateCard(index, 'term', e.currentTarget.value)
                                    }
                                    mb="xs"
                                />
                                <Textarea
                                    label="Definition"
                                    placeholder="Back of card"
                                    value={card.definition}
                                    onChange={(e) =>
                                        updateCard(index, 'definition', e.currentTarget.value)
                                    }
                                    autosize
                                    minRows={2}
                                />
                            </div>
                            {cards.length > 1 ? (
                                <ActionIcon
                                    color="red"
                                    variant="light"
                                    mt={28}
                                    onClick={() => removeCard(index)}
                                    aria-label="Remove card"
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            ) : null}
                        </Group>
                    </Paper>
                ))}

                <Group mt="lg">
                    <Button 
                        type="submit" 
                        loading={submitting} 
                        leftSection={<IconCheck size={16} />} 
                        disabled={submitting}
                    >
                        {isEditMode ? 'Update' : 'Create'}
                    </Button>
                    <Button
                        variant="subtle"
                        onClick={() => router.push(cancelPage)}
                        leftSection={<IconX size={16} />} 
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                </Group>
            </form>
        </Container>
    );
}
