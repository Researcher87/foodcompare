import { PortionData } from "../nutrientdata/FoodItem";
import { ChartConfigData, DirectCompareChartConfigData } from "./ChartConfigData";
import SelectedFoodItem from "./SelectedFoodItem";
import { UserData } from "./UserData";

export interface UriBaseData {
	userData: UserData
	selectedDataPage: string
}

export interface FoodDataPanelUriBaseData extends UriBaseData {
	chartConfigData: ChartConfigData
	displayMode: string
}

export interface AggregatedFoodItemUriData extends UriBaseData {
	chartConfigData: ChartConfigData
	selectedFoodItem: SelectedFoodItem
}

export interface SimpleFoodItemUriData extends FoodDataPanelUriBaseData {
	selectedFoodItem: FoodItemUriData
}

export interface DirectCompareUriData extends UriBaseData {
	chartConfigData: DirectCompareChartConfigData
	selectedFoodItem1: FoodItemUriData
	selectedFoodItem2: FoodItemUriData
}

export interface FoodItemUriData {
	foodItemId: number
	source: number
	portionData: PortionData
	supplementData: boolean
	combineData: boolean
}