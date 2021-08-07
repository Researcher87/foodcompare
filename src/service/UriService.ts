import { SEX_FEMALE, SEX_MALE } from "../config/Constants"
import { UriData, UriDataPanelData } from "../types/livedata/UriData"
import { UserData } from "../types/livedata/UserData"
import { PortionData } from "../types/nutrientdata/FoodItem"
import { getPalCategory, getPalValue } from "./calculation/EnergyService"
import { convertBooleanToDigit, convertStringToBoolean, getNumberOfFixedLength } from "./calculation/MathService"

interface Replacemet {
	key: string
	short: string
}

const highLevelReplacement: Array<Replacemet> = [
	{key: "userData", short: "x1"},
	{key: "selectedDataPage", short: "x2"},
	{key: "selectedFoodItems", short: "x3"}
	]

const userDataReplacement: Array<Replacemet> = [	
	{key: "age", short: "u1"},
	{key: "size", short: "u2"},
	{key: "weight", short: "u3"},
	{key: "sex", short: "u4"},
	{key: "palValue", short: "u5"},
	{key: "leisureSports", short: "u6"},
	{key: "initialValues", short: "u7"},
	{key: "pregnant", short: "u8"},
	{key: "breastFeeding", short: "u9"},
	]
	
const selectedFoodItemsReplacement: Array<Replacemet> = [	
	{key: "age", short: "u1"},	
]

export function convertUriDataJsonToCompactString(uriData: UriData): string {	
	let dataString = JSON.stringify(uriData)
	return dataString
}

export function convertUriStringToObject(uriString: string): UriData {
	let stringToParse = uriString.trim()
	stringToParse = stringToParse.replace(/%22/g, "\"")
	stringToParse = stringToParse.replace(/%20/g, " ")
	console.log('String to parse', stringToParse)
	const uriDataObject: UriData = JSON.parse(stringToParse)
	return uriDataObject
}

export function makeFoodDataPanelDefaultUri(foodItemId: number, source: number, portionData: PortionData, 
		userData: UserData, supplementData: boolean, combineData: boolean, selectedDataPage: string) {
	const portionString = convertPortionDataObjectToString(portionData)
	const userDataString = convertUserDataObjectToString(userData)
	const supplementValue = convertBooleanToDigit(supplementData)
	const combineValue = convertBooleanToDigit(combineData)
	return `${foodItemId};${source};${portionString};${userDataString};${supplementValue}${combineValue};${selectedDataPage}`
}

export function parseFoodDataPanelDefaultUri(uri: string): UriDataPanelData | null {
	const fragments = uri.split(";")
	if(fragments.length !== 6) {
		return null
	}
	
	const foodItemId = parseInt(fragments[0])
	const source = parseInt(fragments[1])
	const portionData = convertPortionDataStringToObject(fragments[2])
	const userData = convertUserDataStringToObject(fragments[3])
	const booleanData = fragments[4]
	const selectedDataPage = fragments[5]
	
	if(!userData || !portionData || booleanData.length < 2) {
		return null
	}
	
	const supplementData = convertStringToBoolean(booleanData.substring(0,1))
	const combineData = convertStringToBoolean(booleanData.substring(1,2))
	
	return {
		foodItemId: foodItemId,
		source: source,
		portionData: portionData,
		userData: userData,
		selectedDataPage: selectedDataPage,
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
