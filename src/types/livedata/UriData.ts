import { PortionData } from "../nutrientdata/FoodItem";
import { ChartConfigData } from "./ChartConfigData";
import SelectedFoodItem from "./SelectedFoodItem";
import { UserData } from "./UserData";

interface FoodDataPanelUriBaseData {
	userData: UserData
	selectedDataPage: string
	chartConfigData: ChartConfigData
}

export interface UriData extends FoodDataPanelUriBaseData {
	selectedFoodItem: SelectedFoodItem
}

export interface UriDataPanelData extends FoodDataPanelUriBaseData {
	foodItemId: number
	source: number
	portionData: PortionData
	supplementData: boolean
	combineData: boolean
}