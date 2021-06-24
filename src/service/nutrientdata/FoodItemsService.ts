import FoodItem from "../../types/nutrientdata/FoodItem";
import NameType from "../../types/nutrientdata/NameType";
import {ReactSelectFoodItemOption} from "../../types/ReactSelectOption";
import getName from "../LanguageService";

export function getFoodItem(foodItemId: number, foodItems: Array<FoodItem>): FoodItem | null {
    const index = foodItems.findIndex(foodItem => foodItem.id === foodItemId)
    if(index >= 0) {
        return foodItems[index]
    } else {
        return null
    }
}

export function getFoodItemsSelectList(foodItems: Array<FoodItem>, foodClass: number, foodNames: Array<NameType>, conditions: Array<NameType>, language: string): Array<ReactSelectFoodItemOption> {
    const filteredFoodItems = getFoodItemsOfFoodclass(foodItems, foodClass)
    const reactSelectOptions: Array<ReactSelectFoodItemOption> = []

    if(filteredFoodItems && filteredFoodItems.length > 0) {
        filteredFoodItems.forEach(foodItem => {
            const nameId = foodItem.nameId
            if(nameId > foodNames.length) {
                console.error(`Illegal food name Id in food item having ID=${foodItem.id}`)
                return
            }
            const nameType = foodNames[nameId-1]
            let foodName = getName(nameType, language)

            const conditionIndex = conditions.findIndex(condition => {
                return condition.id === foodItem.conditionId
            })

            const conditionName = conditionIndex >= 0 ? getName(conditions[conditionIndex], language) : null

            if(conditionName) {
                foodName = `${foodName} (${conditionName})`
            }

            reactSelectOptions.push({
                value: foodItem,
                label: foodName
            })
        })
    }

    return reactSelectOptions
}


function getFoodItemsOfFoodclass(foodItems: Array<FoodItem>, foodClassId: number): Array<FoodItem> {
    return foodItems.filter(foodItem => {
        if(foodItem.foodClass === foodClassId) {
            return foodItem
        } else {
            return null
        }
    })
}