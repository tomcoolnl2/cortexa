"use client";

import { useState } from "react";
import { ActionIcon, SimpleGrid, Flex } from "@mantine/core";
import { IconArrowBackUp, IconArrowsShuffle } from '@tabler/icons-react';
import { api } from '@cortexa/api-client';
import { CardListItem } from "@cortexa/ui";
import { Card, MaybeViewer } from "@cortexa/types";
import { notifications } from "@mantine/notifications";


function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

interface DeckCardsProps {
    cards: Card[];
    viewer: MaybeViewer;
}

export function DeckCards({ cards, viewer }: DeckCardsProps) {

    const [shuffled, setShuffled] = useState(cards);
    const [isShuffled, setIsShuffled] = useState(false);

    const handleShuffle = () => {
        setShuffled(shuffleArray(cards));
        setIsShuffled(true);
    };

    const handleReset = () => {
        setShuffled(cards);
        setIsShuffled(false);
    };
    
    const deleteCard = async (deckId: string, cardId: string) => {
        if (!viewer) {
            return;
        }

        try {
            await api.decks.removeCard(deckId, cardId, viewer.authContext)
                .then(() => {
                    location.reload();
                    notifications.show({
                        title: 'Success',
                        message: 'Card removed successfully.',
                        color: 'green',
                    });
                })
                .catch((err: unknown) => {
                    throw err;
                });
        } catch (error) {
            console.error('Failed to remove card:', error);

            notifications.show({
                title: 'Error',
                message: 'Failed to remove card. Please try again.',
                color: 'red',
            });
        }
    };

    return (<>
        <Flex gap="xs" mb="md" justify="flex-end" mt={-56}>
            <ActionIcon
                variant="light"
                size="lg"
                onClick={handleShuffle}
                title="Shuffle cards"
            >
                <IconArrowsShuffle size={18} />
            </ActionIcon>
            <ActionIcon
                variant="default"
                size="lg"
                onClick={handleReset}
                title="Reset"
                disabled={!isShuffled}
            >
                <IconArrowBackUp size={18} />
            </ActionIcon>
        </Flex>
        <SimpleGrid spacing="lg" component='ul' w='100%' p={0}>
            {shuffled.map((card) => (
                <CardListItem key={card.id} {...card} handleRemoveCard={deleteCard} />
            ))}
        </SimpleGrid>
    </>);
}
