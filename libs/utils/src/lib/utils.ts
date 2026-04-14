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

/**
 * Creates a throttled version of a callback that only executes once per delay interval.
 *
 * Calls to the throttled function within the delay period are ignored.
 * Useful for limiting the rate at which a function can fire (e.g., scroll or resize events).
 *
 * @template T - Argument types for the callback function.
 * @param callback - The function to throttle.
 * @param delay - The number of milliseconds to wait before allowing another call.
 * @returns A throttled function with the same arguments as the callback.
 *
 * @example
 * const throttled = throttle(() => console.log('Called!'), 500);
 * window.addEventListener('resize', throttled);
 */
export function throttle<T extends unknown[]>(
    callback: (...args: T) => void,
    delay: number,
) {
    let isWaiting = false;

    return (...args: T) => {
        if (isWaiting) {
            return;
        }

        callback(...args);
        isWaiting = true;

        setTimeout(() => {
            isWaiting = false;
        }, delay);
    };
}
