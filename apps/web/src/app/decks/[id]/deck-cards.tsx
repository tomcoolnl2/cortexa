"use client";

import { useState } from "react";
import { ActionIcon, SimpleGrid, Flex } from "@mantine/core";
import { IconArrowBackUp, IconArrowsShuffle } from '@tabler/icons-react';
import { FlashCard } from "@cortexa/ui";
import { Card } from "@cortexa/types";

interface DeckCardsProps {
    cards: Card[];
}

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function DeckCards({ cards }: DeckCardsProps) {
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

    return (
        <>
            <Flex gap="xs" mb="md" justify="flex-end">
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
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {shuffled.map((card) => (
                    <FlashCard key={card.id} term={card.term} definition={card.definition} />
                ))}
            </SimpleGrid>
        </>
    );
}
