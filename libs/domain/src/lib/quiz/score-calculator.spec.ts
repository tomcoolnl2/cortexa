import { QuizAnswerResult } from '@cortexa/types';
import { ScoreCalculator } from './score-calculator';

describe('ScoreCalculator', () => {
  describe('percentage', () => {
    it('should return 0 for empty answers', () => {
      expect(ScoreCalculator.percentage([])).toBe(0);
    });

    it('should return 100 for all correct answers', () => {
      const answers: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'a', isCorrect: true },
        { cardId: '2', selectedAnswer: 'b', isCorrect: true },
        { cardId: '3', selectedAnswer: 'c', isCorrect: true },
      ];
      expect(ScoreCalculator.percentage(answers)).toBe(100);
    });

    it('should return 0 for all wrong answers', () => {
      const answers: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'x', isCorrect: false },
        { cardId: '2', selectedAnswer: 'y', isCorrect: false },
      ];
      expect(ScoreCalculator.percentage(answers)).toBe(0);
    });

    it('should calculate correct percentage for mixed answers', () => {
      const answers: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'a', isCorrect: true },
        { cardId: '2', selectedAnswer: 'x', isCorrect: false },
        { cardId: '3', selectedAnswer: 'c', isCorrect: true },
        { cardId: '4', selectedAnswer: 'y', isCorrect: false },
      ];
      expect(ScoreCalculator.percentage(answers)).toBe(50);
    });
  });

  describe('withStreakBonus', () => {
    it('should return 0 for empty answers', () => {
      expect(ScoreCalculator.withStreakBonus([])).toBe(0);
    });

    it('should give bonus for consecutive correct answers', () => {
      const answers: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'a', isCorrect: true },
        { cardId: '2', selectedAnswer: 'b', isCorrect: true },
        { cardId: '3', selectedAnswer: 'c', isCorrect: true },
      ];
      const score = ScoreCalculator.withStreakBonus(answers);
      // streak bonus: (1+0.1) + (1+0.2) + (1+0.3) = 3.6, normalized: 3.6/3 * 100 = 120
      expect(score).toBeGreaterThan(100);
    });

    it('should reset streak on wrong answer', () => {
      const allCorrect: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'a', isCorrect: true },
        { cardId: '2', selectedAnswer: 'b', isCorrect: true },
        { cardId: '3', selectedAnswer: 'c', isCorrect: true },
      ];
      const brokenStreak: QuizAnswerResult[] = [
        { cardId: '1', selectedAnswer: 'a', isCorrect: true },
        { cardId: '2', selectedAnswer: 'x', isCorrect: false },
        { cardId: '3', selectedAnswer: 'c', isCorrect: true },
      ];
      expect(ScoreCalculator.withStreakBonus(allCorrect)).toBeGreaterThan(
        ScoreCalculator.withStreakBonus(brokenStreak)
      );
    });
  });
});
