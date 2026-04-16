'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { Carousel } from '@mantine/carousel';
import { AspectRatio, Badge, Group, Progress, Text } from '@mantine/core';
import { Card } from "@cortexa/types";
import { throttle } from "@cortexa/utils";
import { FlashCard } from "../card";


interface DeckCardsProps {
    cards: Card[];
}

export function DeckFlashCards({ cards }: DeckCardsProps) {

    const [scrollProgress, setScrollProgress] = useState(0);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const handleSelect = useCallback(() => {
        if (!embla) {
            return;
        }
        setCurrentSlide(embla.selectedScrollSnap());
    }, [embla]);

    useEffect(() => {
        if (!embla) {
            return;
        }
        // bind events
        embla.on('scroll', handleScroll);
        embla.on('select', handleSelect);
        // Initialize values
        handleScroll();
        handleSelect();
        return () => {
            embla.off('scroll', handleScroll);
            embla.off('select', handleSelect);
        };
    }, [embla, handleScroll]);
    
    return (
        <>
            <Group justify='space-between'>
                <Text size="sm" c='dimmed' mb='xs'>
                    Click on a card to flip it
                </Text>
                <Badge size="md" mb='xs' variant='default'>
                    {currentSlide + 1} / {cards.length}
                </Badge>
            </Group>
            <Carousel
                slideSize="99.9%"
                slideGap="lg"
                getEmblaApi={setEmbla}
                initialSlide={0}
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
