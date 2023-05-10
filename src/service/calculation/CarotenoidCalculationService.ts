import {CarotenoidData} from "../../types/nutrientdata/FoodItem";

export function getTotalAmountOfCarotenoids(carotenoidData: CarotenoidData): number | null {
    if(carotenoidData === null) {
        return null
    }

    let amount = 0;

    if(carotenoidData.caroteneAlpha) {
        amount += carotenoidData.caroteneAlpha
    }
    if(carotenoidData.caroteneBeta) {
        amount += carotenoidData.caroteneBeta
    }
    if(carotenoidData.cryptoxanthin) {
        amount += carotenoidData.cryptoxanthin
    }

    return amount
}

/**
 * Calculates the total vitamin A equivalent out of the different carotenoid values
 * @param carotenoidData
 */
export function calculateVitaminAEquivalent(carotenoidData: CarotenoidData | null): number {
    if(carotenoidData === null) {
        return 0
    }

    let amount = 0;

    const factorBetaCarotene = 0.08333
    const factorOtherCarotenoids = 0.04166

    if(carotenoidData.caroteneAlpha) {
        amount += (carotenoidData.caroteneAlpha * factorOtherCarotenoids)
    }
    if(carotenoidData.caroteneBeta) {
        amount += (carotenoidData.caroteneBeta * factorBetaCarotene)
    }
    if(carotenoidData.cryptoxanthin) {
        amount += (carotenoidData.cryptoxanthin * factorOtherCarotenoids)
    }

    return amount
}