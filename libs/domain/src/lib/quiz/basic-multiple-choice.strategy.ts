// eslint-disable-next-line @nx/enforce-module-boundaries
import { Card, QuizQuestion, QuizAnswerResult } from 'libs/models/src';
import type { QuizStrategy } from './quiz-strategy.interface';

export class BasicMultipleChoiceStrategy implements QuizStrategy {
    generateQuestions(cards: Card[], count: number): QuizQuestion[] {
        // Filter out cards with null id to ensure cardId is always a string
        const validCards = cards.filter((c) => c.id !== null);
        const shuffled = [...validCards].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, validCards.length));

        return selected.map((card) => {
            const wrongAnswers = validCards
                .filter((c) => c.id !== card.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((c) => c.definition);

            const options = [card.definition, ...wrongAnswers].sort(
                () => Math.random() - 0.5,
            );

            return {
                cardId: card.id as string,
                term: card.term,
                options,
                correctIndex: options.indexOf(card.definition),
            };
        });
    }

    evaluateAnswer(
        question: QuizQuestion,
        selectedAnswer: string,
    ): QuizAnswerResult {
        const correctAnswer = question.options[question.correctIndex];
        return {
            cardId: question.cardId,
            selectedAnswer,
            isCorrect: selectedAnswer === correctAnswer,
        };
    }

    calculateScore(answers: QuizAnswerResult[]): number {
        if (answers.length === 0) return 0;
        const correct = answers.filter((a) => a.isCorrect).length;
        return (correct / answers.length) * 100;
    }
}
