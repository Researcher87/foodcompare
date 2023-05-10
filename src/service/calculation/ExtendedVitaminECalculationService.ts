import {ExtendedVitaminE} from "../../types/nutrientdata/FoodItem";

export function getTotalAmountOfExtendedVitaminE(extendedVitaminE: ExtendedVitaminE): number | null {
    if(extendedVitaminE === null) {
        return null
    }

    let amount = 0;

    if(extendedVitaminE.tocopherolBeta) {
        amount += extendedVitaminE.tocopherolBeta
    }
    if(extendedVitaminE.tocopherolGamma) {
        amount += extendedVitaminE.tocopherolGamma
    }
    if(extendedVitaminE.tocopherolDelta) {
        amount += extendedVitaminE.tocopherolDelta
    }
    if(extendedVitaminE.tocotrienolAlpha) {
        amount += extendedVitaminE.tocotrienolAlpha
    }
    if(extendedVitaminE.tocotrienolBeta) {
        amount += extendedVitaminE.tocotrienolBeta
    }
    if(extendedVitaminE.tocotrienolGamma) {
        amount += extendedVitaminE.tocotrienolGamma
    }

    return amount
}

/**
 * Calculates the total vitamin E equivalent out of the different forms of Vitamin E
 * @param extendedVitaminE Data object containing the additional Vitamin E forms
 */
export function calculateVitaminEEquivalent(extendedVitaminE: ExtendedVitaminE | null): number {
    if(extendedVitaminE === null) {
        return 0
    }

    let amount = 0;

    const factorTocopherolBeta = 0.5
    const factorTocopherolGamma = 0.25
    const factorTocopherolDelta = 0.01

    const factorTocotrienolAlpha = 0.3
    const factorTocotrienolBeta = 0.15
    const factorTocotrienolGamma = 0.0757

    if(extendedVitaminE.tocopherolBeta) {
        amount += (extendedVitaminE.tocopherolBeta * factorTocopherolBeta)
    }
    if(extendedVitaminE.tocopherolGamma) {
        amount += (extendedVitaminE.tocopherolGamma * factorTocopherolGamma)
    }
    if(extendedVitaminE.tocopherolDelta) {
        amount += (extendedVitaminE.tocopherolDelta * factorTocopherolDelta)
    }

    if(extendedVitaminE.tocotrienolAlpha) {
        amount += (extendedVitaminE.tocotrienolAlpha * factorTocotrienolAlpha)
    }

    if(extendedVitaminE.tocotrienolBeta) {
        amount += (extendedVitaminE.tocotrienolBeta * factorTocotrienolBeta)
    }

    if(extendedVitaminE.tocotrienolGamma) {
        amount += (extendedVitaminE.tocotrienolGamma * factorTocotrienolGamma)
    }

    return amount
}