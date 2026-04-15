import { Card, Text } from '@mantine/core';

export interface CardItemProps {
    term: string;
    definition: string;
}

export function CardItem({ term, definition }: CardItemProps) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={600} size="lg" mb="xs">
                {term}
            </Text>
            <Text size="sm" c="dimmed">
                {definition}
            </Text>
        </Card>
    );
}
