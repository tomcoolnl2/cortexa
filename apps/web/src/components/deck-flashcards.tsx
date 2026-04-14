'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { Carousel } from '@mantine/carousel';
import { Card } from "@cortexa/types";
import { AspectRatio, Progress } from '@mantine/core';
import { FlashCard } from "@cortexa/ui";
import { throttle } from "@cortexa/utils";


interface DeckCardsProps {
    cards: Card[];
}

export function DeckFlashCards({ cards }: DeckCardsProps) {

    const [scrollProgress, setScrollProgress] = useState(0);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);


    // Throttle scroll progress updates to every 100ms
    const throttledSetScrollProgress = useCallback(
        throttle((value: number) => setScrollProgress(value), 100),
        []
    );

    const handleScroll = useCallback(() => {
        if (!embla) {
            return;
        }
        throttledSetScrollProgress(embla.scrollProgress() * 100);
        
    }, [embla, throttledSetScrollProgress]);

    useEffect(() => {
        if (!embla) {
            return;
        }
        embla.on('scroll', handleScroll);
        handleScroll();
    }, [embla]);
    
    return (
        <>
            <Carousel
                emblaOptions={{ dragFree: false }}
                slideSize="99.9%"
                slideGap="lg"
                getEmblaApi={setEmbla}
                initialSlide={0}
                draggable={false}
            >
                {cards.map((card) => (
                    <AspectRatio key={card.id} component={Carousel.Slide} ratio={16/9}>
                        <FlashCard term={card.term} definition={card.definition} />
                    </AspectRatio>
                ))}
            </Carousel>
            <Progress value={scrollProgress} maw={420} size="sm" mt="xl" mx="auto" />
        </>
    );
}
