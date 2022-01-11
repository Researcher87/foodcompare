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

/**
 * Rounds any given value to the next sensible round or half-round value. Between a range of 10 and 100, everything
 * below 30 will be rounded to the next odden number, everthing above 30 to the next 5-round number.
 * @param value The value to round
 *
 * Examples:
 * 22.5 -> 24
 * 61.3 -> 65
 *
 * 0.00232 -> 0.024
 * 1226 -> 1400
 */
export function roundToNextValue(value: number): number {
    const multiplier = 10000000000
    const nextEvenNumber = (number) => 2 * Math.ceil(number / 2)
    const nextNumberFive = (number) => 5 * Math.ceil(number / 5)

    // Multiply vylue with a high value to prevent logarithmiting illegal values below 1
    const ordinaryValue = value * multiplier
    const numberOfDigits = Math.ceil(Math.log10(ordinaryValue))
    const standardValue = (ordinaryValue / Math.pow(10, numberOfDigits)) * 100

    const nextRoundValue = standardValue < 30 ? nextEvenNumber(standardValue) : nextNumberFive(standardValue)
    return nextRoundValue / Math.pow(10, 12-numberOfDigits)
}

/**
 * Returns a number of fixed length with leading zeros.
 */
export function getNumberOfFixedLength(number: number, digits: number): string {
	let numberString = `${number}`
	while(numberString.length < digits) {
		numberString = `0${numberString}`
	}
	return numberString
}


export function convertBooleanToDigit(value: boolean) {
	return value === true ? 1 : 0
}

export function convertStringToBoolean(value: string) {
	return value === "1" ? true : false
}
