'use client';

import { useState } from 'react';
import { Text } from '@mantine/core';
import styles from './flash-card.module.css';

export interface FlashCardProps {
    /** The front side of the card */
    term: string;
    /** The back side of the card */
    definition: string;
    /** Start with the card flipped (shows definition) */
    initialFlipped?: boolean;
}

export function FlashCard({ term, definition, initialFlipped = false }: FlashCardProps) {
    const [flipped, setFlipped] = useState(initialFlipped);

    return (
        <div
            className={styles.scene}
            onClick={() => setFlipped((f) => !f)}
        >
            <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
                <div className={styles.face}>
                    <Text size="xs" c="dimmed" className={styles.label}>
                        Term
                    </Text>
                    <Text size="lg" fw={500} className={styles.text}>
                        {term}
                    </Text>
                </div>
                <div className={`${styles.face} ${styles.back}`}>
                    <Text size="xs" c="dimmed" className={styles.label}>
                        Definition
                    </Text>
                    <Text size="lg" fw={500} className={styles.text}>
                        {definition}
                    </Text>
                </div>
            </div>
        </div>
    );
}
