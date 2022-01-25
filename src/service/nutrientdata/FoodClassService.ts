import {ReactSelectFoodClassOption} from "../../types/ReactSelectOption";
import FoodClass from "../../types/nutrientdata/FoodClass";
import getName from "../LanguageService";
import NameType from "../../types/nutrientdata/NameType";

export function getFoodClassSelectList(foodClasses: Array<FoodClass>, category: number, foodNames: Array<NameType>, language: string): ReactSelectFoodClassOption[] {
    const filteredFoodClasses = getFoodClassesOfCategory(foodClasses, category)

    if(!filteredFoodClasses || filteredFoodClasses.length === 0) {
        return []
    }

    const reactSelectOptions: Array<ReactSelectFoodClassOption> = []
    filteredFoodClasses.forEach(foodClass => {
        const nameId = foodClass.nameKey
        if(nameId > foodNames.length) {
            console.error(`Illegal food name Id in food class having ID=${foodClass.id}`)
            return
        }
        const nameType = foodNames[nameId-1]
        const foodName = getName(nameType, language)
        reactSelectOptions.push({
            value: foodClass,
            label: foodName
        })
    })

    reactSelectOptions.sort((obj1, obj2) => obj1.label.localeCompare(obj2.label))
    return reactSelectOptions
}


function getFoodClassesOfCategory(foodClasses: Array<FoodClass>, category: number): Array<FoodClass> {
    return foodClasses.filter(foodClass => {
        if(category === 0) {
            return foodClass
        } else if(foodClass.category === category) {
            return foodClass
        } else {
            return null
        }
    })
}