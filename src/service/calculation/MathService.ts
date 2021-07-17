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

export function roundToNextValue(chartMaxValue: number) {

    const roundUp = (value: number, multiple: number) => {
        const remainder = value % multiple
        if (remainder === 0) {
            return value
        } else {
            return value + multiple - remainder
        }
    }

    let multiple
    if (chartMaxValue < 0.2) {
        multiple = 0.1
    } else if (chartMaxValue < 0.5) {
        multiple = 0.2
    } else if (chartMaxValue < 1) {
        multiple = 0.5
    } else if (chartMaxValue < 2) {
        multiple = 1
    } else if (chartMaxValue < 5) {
        multiple = 2
    } else if (chartMaxValue < 10) {
        multiple = 5
    } else if (chartMaxValue < 20) {
        multiple = 10
    } else if (chartMaxValue < 50) {
        multiple = 20
    } else if (chartMaxValue < 100) {
        multiple = 50
    } else if (chartMaxValue < 200) {
        multiple = 100
    } else if (chartMaxValue < 500) {
        multiple = 200
    } else if (chartMaxValue < 1000) {
        multiple = 500
    } else if (chartMaxValue < 2000) {
        multiple = 1000
    } else if (chartMaxValue < 5000) {
        multiple = 2000
    } else if (chartMaxValue < 10000) {
        multiple = 5000
    } else if (chartMaxValue < 20000) {
        multiple = 10000
    } else if (chartMaxValue < 50000) {
        multiple = 20000
    } else if (chartMaxValue < 100000) {
        multiple = 50000
    } else if (chartMaxValue < 200000) {
        multiple = 100000
    } else {
        multiple = 200000
    }

    // Add 1 % buffer to the maximum value
    chartMaxValue = chartMaxValue * 1.01

    return round(roundUp(chartMaxValue, multiple),2)
}