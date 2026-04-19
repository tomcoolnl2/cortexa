
/**
 * Formats a year as a string with BCE/CE notation.
 *
 * @param {number} year - The year to format. Negative values represent BCE, positive values represent CE.
 * @returns {string} The formatted year string, e.g., "221 BCE" or "2026 CE".
 */
export function formatYear(year: number): string {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}