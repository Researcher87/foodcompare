import { ChartConfigData } from "../../types/livedata/ChartConfigData"
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem"
import { AggregatedFoodItemUriData } from "../../types/livedata/UriData"
import { UserData } from "../../types/livedata/UserData"
import { getUpdatedChartConfig, makeChartConfigUriString } from "./ChartConfigConverter"
import {
	convertUserDataObjectToString,
	convertUserDataStringToObject,
	prepareUriForParsing
} from "./FoodDataPanelUriService"


interface Replacemet {
	key: string
	short: string
}

const separator = "++"

const metaDataReplacement: Array<Replacemet> = [
	{key: "nutrientDataList", short: "_mA"},
	{key: "foodItem", short: "_mB"},
	{key: "sourceItemId", short: "_mC"},
	{key: "source", short: "_mD"},
	{key: "url", short: "_mE"},
	{key: "name", short: "_mF"},
	{key: "id", short: "_mG"},
]
	
const nutrientCategoryReplacement: Array<Replacemet> = [
	{key: "baseData", short: "_nA"},
	{key: "carbohydrateData", short: "_nB"},
	{key: "vitaminData", short: "_nC"},
	{key: "mineralData", short: "_nD"},
	{key: "lipidData", short: "_nE"},
	{key: "proteinData", short: "_nF"},
]

const baseDataReplacements: Array<Replacemet> = [
	{key: "energy", short: "_bA"},
	{key: "water", short: "_bB"},
	{key: "carbohydrates", short: "_bC"},
	{key: "lipids", short: "_bD"},
	{key: "proteins", short: "_bE"},
	{key: "dietaryFibers", short: "_bF"},
	{key: "ash", short: "_bG"},
	{key: "alcohol", short: "_bH"}
]

const carbsDataReplacements: Array<Replacemet> = [
	{key: "sugar", short: "_cA"},
	{key: "sucrose", short: "_cB"},
	{key: "glucose", short: "_cC"},
	{key: "lactose", short: "_cD"},
	{key: "fructose", short: "_cE"},
	{key: "galactose", short: "_cF"},
	{key: "maltose", short: "_cG"},
	{key: "starch", short: "_cH"}
]

const lipidsDataReplacements: Array<Replacemet> = [
	{key: "saturated", short: "_lA"},
	{key: "unsaturatedMono", short: "_lB"},
	{key: "unsaturatedPoly", short: "_lC"},
	{key: "transFattyAcids", short: "_lD"},
	{key: "cholesterol", short: "_lE"},
	{key: "galactose", short: "_lF"},
	{key: "omegaData", short: "_lG"},
	{key: "omega3", short: "_lH"},
	{key: "omega6", short: "_li"},
	{key: "uncertain", short: "_lj"},
	{key: "uncertainRatio", short: "_li"}
]

const mineralDataReplacement: Array<Replacemet> = [
	{key: "calcium", short: "_bA"},
	{key: "iron", short: "_bB"},
	{key: "magnesium", short: "_bC"},
	{key: "phosphorus", short: "_bD"},
	{key: "potassium", short: "_bE"},
	{key: "sodium", short: "_bF"},
	{key: "zinc", short: "_bG"},
	{key: "selenium", short: "_bH"},
	{key: "manganese", short: "_bI"},
	{key: "copper", short: "_bJ"}
]

const vitaminDataReplacement: Array<Replacemet> = [
	{key: "a", short: "_vA"},
	{key: "b1", short: "_vB"},
	{key: "b2", short: "_vC"},
	{key: "b3", short: "_vD"},
	{key: "b5", short: "_vE"},
	{key: "b7", short: "_vF"},
	{key: "b9", short: "_vG"},
	{key: "b12", short: "_vH"},
	{key: "c", short: "_vI"},
	{key: "d", short: "_vJ"},
	{key: "e", short: "_vK"},
	{key: "k", short: "_vL"}
]

const proteinDataReplacement: Array<Replacemet> = [
	{key: "tryptophan", short: "_bA"},
	{key: "threonine", short: "_bB"},
	{key: "isoleucine", short: "_bC"},
	{key: "leucine", short: "_bD"},
	{key: "lysine", short: "_bE"},
	{key: "methionine", short: "_bF"},
	{key: "cystine", short: "_bG"},
	{key: "phenylalanine", short: "_bH"},
	{key: "tyrosine", short: "_bI"},
	{key: "arginine", short: "_bJ"},
	{key: "histidine", short: "_bK"},
	{key: "alanine", short: "_bL"},
	{key: "asparticAcid", short: "_bM"},
	{key: "glycine", short: "_bN"},
	{key: "proline", short: "_bO"},
	{key: "serine", short: "_bP"},
]

const replacements: Array<Array<Replacemet>> = [
	metaDataReplacement,
	nutrientCategoryReplacement,
	baseDataReplacements,
	carbsDataReplacements,
	lipidsDataReplacements,
	mineralDataReplacement,
	vitaminDataReplacement,
	proteinDataReplacement
]


export function convertAggregatedDataJsonToUriString(uriData: AggregatedFoodItemUriData): string {	
	const objectToParse: SelectedFoodItem = {...uriData.selectedFoodItem, compositeSubElements: undefined, component: undefined, foodClass: undefined}
	let selectedFoodItemString = JSON.stringify(objectToParse)
	
	replacements.forEach(replacementArray => {
		replacementArray.forEach(replacement => selectedFoodItemString = selectedFoodItemString.replace(`"${replacement.key}"`, replacement.short))
	})
	
	const userDataString = convertUserDataObjectToString(uriData.userData)
	const chartConfigString = makeChartConfigUriString(uriData.chartConfigData, uriData.selectedDataPage)
	
	return `${uriData.selectedDataPage}${separator}${selectedFoodItemString}${separator}${userDataString}${separator}${chartConfigString}`
}

export function convertAggregatedUriStringToObject(chartConfigData: ChartConfigData, uriString: string): AggregatedFoodItemUriData | null {
	const fragments = uriString.split(separator)
	if(fragments.length !== 4) {
		return null
	}
	
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const selectedDataPage = fragments[0]
	let selectedFoodItem: SelectedFoodItem = convertUriStringToSelectedFoodItem( fragments[1])
	selectedFoodItem = {...selectedFoodItem, aggregated: true}
	
	const userData: UserData | null = convertUserDataStringToObject(fragments[2])
	const newChartConfigData: ChartConfigData = getUpdatedChartConfig(chartConfigData, fragments[3], selectedDataPage)
	
	if(!userData) {
		return null
	}
		
	return {
		selectedDataPage: selectedDataPage,
		selectedFoodItem: selectedFoodItem,
		userData: userData,
		chartConfigData: newChartConfigData
	}
}


export function convertUriStringToSelectedFoodItem(uriString: string): SelectedFoodItem {
	let stringToParse = prepareUriForParsing(uriString).trim()
	stringToParse = stringToParse.replace(/%22/g, "\"")
	stringToParse = stringToParse.replace(/%20/g, " ")
	
	replacements.forEach(replacementArray => {
		replacementArray.forEach(replacement => stringToParse = stringToParse.replace(replacement.short, `"${replacement.key}"`))
	})
	
	return JSON.parse(stringToParse)
}