export const USER_ROLES = ['admin', 'creator', 'reader'] as const;

export type UserRole = (typeof USER_ROLES)[number];

// ── User ──
export interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    role?: UserRole;
}

export interface ApiAuthContext {
    token: string;
    scenarioRole?: UserRole;
}

// ── Deck & Cards ──
export interface Card {
    id: string | null;
    deckId: string | null;
    term: string;
    definition: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Deck {
    id: string;
    title: string;
    description?: string;
    cards: Card[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDeckDto {
    title: string;
    description?: string;
    cards: { term: string; definition: string }[];
}

export interface UpdateDeckDto {
    title?: string;
    description?: string;
    cards: Card[];
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
