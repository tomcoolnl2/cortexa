// eslint-disable-next-line @nx/enforce-module-boundaries
import { Card, QuizQuestion, QuizAnswerResult } from 'libs/models/src';

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
