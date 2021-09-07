import SelectedFoodItem from "./SelectedFoodItem";
import {ChartConfigData, DirectCompareChartConfigData} from "./ChartConfigData";
import ReactSelectOption from "../ReactSelectOption";

export interface ApplicationData {
    foodDataPanel: FoodDataPanelData
    directCompareDataPanel: DirectCompareData
    rankingPanelData: RankingPanelData
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

export interface RankingPanelData {
    selectedFoodCategory: ReactSelectOption | null
    selectedGroup: ReactSelectOption | null
    selectedElement: ReactSelectOption | null
    use100gram: boolean
    showDietaryRequirements: boolean
}

export interface FoodSelector {
    selectedCategory: ReactSelectOption | null
    sourceSupplement: boolean
    sourceCombine: boolean
}