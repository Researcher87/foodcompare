import { DirectCompareChartConfigData } from "../../types/livedata/ChartConfigData"
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem"
import { DirectCompareUriData, FoodItemUriData } from "../../types/livedata/UriData"
import { UserData } from "../../types/livedata/UserData"
import { getUpdatedDirectCompareChartConfig, makeChartConfigUriString } from "./ChartConfigConverter"
import {
	convertUserDataObjectToString,
	convertUserDataStringToObject,
	getFoodItemUriData,
	makeFoodItemDefaultUri,
	replaceSemiColonTransformations
} from "./FoodDataPanelUriService"

export function makeDirectCompareDataUri(selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem, 
		userData: UserData, selectedDataPage: string, chartConfigData: DirectCompareChartConfigData): string {
	const foodItemUriData1 = makeFoodItemUriData(selectedFoodItem1)
	const foodItemUriData2 = makeFoodItemUriData(selectedFoodItem2)
	
	const foodItem1DataUri = makeFoodItemDefaultUri(foodItemUriData1)
	const foodItem2DataUri = makeFoodItemDefaultUri(foodItemUriData2)
	
	const userDataUri = convertUserDataObjectToString(userData)
	const chartConfigUri = makeChartConfigUriString(chartConfigData, selectedDataPage)
	
	return `${foodItem1DataUri};${foodItem2DataUri};${selectedDataPage};${userDataUri};${chartConfigUri}`
}


function makeFoodItemUriData(selectedFoodItem: SelectedFoodItem): FoodItemUriData {
	return {
		foodItemId: selectedFoodItem.foodItem.id,
		portionData: selectedFoodItem.portion,
		source: selectedFoodItem.selectedSource,
		combineData: selectedFoodItem.combineData,
		supplementData: selectedFoodItem.supplementData
	}
}


export function parseDirectComparetUri(uri: string, chartConfigData: DirectCompareChartConfigData): DirectCompareUriData | null {
	const fragments = replaceSemiColonTransformations(uri).split(";")
	if(fragments.length !== 11) {
		return null
	}
	
	const selectedDataPage = fragments[8]
	const userData = convertUserDataStringToObject(fragments[9])
	const chartConfigString = fragments[10]
	
	const foodItemUriData1 = getFoodItemUriData(fragments)
	const remainingFragments = fragments.slice(4)
	const foodItemUriData2 = getFoodItemUriData(remainingFragments)
	
	if(!userData || !foodItemUriData1 || !foodItemUriData2) {
		return null
	}
	
	const newChartConfigData = getUpdatedDirectCompareChartConfig(chartConfigData, chartConfigString, selectedDataPage)
	
	return {
		selectedFoodItem1: foodItemUriData1,
		selectedFoodItem2: foodItemUriData2,
		selectedDataPage: selectedDataPage,
		userData: userData,
		chartConfigData: newChartConfigData
	}
	
}