import { QuizAnswerResult } from '@cortexa/types';

export class ScoreCalculator {
  /**
   * Basic percentage score: (correct / total) * 100
   */
  static percentage(answers: QuizAnswerResult[]): number {
    if (answers.length === 0) return 0;
    const correct = answers.filter((a) => a.isCorrect).length;
    return (correct / answers.length) * 100;
  }

  /**
   * Weighted score with streak bonus.
   * Consecutive correct answers earn increasing bonus points.
   */
  static withStreakBonus(answers: QuizAnswerResult[]): number {
    if (answers.length === 0) return 0;

    let score = 0;
    let streak = 0;

    for (const answer of answers) {
      if (answer.isCorrect) {
        streak++;
        score += 1 + streak * 0.1; // base 1 point + streak bonus
      } else {
        streak = 0;
      }
    }

    const maxPossible = answers.length; // base points only for normalization
    return (score / maxPossible) * 100;
  }
}
