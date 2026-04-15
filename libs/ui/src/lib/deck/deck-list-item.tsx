'use client';

import Link from 'next/link';
import { ActionIcon, Card, CardSection, Divider, Flex, Group, Text, Badge, Title } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useHover, useMediaQuery } from '@mantine/hooks';
import { IconEdit } from "@tabler/icons-react";
import { Deck, MaybeViewer } from '@cortexa/types';
import { ActionDeleteDeck } from '../action';

interface DeckListItemProps {
    deck: Deck;
    viewer: MaybeViewer;
}

export function DeckListItem({ deck, viewer }: DeckListItemProps) {
    
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const isMobile = useMediaQuery('(max-width: 48em)');

    const orientation = isMobile ? 'vertical' : 'horizontal';
    const date = new Date(deck.createdAt).toDateString();

    const style = { 
        borderColor: hovered
            ? theme.colors[theme.primaryColor][9]
            : theme.colors.dark[4], 
        textDecoration: 'none' 
    };

    return (
        <Card key={deck.id} ref={ref} orientation={orientation} mb='sm' w='100%' component='li' radius='sm' withBorder style={{ ...style }}>
            <CardSection p='md' inheritPadding withBorder w='100%' component={Link} href={`/decks/${deck.id}`} style={{ ...style }}>
                <Flex direction='column' gap='xs'>
                    <Group gap='xs' align='center'>
                        <Text c='dimmed' size='sm'>{date}</Text>
                        <Divider orientation="vertical" size="sm" />
                        <Badge size='md' variant={!hovered ? 'light' : 'filled'}>
                            {deck.cards.length} term{deck.cards.length !== 1 ? 's' : ''}
                        </Badge>
                    </Group>
                    <Title order={2} size='h5' lineClamp={1} c='white'>
                        {deck.title}
                    </Title>
                </Flex>
            </CardSection>
            <CardSection p='md' inheritPadding withBorder>
                <Flex direction='row' gap='xs' h='100%' align='center' justify='flex-end' style={{ opacity: hovered ? 1 : 0.2 }}>
                    <ActionIcon variant="subtle" size="md" component="a" href={`/decks/${deck.id}/edit`} title="Edit Deck">
                        <IconEdit size={24} />
                    </ActionIcon>
                    {viewer 
                        ? <ActionDeleteDeck id={deck.id} size='md' apiToken={viewer.apiToken} scenarioRole={viewer.scenarioRole} />
                        : null}
                </Flex>
            </CardSection>
        </Card>
    )

}