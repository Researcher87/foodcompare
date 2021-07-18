import FoodItem, {NutrientData} from "../../types/nutrientdata/FoodItem";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../static/labels";
import {SOURCE_SRLEGACY} from "../../config/Constants";

export function getNutrientData(foodItem: FoodItem, preferredSource?: string): NutrientData {
    if(!preferredSource || foodItem.nutrientDataList.length === 1) {
        return foodItem.nutrientDataList[0]
    } else {
        if(foodItem.nutrientDataList[0].source.id === 0 && preferredSource === SOURCE_SRLEGACY) {
            return foodItem.nutrientDataList[0]
        } else {
            return foodItem.nutrientDataList[1]
        }
    }
}
