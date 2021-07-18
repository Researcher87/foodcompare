import SelectedFoodItem from "./SelectedFoodItem";
import {ChartConfigData, DirectCompareChartConfigData} from "./ChartConfigData";
import NameType from "../nutrientdata/NameType";

export interface ApplicationData {
    foodDataPanel: FoodDataPanelData
    directCompareDataPanel: DirectCompareData
    preferredSource: string
    setPreferredSource: (string) => void
}

export interface FoodDataPanelData {
    selectedFoodItems: Array<SelectedFoodItem>
    selectedFoodItemIndex: number
    selectedDataPage: string
    displayMode: string
    chartConfigData: ChartConfigData
    setSelectedFoodTab: (number) => void
    setSelectedDataPage: (string) => void
    addItemToFoodDataPanel: (number) => void
    removeItemFromFoodDataPanel: (number) => void
    removeAllItemsFromFoodDataPanel: () => void
    updateAllFoodItemNames: (foodNames: Array<NameType>, newLanguage: string) => void
    updateFoodDataPanelChartConfig: (chartConfig: ChartConfigData) => void
}

export interface DirectCompareData {
    selectedFoodItem1: SelectedFoodItem | null
    selectedFoodItem2: SelectedFoodItem | null
    selectedDataPage: string
    directCompareConfigChart: DirectCompareChartConfigData
    updateDirectCompareChartConfig: (chartConfig: DirectCompareChartConfigData) => void
    setSelectedDirectCompareItems: (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => void
    setSelectedDirectCompareDataPage: (selectedPage: string) => void
}