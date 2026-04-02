"use client";

import { Deck } from '@cortexa/models';
import {
  SegmentedControl,
  Stack,
  SimpleGrid,
  Card,
  Group,
  Badge,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

interface ClientDecksProps {
  allDecks: Deck[];
  publicDecks: Deck[];
  userDecks: Deck[];
  effectiveRole?: string | null;
}

export function ClientDecks({ allDecks, publicDecks, userDecks, effectiveRole }: ClientDecksProps) {
  const [filter, setFilter] = useState('all');
  // Only show private filter and decks if user is admin or creator
  const canSeePrivate = effectiveRole === 'admin' || effectiveRole === 'creator';
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Public', value: 'public' },
    ...(canSeePrivate ? [{ label: 'Private', value: 'private' }] : []),
  ];
  if (!canSeePrivate && filter === 'private') setFilter('all');

  let filteredDecks = allDecks;
  if (filter === 'public') filteredDecks = publicDecks;
  if (filter === 'private' && canSeePrivate) filteredDecks = userDecks.filter((d) => !d.isPublic);

  const canViewPrivate = userDecks.some((d) => !d.isPublic);
  return (
    <Stack>
      <SegmentedControl
        value={filter}
        onChange={setFilter}
        data={filterOptions}
        fullWidth
        mb="md"
      />
      {filteredDecks.length === 0 ? (
        <Text c="dimmed">No decks available for this filter.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {filteredDecks.map((deck) => (
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
                  <Group gap="xs">
                    <Badge variant="light" size="sm" color={deck.isPublic ? 'green' : 'gray'}>
                      {deck.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <Badge variant="light">{deck.cards.length} cards</Badge>
                  </Group>
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
    </Stack>
  );
}
