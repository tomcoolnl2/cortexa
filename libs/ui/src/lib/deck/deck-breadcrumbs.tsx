import Link from 'next/link';
import { Breadcrumbs, Text } from '@mantine/core';
import { Deck } from "@cortexa/types";


export interface DeckBreadcrumbsProps {
    deck: Deck;
}
export function DeckBreadcrumbs({ deck }: DeckBreadcrumbsProps) {
    const items = [
        { title: 'All Decks', href: '/decks' },
        { title: deck.title },
    ].map((item, index) => (
        item.href
            ? <Link href={item.href} key={index}>
                <Text key={index} c='white' size='xs'>{item.title}</Text>
            </Link>
            : <Text key={index} size='xs' c='dimmed'>{item.title}</Text>
    ));

    return <Breadcrumbs>{items}</Breadcrumbs>;
}