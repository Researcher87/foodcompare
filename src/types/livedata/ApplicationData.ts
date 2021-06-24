import SelectedFoodItem from "./SelectedFoodItem";

export interface ApplicationData {
    foodDataPanel: FoodDataPanelData
}

export interface FoodDataPanelData {
    selectedFoodItems: Array<SelectedFoodItem>
    selectedFoodItemIndex: number
    selectedDataPage: number
    displayMode: string
}