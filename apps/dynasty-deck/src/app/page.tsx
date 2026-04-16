import Link from 'next/link';
import { Group, Button } from '@mantine/core';
import { IconCards } from '@tabler/icons-react';

export default function Page() {
    return (
        <Group mb="lg">
            <Link href={`/decks/new`} passHref>
                <Button variant="light" leftSection={<IconCards size={16} />}>
                    New Deck
                </Button>
            </Link>
        </Group>
    );
}
