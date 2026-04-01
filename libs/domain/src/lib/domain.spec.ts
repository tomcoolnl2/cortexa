import { BasicMultipleChoiceStrategy } from './quiz/basic-multiple-choice.strategy';
import { ScoreCalculator } from './quiz/score-calculator';

describe('domain exports', () => {
    it('should export BasicMultipleChoiceStrategy', () => {
        expect(BasicMultipleChoiceStrategy).toBeDefined();
    });

    it('should export ScoreCalculator', () => {
        expect(ScoreCalculator).toBeDefined();
    });
});
