// eslint-disable-next-line @nx/enforce-module-boundaries
import { Card } from '@cortexa/models';
import { BasicMultipleChoiceStrategy } from './basic-multiple-choice.strategy';

describe('BasicMultipleChoiceStrategy', () => {
    const strategy = new BasicMultipleChoiceStrategy();

    const cards: Card[] = [
        {
            id: '1',
            term: 'Closure',
            definition: 'A function with access to outer scope',
            deckId: 'd1',
        },
        {
            id: '2',
            term: 'Hoisting',
            definition: 'Moving declarations to top',
            deckId: 'd1',
        },
        {
            id: '3',
            term: 'Promise',
            definition: 'Async operation result',
            deckId: 'd1',
        },
        {
            id: '4',
            term: 'Prototype',
            definition: 'Object inheritance mechanism',
            deckId: 'd1',
        },
        {
            id: '5',
            term: 'Event Loop',
            definition: 'Async callback handler',
            deckId: 'd1',
        },
    ];

    describe('generateQuestions', () => {
        it('should generate the requested number of questions', () => {
            const questions = strategy.generateQuestions(cards, 3);
            expect(questions).toHaveLength(3);
        });

        it('should not exceed available cards', () => {
            const questions = strategy.generateQuestions(cards, 10);
            expect(questions).toHaveLength(5);
        });

        it('should include the correct answer in options', () => {
            const questions = strategy.generateQuestions(cards, 5);
            for (const q of questions) {
                const card = cards.find((c) => c.id === q.cardId);
                expect(q.options).toContain(card?.definition);
                expect(q.options[q.correctIndex]).toBe(card?.definition);
            }
        });

        it('should include 4 options per question', () => {
            const questions = strategy.generateQuestions(cards, 3);
            for (const q of questions) {
                expect(q.options).toHaveLength(4);
            }
        });
    });

    describe('evaluateAnswer', () => {
        it('should mark correct answer', () => {
            const questions = strategy.generateQuestions(cards, 1);
            const q = questions[0];
            const correctAnswer = q.options[q.correctIndex];
            const result = strategy.evaluateAnswer(q, correctAnswer);
            expect(result.isCorrect).toBe(true);
        });

        it('should mark wrong answer', () => {
            const questions = strategy.generateQuestions(cards, 1);
            const q = questions[0];
            const wrongAnswer = q.options.find((_, i) => i !== q.correctIndex)!;
            const result = strategy.evaluateAnswer(q, wrongAnswer);
            expect(result.isCorrect).toBe(false);
        });
    });

    describe('calculateScore', () => {
        it('should calculate percentage correctly', () => {
            const score = strategy.calculateScore([
                { cardId: '1', selectedAnswer: 'a', isCorrect: true },
                { cardId: '2', selectedAnswer: 'b', isCorrect: false },
            ]);
            expect(score).toBe(50);
        });
    });
});
