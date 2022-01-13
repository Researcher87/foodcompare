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
    if(carotenoidData.lutein) {
        amount += carotenoidData.lutein
    }
    if(carotenoidData.lycopene) {
        amount += carotenoidData.lycopene
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

    const factorBetaCarotene = 0.1667
    const factorOtherCarotenoids = 0.0833

    if(carotenoidData.caroteneAlpha) {
        amount += (carotenoidData.caroteneAlpha * factorOtherCarotenoids)
    }
    if(carotenoidData.caroteneBeta) {
        amount += (carotenoidData.caroteneBeta * factorBetaCarotene)
    }
    if(carotenoidData.cryptoxanthin) {
        amount += (carotenoidData.cryptoxanthin * factorOtherCarotenoids)
    }
    if(carotenoidData.lutein) {
        amount += (carotenoidData.lutein * factorOtherCarotenoids)
    }
    if(carotenoidData.lycopene) {
        amount += (carotenoidData.lycopene * factorOtherCarotenoids)
    }

    return amount
}