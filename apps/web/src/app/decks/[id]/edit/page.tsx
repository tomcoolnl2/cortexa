"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
  Paper,
  ActionIcon,
  Alert,
  Switch,
  Loader,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { api } from "@cortexa/api-client";
import { Deck } from "@cortexa/models";

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [cards, setCards] = useState<{ id?: string; term: string; definition: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with viewer-aware API call if needed
        const d = await api.decks.get(deckId, { token: '' });
        setDeck(d);
        setTitle(d.title);
        setDescription(d.description || "");
        setIsPublic(d.isPublic);
        setCards(d.cards.map((c) => ({ id: c.id, term: c.term, definition: c.definition })));
      } catch (e: unknown) {
        setError("Failed to load deck");
      } finally {
        setLoading(false);
      }
    }
    if (deckId) fetchDeck();
  }, [deckId]);

  const addCard = () => {
    setCards((prev) => [...prev, { term: "", definition: "" }]);
  };

  const removeCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, field: "term" | "definition", value: string) => {
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Update deck info (isPublic is not part of UpdateDeckDto, so only send title/description)
      await api.decks.update(deckId, { title, description }, { token: '' });
      // Card update API is not implemented; skipping card updates.
      setSubmitting(false);
      router.push(`/decks/${deckId}`);
    } catch (error: unknown) {
      setError("Failed to update deck");
      setSubmitting(false);
    }
  };

  if (loading) return <Container py="xl"><Loader /></Container>;
  if (error) return <Container py="xl"><Alert color="red">{error}</Alert></Container>;
  if (!deck) return null;

  return (
    <Container size="md" py="xl">
      <Title mb="lg">Edit Deck</Title>
      <form onSubmit={handleSubmit}>
        <TextInput label="Title" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required mb="md" />
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} mb="md" />
        <Switch label="Public" checked={isPublic} onChange={(e) => setIsPublic(e.currentTarget.checked)} mb="md" />
        <Title order={3} mt="lg" mb="sm">Cards</Title>
        {cards.map((card, index) => (
          <Paper key={card.id || index} withBorder p="sm" mb="sm">
            <Group align="flex-start" wrap="nowrap">
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Term"
                  placeholder="Front of card"
                  value={card.term}
                  onChange={(e) => updateCard(index, "term", e.currentTarget.value)}
                  mb="xs"
                />
                <Textarea
                  label="Definition"
                  placeholder="Back of card"
                  value={card.definition}
                  onChange={(e) => updateCard(index, "definition", e.currentTarget.value)}
                  autosize
                  minRows={2}
                />
              </div>
              <ActionIcon color="red" variant="light" mt={28} onClick={() => removeCard(index)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
        <Button leftSection={<IconPlus size={16} />} variant="light" onClick={addCard} mb="lg" type="button">
          Add Card
        </Button>
        <Group mt="md">
          <Button type="submit" loading={submitting} disabled={submitting}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => router.push(`/decks/${deckId}`)} disabled={submitting}>
            Cancel
          </Button>
        </Group>
        {error && <Alert color="red" mt="md">{error}</Alert>}
      </form>
    </Container>
  );
}
