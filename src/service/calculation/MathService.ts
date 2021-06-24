/**
 * Checks whether a value is a positive integer value.
 */
export function isPositiveIntegerValue(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
}

/**
 * Checks whether a value is a positive integer value or 0.
 */
export function isPositiveIntegerValueOrZero(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0;
}

/**
 * Rounds a value between 0 and 100 automatically to a reasonable number of digits:
 *
 * - Generally the value is rounded to one digit.
 * - Between 1 and 10, the value is rounded to two digits.
 * - Between 0.1 and 1, the value is rounded to three digits.
 * - Between 0.01 and 0.1, the value is rounded to four digits.
 * - Otherwise it is rounded to five digits.
 *
 */
export function autoRound(value) {
    let roundFactor = 0;   // Default round factor

    if(value >= 100) {
        roundFactor = 0;
    } else if(value < 100 && value >= 10) {
        roundFactor = 1;
    } else if(value < 10 && value >= 1) {
        roundFactor = 2;
    } else if(value < 1 && value >= 0.1) {
        roundFactor = 3;
    } else if(value < 0.1 && value >= 0.01) {
        roundFactor = 4;
    } else {
        roundFactor = 5;
    }

    return round(value, roundFactor);
}

/**
 * Simple round function to round a number to a specific number of digits.
 */
export function round(value, digits) {
    const roundFactor = Math.pow(10, digits);
    return (Math.round(value * roundFactor)) / roundFactor;
}