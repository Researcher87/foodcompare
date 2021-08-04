import { PortionData } from "../nutrientdata/FoodItem";
import SelectedFoodItem from "./SelectedFoodItem";
import { UserData } from "./UserData";

export interface UriData {
	userData: UserData
	selectedDataPage: string
	selectedFoodItem: SelectedFoodItem
}