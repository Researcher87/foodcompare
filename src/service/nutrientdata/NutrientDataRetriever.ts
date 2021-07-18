import FoodItem, {NutrientData} from "../../types/nutrientdata/FoodItem";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../static/labels";
import {SOURCE_SRLEGACY} from "../../config/Constants";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";

export function getSourceName(sourceId: number) {
    switch(sourceId) {
        case 0: return "SR Legacy"
        case 1: return "FNDDS"
        default: return "unknown"
    }
}

export function getNutrientData(selectedFoodItem: SelectedFoodItem): NutrientData {
    return getNutrientDataForFoodItem(selectedFoodItem.foodItem, selectedFoodItem.selectedSource)
}

export function getNutrientDataForFoodItem(foodItem: FoodItem, sourceToUse?: number): NutrientData {
    if(!sourceToUse || foodItem.nutrientDataList.length === 1) {
        return foodItem.nutrientDataList[0]
    } else {
        const nutrientData = foodItem.nutrientDataList.find(nutrientDataObject => nutrientDataObject.source.id === sourceToUse)
        if(nutrientData) {
            return nutrientData
        } else {
            return foodItem.nutrientDataList[0]
        }
    }
}
