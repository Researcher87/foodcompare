import { SEX_FEMALE, SEX_MALE } from "../../config/Constants"
import { ChartConfigData } from "../../types/livedata/ChartConfigData"
import { FoodDataPanelUriBaseData, FoodItemUriData, SimpleFoodItemUriData } from "../../types/livedata/UriData"
import { UserData } from "../../types/livedata/UserData"
import { PortionData } from "../../types/nutrientdata/FoodItem"
import { getPalCategory, getPalValue } from "./../calculation/EnergyService"
import { convertBooleanToDigit, convertStringToBoolean, getNumberOfFixedLength } from "./../calculation/MathService"
import { convertGeneralizedChartConfigStringToObject, getUpdatedChartConfig, makeChartConfigUriString } from "./ChartConfigConverter"


export function makeFoodDataPanelDefaultUri(foodItemData: FoodItemUriData,
		userData: UserData, selectedDataPage: string, chartConfigData: ChartConfigData) {
	const foodItemDataString = makeFoodItemDefaultUri(foodItemData)
	const userDataString = convertUserDataObjectToString(userData)
	const chartConfigString = makeChartConfigUriString(chartConfigData, selectedDataPage)
	return `${foodItemDataString};${selectedDataPage};${userDataString};${chartConfigString}`
}

export function makeFoodItemDefaultUri(foodItemData: FoodItemUriData) {
		const portionString = convertPortionDataObjectToString(foodItemData.portionData)	
		const supplementValue = convertBooleanToDigit(foodItemData.supplementData)
		const combineValue = convertBooleanToDigit(foodItemData.combineData)
		
		return `${foodItemData.foodItemId};${foodItemData.source};${portionString};${supplementValue}${combineValue}`
}

export function parseFoodDataPanelDefaultUri(uri: string, chartConfigData: ChartConfigData): SimpleFoodItemUriData | null {
	const fragments = uri.split(";")
	if(fragments.length !== 7) {
		return null
	}
	
	const selectedDataPage = fragments[4]
	const userData = convertUserDataStringToObject(fragments[5])
	const chartConfigString = fragments[6]
	const foodItemUriData = getFoodItemUriData(fragments)
	
	if(!userData || !foodItemUriData) {
		return null
	}
	
	const newChartConfigData = getUpdatedChartConfig(chartConfigData, chartConfigString, selectedDataPage)
	
	return {
		selectedFoodItem: foodItemUriData,
		selectedDataPage: selectedDataPage,
		userData: userData,
		chartConfigData: newChartConfigData
	}
}


export function getFoodItemUriData(fragments: Array<string>): FoodItemUriData | null {
	const foodItemId = parseInt(fragments[0])
	const source = parseInt(fragments[1])
	const portionData = convertPortionDataStringToObject(fragments[2])
	const booleanData = fragments[3]
	
	const supplementData = convertStringToBoolean(booleanData.substring(0,1))
	const combineData = convertStringToBoolean(booleanData.substring(1,2))
	
	if(!portionData || booleanData.length < 2) {
		return null
	}
	
	return {
		foodItemId: foodItemId,
		source: source,
		portionData: portionData,
		supplementData: supplementData,
		combineData: combineData
	}
}

export function convertUserDataObjectToString(userData: UserData): string {
	const weight = getNumberOfFixedLength(userData.weight, 3)
	const age = getNumberOfFixedLength(userData.age, 3)
	const size = getNumberOfFixedLength(userData.size, 3)

	const palValue = getNumberOfFixedLength( getPalCategory(userData.palValue), 2)
	const sex = userData.sex === SEX_MALE ? 1 : 0
	
	const pregnant = convertBooleanToDigit(userData.pregnant)
	const breastFeeding = convertBooleanToDigit(userData.breastFeeding)
	const leisureSports = convertBooleanToDigit(userData.leisureSports)
		
	return `${weight}${age}${size}${palValue}${sex}${pregnant}${breastFeeding}${leisureSports}`
}


export function convertUserDataStringToObject(userDataString: string): UserData | null {
	if(userDataString.length < 15) {
		return null
	}
	
	const weight = userDataString.substring(0,3)
	const age = userDataString.substring(3,6)
	const size = userDataString.substring(6,9)
	const palValueInt = userDataString.substring(9,11)
	const sex = userDataString.substring(11,12)
	const pregnant = userDataString.substring(12,13)
	const breastFeeding = userDataString.substring(13,14)
	const leisureSports = userDataString.substring(14,15)
	
	const palValue = getPalValue(parseInt(palValueInt))
	
	return {
		weight: parseInt(weight),
		age: parseInt(age),
		size: parseInt(size),
		palValue: palValue,
		sex: sex === "1" ? SEX_MALE : SEX_FEMALE,
		pregnant: convertStringToBoolean(pregnant),
		breastFeeding: convertStringToBoolean(breastFeeding),
		leisureSports: convertStringToBoolean(leisureSports),
		initialValues: false
	}
}


export function convertPortionDataObjectToString(portionData: PortionData): string {
	return `${portionData.portionType}_${portionData.amount}`
}

export function convertPortionDataStringToObject(portionDataString: string): PortionData | null {
	const fragments = portionDataString.split("_")
	if(fragments.length !== 2) {
		return null
	}
	return {
		portionType: parseInt(fragments[0]),
		amount: parseInt(fragments[1])
	}
}
