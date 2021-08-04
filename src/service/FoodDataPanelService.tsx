import NameType from "../types/nutrientdata/NameType";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {getNameFromFoodNameList} from "./nutrientdata/NameTypeService";
import FoodDataPage from "../components/fooddatapanel/FoodDataPage";
import React from "react";
import FoodClass from "../types/nutrientdata/FoodClass";
import FoodItem from "../types/nutrientdata/FoodItem";
import {PORTION_KEY_100} from "../config/Constants";

/**
 * Enriches a selected food item by its JSX container to be displayed as a tab in the food data panel
 * @param selectedFoodItem The already initialized selected food item
 * @param foodNamesList The food names list
 * @param language The selected language
 */
export function makeFoodDataPanelComponent(selectedFoodItem: SelectedFoodItem, foodNamesList: Array<NameType>, 
		language: string, dataPage?: string): SelectedFoodItem | null {
    let foodName
    if(selectedFoodItem.foodItem.nameId) {
        foodName = getNameFromFoodNameList(foodNamesList, selectedFoodItem.foodItem.nameId, language)
    } else {
        foodName = 'Individual'
    }

    if (foodName === null) {
        console.error('No food name available.')
        return null
    }

    selectedFoodItem.component = <FoodDataPage key={`page component ${selectedFoodItem.id}`} selectedFoodItem={selectedFoodItem} dataPage={dataPage}/>
    selectedFoodItem.tab = foodName
    selectedFoodItem.id = selectedFoodItem.foodItem.id

    return selectedFoodItem
}
