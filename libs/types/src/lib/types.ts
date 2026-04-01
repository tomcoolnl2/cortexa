// ── User ──
export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
}

// ── Deck & Cards ──
export interface Card {
    id: string;
    term: string;
    definition: string;
    deckId: string;
}

export interface Deck {
    id: string;
    title: string;
    description?: string;
    userId: string;
    cards: Card[];
}

export interface CreateDeckDto {
    title: string;
    description?: string;
    cards: { term: string; definition: string }[];
}

export interface UpdateDeckDto {
    title?: string;
    description?: string;
}

// ── Quiz ──
export interface QuizQuestion {
    cardId: string;
    term: string;
    options: string[];
    correctIndex: number;
}

export interface QuizAnswerResult {
    cardId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

export interface QuizAttemptResult {
    id: string;
    deckId: string;
    userId: string;
    score: number;
    totalQuestions: number;
    answers: QuizAnswerResult[];
    startedAt: string;
    completedAt?: string;
}
