import { UriData } from "../types/livedata/UriData"

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