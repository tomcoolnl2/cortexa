import { CreateCardDto } from "@cortexa/types";

/**
 * Converts a delimited text string into an array of CreateCardDto objects.
 *
 * Each line in the input string represents a card, with the term and definition separated by a delimiter (default: '|').
 * Empty lines are ignored. Whitespace around terms and definitions is trimmed.
 *
 * @param {string} content - The input text containing cards, one per line.
 * @param {string} [lineSplitter='\n'] - The delimiter used to split lines (default: newline).
 * @param {string} [cardSplitter='|'] - The delimiter used to split term and definition (default: '|').
 * @returns {CreateCardDto[]} Array of card objects with term and definition.
 *
 * @example
 * importCardsFromTextToDto('term1|definition1\\nterm2|definition2')
 * // returns [ { term: 'term1', definition: 'definition1' }, { term: 'term2', definition: 'definition2' } ]
 */
export function importCardsFromTextToDto(
    content: string,
    lineSplitter = '\n',
    cardSplitter = '|'
): CreateCardDto[] {
    const lines = content
        .split(lineSplitter)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    return lines
        .map((line) => line.split(cardSplitter).map((part) => part.trim()))
        .map(([term, definition]) => ({ term, definition }));
}
