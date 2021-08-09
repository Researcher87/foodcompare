import { PortionData } from "../nutrientdata/FoodItem";
import { ChartConfigData } from "./ChartConfigData";
import SelectedFoodItem from "./SelectedFoodItem";
import { UserData } from "./UserData";

export interface FoodDataPanelUriBaseData {
	userData: UserData
	selectedDataPage: string
	chartConfigData: ChartConfigData
}

export interface AggregatedFoodItemUriData extends FoodDataPanelUriBaseData {
	selectedFoodItem: SelectedFoodItem
}

export interface SimpleFoodItemUriData extends FoodDataPanelUriBaseData {
	selectedFoodItem: FoodItemUriData
}

export interface DirectCompareUriBaseData extends FoodDataPanelUriBaseData {
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