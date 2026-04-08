import { describe, it, expect } from 'vitest';
import { importCardsFromTextToDto } from '@cortexa/utils';

// Mock type for CreateCardDto if not available
// Remove this if you have the actual type
// type CreateCardDto = { term: string; definition: string };

describe('importCardsFromTextToDto', () => {
    it('should parse single card', () => {
        const input = 'term1|definition1';
        const result = importCardsFromTextToDto(input);
        expect(result).toEqual([
            { term: 'term1', definition: 'definition1' }
        ]);
    });

    it('should parse multiple cards separated by newlines', () => {
        const input = 'term1|definition1\nterm2|definition2';
        const result = importCardsFromTextToDto(input);
        expect(result).toEqual([
            { term: 'term1', definition: 'definition1' },
            { term: 'term2', definition: 'definition2' }
        ]);
    });

    it('should trim whitespace around terms and definitions', () => {
        const input = '  term1  |  definition1  \n term2 | definition2 ';
        const result = importCardsFromTextToDto(input);
        expect(result).toEqual([
            { term: 'term1', definition: 'definition1' },
            { term: 'term2', definition: 'definition2' }
        ]);
    });

    it('should ignore empty lines', () => {
        const input = '\nterm1|definition1\n\nterm2|definition2\n';
        const result = importCardsFromTextToDto(input);
        expect(result).toEqual([
            { term: 'term1', definition: 'definition1' },
            { term: 'term2', definition: 'definition2' }
        ]);
    });

    it('should support custom line and card splitters', () => {
        const input = 'term1=>definition1;;term2=>definition2';
        const result = importCardsFromTextToDto(input, ';;', '=>');
        expect(result).toEqual([
            { term: 'term1', definition: 'definition1' },
            { term: 'term2', definition: 'definition2' }
        ]);
    });
});
