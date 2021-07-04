import SelectedFoodItem from "./SelectedFoodItem";
import {ChartConfigData} from "./ChartConfigData";

export interface ApplicationData {
    foodDataPanel: FoodDataPanelData
}

export interface FoodDataPanelData {
    selectedFoodItems: Array<SelectedFoodItem>
    selectedFoodItemIndex: number
    selectedDataPage: number
    displayMode: string
    chartConfigData: ChartConfigData
}