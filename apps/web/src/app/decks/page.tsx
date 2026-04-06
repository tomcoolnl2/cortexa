import Link from 'next/link';
import { IconCards, IconCaretRight, IconEdit, IconInfoCircle } from '@tabler/icons-react';
import { Container, Title, Text, SimpleGrid, Badge, Table, TableThead, TableTbody, TableTr, TableTh, TableTd, Tooltip } from '@mantine/core';
import { api } from '@cortexa/api-client';
import { Deck } from '@cortexa/types';
import { getViewer } from '../../lib/viewer';


export default async function DecksPage() {

    const viewer = await getViewer();
    
    let decks: Deck[] = [];
    try {
        if (viewer) {
            decks = await api.decks.list(viewer.authContext);
        }
    } catch(e: unknown) {
        decks = [];
    }

    // Merge and deduplicate decks by id
    const allDecksMap = new Map<string, Deck>();
    for (const deck of decks) {
        allDecksMap.set(deck.id, deck);
    }

    const header = (
        <TableTr>
            <TableTh></TableTh>
            <TableTh>Title</TableTh>
            <TableTh>Description</TableTh>
            <TableTh>Created</TableTh>
            <TableTh w={100}>Size</TableTh>
            <TableTh></TableTh>
        </TableTr>
    )

    const rows = Array.from(allDecksMap.values()).map((deck) => (
        <TableTr key={deck.id}>
            <TableTd>
                <Tooltip label={deck.id} withArrow position="right">
                    <IconInfoCircle size={18} />
                </Tooltip>
            </TableTd>
            <TableTd>
                <Text fw={500}>{deck.title}</Text>
            </TableTd>
            <TableTd>
                <Text c="dimmed">{deck.description}</Text>
            </TableTd>
            <TableTd>
                <Text c="dimmed">{deck.createdAt.split('T')[0]}</Text>
            </TableTd>
            <TableTd align='right'>
                <Badge variant="light" size="sm">
                    {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                </Badge>
            </TableTd>
            <TableTd>
                <SimpleGrid cols={2} spacing="xs">
                    <Link key={deck.id + '-edit'} href={`/decks/${deck.id}/edit`}>
                        <IconEdit size={16} />
                    </Link>
                    <Link key={deck.id + '-link'} href={`/decks/${deck.id}`}>
                        <IconCaretRight size={16} />
                    </Link>
                </SimpleGrid>
            </TableTd>
        </TableTr>
    ));

    return (
        <Container size="md" py="xl">
            <Title mb="lg"><IconCards size={30} /> Decks</Title>
            {viewer ? 
                allDecksMap.size === 0 
                    ? <Text c="dimmed">No public decks available yet.</Text>
                    : <Table highlightOnHover withRowBorders withColumnBorders horizontalSpacing="md" verticalSpacing="md" striped>
                        <TableThead>{header}</TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                : <Text c="dimmed">Please log in to view decks.</Text>
            }
        </Container>
    );
}
