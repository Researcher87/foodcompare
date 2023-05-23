import {ExtendedVitaminE} from "../../../types/nutrientdata/FoodItem";
import {
    EQ_FACTOR_TOCOPHEROL_BETA,
    EQ_FACTOR_TOCOPHEROL_DELTA,
    EQ_FACTOR_TOCOPHEROL_GAMMA,
    EC_FACTOR_TOCOTRIENOL_ALPHA,
    EC_FACTOR_TOCOTRIENOL_BETA,
    EC_FACTOR_TOCOTRIENOL_GAMMA
} from "./ProvitaminEquivalentFactors";

export function getTotalAmountOfExtendedVitaminE(extendedVitaminE: ExtendedVitaminE): number | null {
    if (extendedVitaminE === null) {
        return null
    }

    let amount = 0;

    if (extendedVitaminE.tocopherolBeta) {
        amount += extendedVitaminE.tocopherolBeta
    }
    if (extendedVitaminE.tocopherolGamma) {
        amount += extendedVitaminE.tocopherolGamma
    }
    if (extendedVitaminE.tocopherolDelta) {
        amount += extendedVitaminE.tocopherolDelta
    }
    if (extendedVitaminE.tocotrienolAlpha) {
        amount += extendedVitaminE.tocotrienolAlpha
    }
    if (extendedVitaminE.tocotrienolBeta) {
        amount += extendedVitaminE.tocotrienolBeta
    }
    if (extendedVitaminE.tocotrienolGamma) {
        amount += extendedVitaminE.tocotrienolGamma
    }

    return amount
}

/**
 * Calculates the total vitamin E equivalent out of the different forms of Vitamin E
 * @param extendedVitaminE Data object containing the additional Vitamin E forms
 */
export function calculateVitaminEEquivalent(extendedVitaminE: ExtendedVitaminE | null): number {
    if (extendedVitaminE === null) {
        return 0
    }

    let amount = 0;

    if (extendedVitaminE.tocopherolBeta) {
        amount += (extendedVitaminE.tocopherolBeta * EQ_FACTOR_TOCOPHEROL_BETA)
    }
    if (extendedVitaminE.tocopherolGamma) {
        amount += (extendedVitaminE.tocopherolGamma * EQ_FACTOR_TOCOPHEROL_GAMMA)
    }
    if (extendedVitaminE.tocopherolDelta) {
        amount += (extendedVitaminE.tocopherolDelta * EQ_FACTOR_TOCOPHEROL_DELTA)
    }

    if (extendedVitaminE.tocotrienolAlpha) {
        amount += (extendedVitaminE.tocotrienolAlpha * EC_FACTOR_TOCOTRIENOL_ALPHA)
    }

    if (extendedVitaminE.tocotrienolBeta) {
        amount += (extendedVitaminE.tocotrienolBeta * EC_FACTOR_TOCOTRIENOL_BETA)
    }

    if (extendedVitaminE.tocotrienolGamma) {
        amount += (extendedVitaminE.tocotrienolGamma * EC_FACTOR_TOCOTRIENOL_GAMMA)
    }

    return amount
}


export function hasExtendedData(extendedVitaminE: ExtendedVitaminE): boolean {
    return extendedVitaminE.tocopherolBeta !== null
        || extendedVitaminE.tocopherolGamma !== null
        || extendedVitaminE.tocopherolDelta !== null
        || extendedVitaminE.tocotrienolAlpha !== null
        || extendedVitaminE.tocotrienolBeta !== null
        || extendedVitaminE.tocotrienolGamma !== null
}