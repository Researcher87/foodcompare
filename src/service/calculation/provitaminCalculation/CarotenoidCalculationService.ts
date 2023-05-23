import {CarotenoidData} from "../../../types/nutrientdata/FoodItem";
import {EQ_FACTOR_BETA_CAROTENE, EQ_FACTOR_OTHER_CAROTENE} from "./ProvitaminEquivalentFactors";

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

    if(carotenoidData.caroteneAlpha) {
        amount += (carotenoidData.caroteneAlpha * EQ_FACTOR_OTHER_CAROTENE)
    }
    if(carotenoidData.caroteneBeta) {
        amount += (carotenoidData.caroteneBeta * EQ_FACTOR_BETA_CAROTENE)
    }
    if(carotenoidData.cryptoxanthin) {
        amount += (carotenoidData.cryptoxanthin * EQ_FACTOR_OTHER_CAROTENE)
    }

    return amount
}