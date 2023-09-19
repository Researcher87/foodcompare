import NameType from "../types/nutrientdata/NameType";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {getNameFromFoodNameList} from "./nutrientdata/NameTypeService";
import FoodDataPage from "../components/fooddatapanel/FoodDataPage";
import React from "react";

/**
 * Enriches a selected food item by its JSX container to be displayed as a tab in the food data panel
 * @param selectedFoodItem The already initialized selected food item
 * @param foodNamesList The food names list
 * @param language The selected language
 */
export function makeFoodDataPanelComponent(selectedFoodItem: SelectedFoodItem, foodNamesList: Array<NameType>, 
		language: string): SelectedFoodItem | null {
    let foodName
    if(selectedFoodItem.foodItem.nameId) {
        foodName = getNameFromFoodNameList(foodNamesList, selectedFoodItem.foodItem.nameId, language)
    } else {
        foodName = selectedFoodItem.title ?? 'Unknown'
    }

    if (foodName === null) {
        return null
    }

    selectedFoodItem.component = <FoodDataPage key={`page component ${selectedFoodItem.id}`} selectedFoodItem={selectedFoodItem}/>
    selectedFoodItem.tab = foodName
    selectedFoodItem.id = selectedFoodItem.foodItem.id

    return selectedFoodItem
}

/**
 * Sets the food data page component on a given food item and returns a new copy of it.
 * @param foodItem A copy of a selected food item, containing the JSX Food Data Page component.
 */
export function setFoodDataPageComponent(foodItem: SelectedFoodItem): SelectedFoodItem {
    const component = <FoodDataPage key={`page component ${foodItem.id}`} selectedFoodItem={foodItem}/>
    return {...foodItem, component: component}
}
