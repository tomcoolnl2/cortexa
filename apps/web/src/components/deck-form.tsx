'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { importCardsFromTextToDto } from '@cortexa/utils';
import { Container, Title, TextInput, Textarea, Group, Paper, ActionIcon, Text, Alert, Button, Modal, FileButton } from '@mantine/core';
import { IconTrash, IconUpload, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { Card, Deck, UserRole } from '@cortexa/types';
import { api } from '@cortexa/api-client';
import { ConfimationModal } from '@cortexa/ui';
import { useDisclosure } from '@mantine/hooks';
import { StdioNull } from 'child_process';


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
    const [importModalOpened, { open: onImportModalOpen, close: onImportModalClose }] = useDisclosure(false);
    const [importedText, setImportedText] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const setFileAndText = (file: File | null) => {
        if (file === null) {
            setImportedText('');
            setFile(null);
            return;
        }
        setImportedText('');
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setImportedText(text);
            }
        };
        reader.readAsText(file);
    };

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

    const removeDeck = async () => {
        if (isEditMode && formProps.deck) {
            try {
                await api.decks.remove(formProps.deck.id, { token: formProps.apiToken, scenarioRole: formProps.scenarioRole as UserRole });
                router.push('/decks');
                router.refresh();
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to delete deck.');
            }
        }
    };

    const addCards = () => {
        const newCards = importCardsFromTextToDto(importedText);
        const newCardEntries: Card[] = newCards.map((cardDto) => ({
            id: null,
            deckId: null,
            term: cardDto.term,
            definition: cardDto.definition,
        }));
        setCards((prev) => [...prev, ...newCardEntries]);
        onImportModalClose();
    };

    const addCard = () => {
        setCards((prev) => [...prev, cardEntryPlaceholder]);
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    };

    const removeCard = (index: number) => {
        setCards((prev) => prev.filter((_, i) => i !== index));
    };

    const updateCard = (index: number, field: keyof Card, value: string) => {
        setCards((prev) => prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)));
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
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
            <Group justify="space-between" mb="md">
                <Title>{isEditMode ? 'Edit' : 'Create'} Deck</Title>
                <ConfimationModal
                    modalHeader="Confirm Deletion"
                    modalText="Are you sure you want to delete this deck? This action cannot be undone."
                    buttonText="Delete"
                    buttonVariant="outline"
                    withCloseButton
                    onConfirm={removeDeck}
                    buttonIcon={<IconTrash size={16} />}
                />
            </Group>

            <Modal title='Import your data' opened={importModalOpened} onClose={onImportModalClose} size="lg" withCloseButton={false}>
                <Textarea
                    label="Copy and Paste your data here"
                    placeholder="e.g. Term | Definition"
                    autosize
                    minRows={10}
                    maxRows={20}
                    value={importedText}
                    onChange={(e) => setImportedText(e.currentTarget.value)}
                />
                <Group justify="space-between" mt="md">
                    <Group gap="xs">
                        <Button onClick={addCards} leftSection={<IconCheck size={16} />} disabled={!importedText.trim()}>
                            Import
                        </Button>
                        <Button variant="subtle" onClick={onImportModalClose} leftSection={<IconX size={16} />}>
                            Cancel
                        </Button>
                    </Group>
                    <FileButton onChange={setFileAndText} accept="text/plain" multiple={false}>
                        {(props) => <Button {...props} rightSection={<IconUpload size={14} />}>Upload</Button>}
                    </FileButton>
                </Group>
            </Modal>


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

                <Group justify="space-between" align="center" mb="sm">
                    <Text fw={500}>Cards</Text>
                    <Group gap="xs">
                        <Button
                            size="xs"
                            leftSection={<IconPlus size={14} />}
                            onClick={addCard}
                        >
                            Add Card
                        </Button>
                        <ActionIcon
                            size="md"
                            onClick={onImportModalOpen}
                            title="Shuffle cards"
                        >
                            <IconUpload size={14} />
                        </ActionIcon>
                    </Group>
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
                                    onChange={(e) => updateCard(index, 'definition', e.currentTarget.value) }
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
