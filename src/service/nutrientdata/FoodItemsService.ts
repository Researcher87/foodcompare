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

export function getFoodItemsSelectList(foodItems: Array<FoodItem>, foodClass: number, foodNames: Array<NameType>,
                                       conditions: Array<NameType>, language: string): Array<ReactSelectFoodItemOption> {
    const filteredFoodItems = getFoodItemsOfFoodclass(foodItems, foodClass)
    const reactSelectOptions: Array<ReactSelectFoodItemOption> = []

    if(filteredFoodItems && filteredFoodItems.length > 0) {
        filteredFoodItems.forEach(foodItem => {
            let foodName = getFoodItemName(foodItem, foodNames, language)
            const condition = conditions.find(condition => condition.id === foodItem.conditionId)
            const conditionName =condition ? getName(condition, language) : null

            if(conditionName) {
                foodName = `${foodName} (${conditionName})`
            }

            reactSelectOptions.push({
                value: foodItem,
                label: foodName ?? ''
            })
        })
    }

    return reactSelectOptions
}

export function getFoodItemName(foodItem: FoodItem, foodNames: Array<NameType>, language: string ): string | null {
    const nameId = foodItem.nameId!!
    if(nameId > foodNames.length) {
        console.error(`Illegal food name Id in food item having ID=${foodItem.id}`)
        return null
    }
    const nameType = foodNames[nameId-1]
    return getName(nameType, language)
}

export function getFoodItemsOfFoodclass(foodItems: Array<FoodItem>, foodClassId: number): Array<FoodItem> {
    return foodItems.filter(foodItem => {
        if(foodItem.foodClass === foodClassId) {
            return foodItem
        } else {
            return null
        }
    })
}