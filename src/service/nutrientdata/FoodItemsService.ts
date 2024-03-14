import FoodItem, {PortionData} from "../../types/nutrientdata/FoodItem";
import NameType from "../../types/nutrientdata/NameType";
import {ReactSelectFoodItemOption} from "../../types/ReactSelectOption";
import getName, {} from "../LanguageService";
import FoodClass from "../../types/nutrientdata/FoodClass";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";


/**
 * Auxiliary method to get the food item from a given food list or null.
 * @param foodItemId Food Item Id
 * @param foodItems The list of food items
 */
export function getFoodItem(foodItemId: number, foodItems: Array<FoodItem>): FoodItem | null {
    const index = foodItems.findIndex(foodItem => foodItem.id === foodItemId)
    if(index >= 0) {
        return foodItems[index]
    } else {
        return null
    }
}

/**
 * Makes the select list (component) for food items.
 * @param foodItems The list of all food items.
 * @param foodClass The selected food class.
 * @param foodNames The list of all food names.
 * @param conditions The list of all conditions.
 * @param language The given language.
 */
export function getFoodItemsSelectList(foodItems: Array<FoodItem>, foodClass: number, foodNames: Array<NameType>,
                                       conditions: Array<NameType>, language: string): Array<ReactSelectFoodItemOption> {
    const filteredFoodItems = getFoodItemsOfFoodClass(foodItems, foodClass)
    const reactSelectOptions: Array<ReactSelectFoodItemOption> = []

    if(filteredFoodItems && filteredFoodItems.length > 0) {
        filteredFoodItems.forEach(foodItem => {
            let foodName = getFoodItemName(foodItem, foodNames, language)
            const condition = conditions.find(condition => condition.id === foodItem.conditionId)
            const conditionName = condition ? getName(condition, language) : null

            if(conditionName && foodItem.conditionId !== 100) {   // Exclude the "general" condition
                foodName = `${foodName} (${conditionName})`
            }

            reactSelectOptions.push({
                value: foodItem,
                label: foodName ?? ''
            })
        })
    }

    // If more than 5 items are in the list, we sort them lexicographically (otherwise by default).
    if(reactSelectOptions.length > 5) {
        reactSelectOptions.sort((obj1, obj2) => obj1.label.localeCompare(obj2.label))
    }

    return reactSelectOptions
}

/**
 * Central method to retrieve the food name of an food item in a given language.
 * @param foodItem The food item object.
 * @param foodNames The list of food items.
 * @param language The given language.
 * @param verbose Specifies whether the verbose name should be returned or just the simple one.
 */
export function getFoodItemName(foodItem: FoodItem, foodNames: Array<NameType>, language: string, verbose = false): string | null {
    const nameId = foodItem.nameId
    if(!nameId || nameId > foodNames.length) {
        return null
    }
    const nameType = foodNames[nameId-1]
    return getName(nameType, language, verbose)
}


/**
 * Returns all food items that belong to a food class.
 * @param foodItems The list of all food items.
 * @param foodClassId The ID of the selected food class.
 */
export function getFoodItemsOfFoodClass(foodItems: Array<FoodItem>, foodClassId: number): Array<FoodItem> {
    return foodItems.filter(foodItem => {
        if(foodItem.foodClass === foodClassId) {
            return foodItem
        } else {
            return null
        }
    })
}


/**
 * Creates a selected food item object (an object selected from the food selector modal and displayed on the food data panel) out of
 * a food item, a food class and a portion data object.
 * @param foodItem
 * @param foodClass
 * @param portion
 */
export function makeSelectedFoodItemObject(
    foodItem: FoodItem | undefined,
    foodClass: FoodClass | undefined,
    portion: PortionData | undefined,
    portionAmount: number,
    supplementData: boolean,
    combineData: boolean,
    selectedSource?: number
): SelectedFoodItem | null  {
    if (!foodItem || !foodClass || !portion) {
        return null
    }

    if (portion.portionType === 0) {
        portion.amount = portionAmount
    }

    return {
        foodItem: foodItem,
        foodClass: foodClass,
        portion: {...portion},
        selectedSource: selectedSource ? selectedSource : foodItem.nutrientDataList[0].source.id,
        supplementData: supplementData,
        combineData: combineData
    }
}