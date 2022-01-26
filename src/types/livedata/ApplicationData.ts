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
    foodSelector1: DirectCompareFoodSelector
    foodSelector2: DirectCompareFoodSelector
}

export interface RankingPanelData {
    selectedFoodCategory: ReactSelectOption | null
    selectedGroup: ReactSelectOption | null
    selectedElement: ReactSelectOption | null
    use100gram: boolean
    showDietaryRequirements: boolean
}

export interface DirectCompareFoodSelector {
    sourceSupplement: boolean
    sourceCombine: boolean
}

export interface FoodSelector extends DirectCompareFoodSelector{
    selectedCategory: ReactSelectOption | null
}