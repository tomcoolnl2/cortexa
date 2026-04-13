'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { Carousel } from '@mantine/carousel';
import { Card } from "@cortexa/types";
import { Progress } from '@mantine/core';
import { FlashCard } from "@cortexa/ui";


interface DeckCardsProps {
    cards: Card[];
}

export function DeckFlashCards({ cards }: DeckCardsProps) {

    const [scrollProgress, setScrollProgress] = useState(0);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

    const handleScroll = useCallback(() => {
        if (!embla) {
            return;
        }
        const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
        setScrollProgress(progress * 100);
    }, [embla, setScrollProgress]);

    useEffect(() => {
        if (embla) {
            embla.on('scroll', handleScroll);
            handleScroll();
        }
    }, [embla]);
    
    return (
        <Carousel
            emblaOptions={{ dragFree: true }}
            slideSize="92%"
            slideGap="md"
            height={'50vh'}
            getEmblaApi={setEmbla}
            initialSlide={0}
        >
            <Carousel.Slide>Start slide</Carousel.Slide>
            {cards.map((card) => (
                <Carousel.Slide key={card.id} bg={'blue'}>
                    <FlashCard term={card.term} definition={card.definition} />
                </Carousel.Slide>
            ))}
            <Carousel.Slide>End slide</Carousel.Slide>
            <Progress value={scrollProgress} maw={320} size="sm" mt="xl" mx="auto" />
        </Carousel>
    );
}
