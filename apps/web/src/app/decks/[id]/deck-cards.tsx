"use client";

import { useState } from "react";
import { SimpleGrid, Button, Group } from "@mantine/core";
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
            <Group mb="md">
                <Button onClick={handleShuffle} variant="light">
                    Shuffle
                </Button>
                <Button onClick={handleReset} disabled={!isShuffled} variant="default">
                    Reset
                </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {shuffled.map((card) => (
                    <FlashCard key={card.id} term={card.term} definition={card.definition} />
                ))}
            </SimpleGrid>
        </>
    );
}
