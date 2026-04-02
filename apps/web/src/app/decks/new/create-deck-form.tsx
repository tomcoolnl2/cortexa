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
    Switch,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface CardEntry {
    term: string;
    definition: string;
}

interface CreateDeckFormProps {
    apiToken: string;
    scenarioRole?: string;
}

export function CreateDeckForm({ apiToken, scenarioRole }: CreateDeckFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [cards, setCards] = useState<CardEntry[]>([
        { term: '', definition: '' },
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addCard = () => {
        setCards((prev) => [...prev, { term: '', definition: '' }]);
    };

    const removeCard = (index: number) => {
        setCards((prev) => prev.filter((_, i) => i !== index));
    };

    const updateCard = (index: number, field: keyof CardEntry, value: string) => {
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
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiToken}`,
            };

            if (scenarioRole) {
                headers['x-cortexa-role-scenario'] = scenarioRole;
            }

            const res = await fetch(
                `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3333/api'}/decks`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        title: title.trim(),
                        description: description.trim() || undefined,
                        isPublic,
                        cards: validCards,
                    }),
                },
            );

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message ?? `API ${res.status}`);
            }

            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create deck.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container size="sm" py="xl">
            <Title mb="lg">Create Deck</Title>

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

                <Switch
                    label="Public deck"
                    description="Visible to everyone, including anonymous visitors"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.currentTarget.checked)}
                    mb="lg"
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
                    <Button type="submit" loading={submitting}>
                        Create Deck
                    </Button>
                    <Button
                        variant="subtle"
                        onClick={() => router.push('/')}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                </Group>
            </form>
        </Container>
    );
}
