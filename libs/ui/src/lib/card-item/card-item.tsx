import { Card, Text, Group, ActionIcon } from '@mantine/core';

export interface CardItemProps {
  term: string;
  definition: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardItem({ term, definition, onEdit, onDelete }: CardItemProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="xs">
        {term}
      </Text>
      <Text size="sm" c="dimmed">
        {definition}
      </Text>
      {(onEdit || onDelete) && (
        <Group justify="flex-end" mt="md">
          {onEdit && (
            <ActionIcon variant="subtle" color="blue" onClick={onEdit} aria-label="Edit card">
              ✏️
            </ActionIcon>
          )}
          {onDelete && (
            <ActionIcon variant="subtle" color="red" onClick={onDelete} aria-label="Delete card">
              🗑️
            </ActionIcon>
          )}
        </Group>
      )}
    </Card>
  );
}
