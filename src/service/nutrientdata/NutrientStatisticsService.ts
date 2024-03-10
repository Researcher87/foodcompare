import NutrientStatistics, {FoodItemStatistics} from "../../types/livedata/NutrientStatistics";
import FoodItem from "../../types/nutrientdata/FoodItem";
import {getElementsOfRankingGroup, getNutrientGroups, getValueOfFoodItem} from "../RankingService";
import {
    NUTRIENT_BASE_DATA_INDEX,
    NUTRIENT_CARBS_INDEX,
    NUTRIENT_LIPIDS_INDEX,
    NUTRIENT_MINERAL_INDEX,
    NUTRIENT_PROTEIN_INDEX,
    NUTRIENT_VITAMIN_INDEX,
} from "../../config/Constants";

export function getStatisticalNutrientInformation(nutrient: string, foodItems: Array<FoodItem>, preferredSource):
    NutrientStatistics {
    let min: number | null = null
    let max: number | null = null
    let sum: number | null = null
    let allValues: Array<number> = []

    foodItems.forEach(foodItem => {
        const value = getValueOfFoodItem(foodItem, nutrient, preferredSource, true)
        if(value !== null) {
            allValues.push(value)
            if(min === null || value < min) {
                min = value
            }
            if(max === null || value > max) {
                max =  value
            }
            if(sum === null) {
                sum = value
            } else {
                sum += value
            }
        }
    })

    const averageAmount = sum ? sum / allValues.length : null
    const sortedValues = allValues.sort((a, b) => a-b)
    const centerValue = sortedValues.length / 2
    const median = sortedValues[Math.floor(centerValue)]

    return {
        minimumAmount: min,
        maximumAmount: max,
        averageAmount: averageAmount,
        median: median,
        allValuesSorted: sortedValues
    }

}

export function countNumberOfAvailableValues(foodItem: FoodItem, sourceId: number): FoodItemStatistics {
    const lang = "en" // Language does not matter when we count nutrient values
    const groups = getNutrientGroups(lang)

    let baseValues = 0
    let carbValues = 0
    let lipidValues = 0
    let proteinValues = 0
    let vitaminValues = 0
    let mineralValues = 0

    groups.forEach(group => {
        const valuesInGroup = getElementsOfRankingGroup(group.value, lang)
        if(!valuesInGroup) {
            return
        }

        const nutrientValuesInFoodItem = valuesInGroup.filter((nutrient ) => {
            const value = getValueOfFoodItem(foodItem, nutrient.value, sourceId, false)
            return value !== null
        })

        switch (group.value) {
            case NUTRIENT_BASE_DATA_INDEX:
                baseValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
            case NUTRIENT_LIPIDS_INDEX:
                lipidValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
            case NUTRIENT_CARBS_INDEX:
                carbValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
            case NUTRIENT_PROTEIN_INDEX:
                proteinValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
            case NUTRIENT_VITAMIN_INDEX:
                vitaminValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
            case NUTRIENT_MINERAL_INDEX:
                mineralValues = nutrientValuesInFoodItem ? nutrientValuesInFoodItem.length : 0
                break;
        }
    })

    return {
        baseDataValues: baseValues,
        carbDataValues: carbValues,
        lipidDataValues: lipidValues,
        proteinDataValues: proteinValues,
        vitaminDataValues: vitaminValues,
        mineralDataValues: mineralValues,
        getTotalNumberOfValues: () => {return baseValues + carbValues + lipidValues + proteinValues + vitaminValues + mineralValues}
    }

}