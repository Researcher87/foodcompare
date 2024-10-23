import FoodItem from "../../types/nutrientdata/FoodItem";
import {NutrientCondition} from "../../types/livedata/NutrientCondition";
import {FilteredFoodItem} from "../../types/livedata/SelectedFoodItem";
import {OPERATOR_ALL, OPERATOR_ANY} from "../../config/Constants";
import {getValueOfFoodItem} from "../RankingService";

export function filterFoodItems(foodItems: Array<FoodItem>, conditions: Array<NutrientCondition>, operator: number,
                                preferredSource: number): Array<FilteredFoodItem> {
    const resultList: Array<FilteredFoodItem> = [];

    const addResultObject = (foodItem, source) => {
        resultList.push({
            foodItem: foodItem,
            source: source
        })
    }

    foodItems.forEach((foodItem) => {
        const matchingSources: Array<number> = []
        foodItem.nutrientDataList.forEach((nutrientData) => {
            let failedCondition = false
            let successfulCondition = false
            conditions.forEach(condition => {
                const match = checkCondition(condition, foodItem, nutrientData.source.id)
                if(match) {
                    successfulCondition = true
                    if(operator === OPERATOR_ANY) {
                        return // Nutrient data matched one condition => no need to check further conditions
                    }
                } else if(!match && operator === OPERATOR_ALL) { // Nutrient data failed one condition => total fail => no need to go on
                    failedCondition = true
                    return
                }
            })

            // Food item is a match if it succeeded at least one condition (OR mode) and never failed any condition (AND mode)
            if(successfulCondition && !failedCondition) {
                matchingSources.push(nutrientData.source.id)
            }
        })

        if(matchingSources.length === 2) {  // We have two matching sources => take the preferred source
            const source = matchingSources.filter(source => source === preferredSource)
            if(source) {
                addResultObject(foodItem, source)
            }
        } else if(matchingSources.length === 1) {
            addResultObject(foodItem, matchingSources[0])
        }
    })

    return resultList
}


function checkCondition(condition: NutrientCondition, foodItem: FoodItem, sourceId: number): boolean {
    const value = getValueOfFoodItem(foodItem, condition.nutrient.value, sourceId, false)

    if(!value) {
        return false
    }

    return value >= condition.min && value <= condition.max
}