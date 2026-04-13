'use client'; 
import { Card, Text, ActionIcon, useMantineTheme, CardSection, Title, Flex } from '@mantine/core';
import { useHover, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { Card as CardType } from '@cortexa/types';

export interface CardListItemProps extends CardType {
    handleRemoveCard?: (deckId: string, cardId: string) => Promise<void>;
}

export function CardListItem({ id, deckId, term, definition, handleRemoveCard }: CardListItemProps) {
    
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const isMobile = useMediaQuery('(max-width: 48em)');

    const orientation = isMobile ? 'vertical' : 'horizontal';

    const style = { 
        borderColor: hovered
            ? theme.colors[theme.primaryColor][9]
            : theme.colors.dark[4], 
        textDecoration: 'none' 
    };

    const openRemoveCardConfirmModal = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                Are yu sure you want to delete this card? This action cannot be undone.
            </Text>
        ),
        withCloseButton: false,
        confirmProps: { color: 'red', variant: 'outline' },
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        onConfirm: () => {
            handleRemoveCard?.(deckId!, id!)
        },
    });

    return (
        <Card key={id} ref={ref} orientation={orientation} mb='sm' w='100%' component='li' radius='sm' withBorder style={{ ...style }}>
            <CardSection p='md' inheritPadding withBorder w='100%' style={{ ...style }}>
                <Title order={2} size='h5' lineClamp={1} c='white'>
                    {term}
                </Title>
                <Text c='dimmed' size='sm' mt={10} lineClamp={2}>
                    {definition}
                </Text>
            </CardSection>
            <CardSection p='md' inheritPadding withBorder miw={100} style={{ display: 'flex', justifyContent: 'flex-end', ...style }}>
                <Flex direction='row' gap='xs' align='center'>
                    {handleRemoveCard && (
                        <ActionIcon variant="subtle" size="md" color='red' onClick={openRemoveCardConfirmModal} title="Delete card">
                            <IconTrash color={hovered ? 'white' : 'grey'} size={18} />
                        </ActionIcon>
                    )}
                </Flex>
            </CardSection>
        </Card>
    );
}
