import {ReactSelectFoodClassOption} from "../../types/ReactSelectOption";
import FoodClass from "../../types/nutrientdata/FoodClass";
import getName from "../LanguageService";
import NameType from "../../types/nutrientdata/NameType";
import {getFoodItemName, getFoodItemsOfFoodClass} from "./FoodItemsService";
import FoodDataCorpus from "../../types/nutrientdata/FoodDataCorpus";

export const foodClassLabelSeparator = "||"

export function getFoodClassSelectList(foodDataCorpus: FoodDataCorpus, category: number,
                                       foodNames: Array<NameType>, language: string): ReactSelectFoodClassOption[] {
    const {foodClasses, foodItems} = foodDataCorpus
    const filteredFoodClasses = getFoodClassesOfCategory(foodClasses, category)

    if (!filteredFoodClasses || filteredFoodClasses.length === 0) {
        return []
    }

    const reactSelectOptions: Array<ReactSelectFoodClassOption> = []
    filteredFoodClasses.forEach(foodClass => {
        const nameId = foodClass.nameKey
        if (nameId > foodNames.length) {
            return
        }
        const nameType = foodNames[nameId - 1]
        const foodName = getName(nameType, language, true)

        /*
         * In order to find food items in the select menu, which do not match the food class name, the food class
         * label will be extended by the food item names of their class. A special formatting function is used in
         * the list to convert the name back to the original food class name.
         *
         * Syntax: <food class name> || <name of food items (deduplicated)>
         */

        const foodItemsOfFoodClass = getFoodItemsOfFoodClass(foodItems, foodClass.id)
        const foodItemNames: string[] = foodItemsOfFoodClass.map(foodItem => getFoodItemName(foodItem, foodNames, language)).filter(name => name !== null) as string[]
        const label = foodName + foodClassLabelSeparator + foodItemNames.filter((element, index) => {
            return foodItemNames.indexOf(element) === index;
        }).join()   // Remove duplicates and then add all remaining food item names to the food class label

        reactSelectOptions.push({
            value: foodClass,
            label: label
        })
    })

    reactSelectOptions.sort((obj1, obj2) => obj1.label.localeCompare(obj2.label))
    return reactSelectOptions
}


export function getFoodClassesOfCategory(foodClasses: Array<FoodClass>, category: number): Array<FoodClass> {
    return foodClasses.filter(foodClass => {
        if (category === 0) {
            return foodClass
        } else if (foodClass.category === category) {
            return foodClass
        } else {
            return null
        }
    })
}