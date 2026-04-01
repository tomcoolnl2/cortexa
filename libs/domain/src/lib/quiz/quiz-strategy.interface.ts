import { Card, QuizQuestion, QuizAnswerResult } from '@cortexa/types';

export interface QuizStrategy {
    /** Generate quiz questions from a set of cards */
    generateQuestions(cards: Card[], count: number): QuizQuestion[];

    /** Evaluate a user's answer against the correct answer */
    evaluateAnswer(
        question: QuizQuestion,
        selectedAnswer: string,
    ): QuizAnswerResult;

    /** Calculate final score from a set of answer results */
    calculateScore(answers: QuizAnswerResult[]): number;
}
