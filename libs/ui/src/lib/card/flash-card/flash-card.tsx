'use client';

import { useState } from 'react';
import { Badge, Box, Text } from '@mantine/core';
import styles from './flash-card.module.css';

export interface FlashCardProps {
    term: string;
    definition: string;
    initialFlipped?: boolean;
}

export function FlashCard({ term, definition, initialFlipped = false }: FlashCardProps) {

    const [flipped, setFlipped] = useState(initialFlipped);

    return (
        <Box className={styles.scene} onClick={() => setFlipped((f) => !f)} c='div'>
            <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
                <div className={styles.face}>
                    <Badge size="md" className={styles.label}>
                        Term
                    </Badge>
                    <Text className={styles.text}>
                        {term}
                    </Text>
                </div>
                <div className={`${styles.face} ${styles.back}`}>
                    <Badge size="md" className={styles.label}>
                        Definition
                    </Badge>
                    <Text className={styles.text}>
                        {definition}
                    </Text>
                </div>
            </div>
        </Box>
    );
}
