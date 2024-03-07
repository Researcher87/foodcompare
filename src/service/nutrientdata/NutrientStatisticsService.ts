import NutrientStatistics from "../../types/livedata/NutrientStatistics";
import FoodItem from "../../types/nutrientdata/FoodItem";
import {getNutrientDataForFoodItem} from "./NutrientDataRetriever";
import {getValueOfFoodItem} from "../RankingService";
import {calculateMedian} from "../calculation/MathService";

export function getStatisticalNutrientInformation(nutrient, foodItems: Array<FoodItem>, preferredSource):
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