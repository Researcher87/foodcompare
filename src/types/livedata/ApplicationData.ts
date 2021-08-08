import SelectedFoodItem from "./SelectedFoodItem";
import {ChartConfigData, DirectCompareChartConfigData} from "./ChartConfigData";
import NameType from "../nutrientdata/NameType";
import ReactSelectOption from "../ReactSelectOption";

export interface ApplicationData {
    foodDataPanel: FoodDataPanelData
    directCompareDataPanel: DirectCompareData
    foodSelector: FoodSelector
    preferredSource: string
}

export interface FoodDataPanelData {
    selectedFoodItems: Array<SelectedFoodItem>
    selectedFoodItemIndex: number
    selectedDataPage: string
    displayMode: string
    chartConfigData: ChartConfigData
}

export interface DirectCompareData {
    selectedFoodItem1: SelectedFoodItem | null
    selectedFoodItem2: SelectedFoodItem | null
    selectedDataPage: string
    directCompareConfigChart: DirectCompareChartConfigData
}

export interface FoodSelector {
    selectedCategory: ReactSelectOption | null
    sourceSupplement: boolean
    sourceCombine: boolean
}