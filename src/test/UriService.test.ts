import { initialChartConfigData, initialDirectCompareConfigData } from "../config/ApplicationSetting"
import {
	CARBS_DATA_DETAIL,
	CHART_TYPE_BAR,
	CHART_TYPE_PIE,
	DISPLAYMODE_CHART,
	GRAM,
	LIPIDS_DATA_OMEGA,
	TAB_BASE_DATA,
	TAB_CARBS_DATA,
	TAB_LIPIDS_DATA,
	TAB_VITAMIN_DATA
} from "../config/Constants"

import { getUpdatedChartConfig, makeChartConfigUriString } from "../service/uri/ChartConfigConverter"
import { makeDirectCompareDataUri, parseDirectComparetUri } from "../service/uri/DirectCompareUriService"
import { convertAggregatedDataJsonToUriString, convertAggregatedUriStringToObject } from "../service/uri/FoodDataPanelAggregatedUriService"
import { convertPortionDataObjectToString, convertPortionDataStringToObject, convertUserDataObjectToString, convertUserDataStringToObject, makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri } from "../service/uri/FoodDataPanelUriService"
import { ChartConfigData } from "../types/livedata/ChartConfigData"
import SelectedFoodItem from "../types/livedata/SelectedFoodItem"
import { AggregatedFoodItemUriData, DirectCompareUriData, FoodItemUriData } from "../types/livedata/UriData"
import FoodItem, { NutrientData, PortionData } from "../types/nutrientdata/FoodItem"
import { makeDefaultBaseData, makeDefaultCarbsData, makeDefaultLipidsData, makeDefaultMineralData, makeDefaultProteinData, makeDefaultSource, makeDefaultVitaminData, userData } from "./TestHelper"

describe('Parsing of sub-elements in the URI', () => {
		
	it('should correctly convert the user data object in a string', () => {				
		const userDataString = convertUserDataObjectToString(userData)
		const reconvertedObject = convertUserDataStringToObject(userDataString)
		
		expect(reconvertedObject).not.toBe(null)
		expect(userData).toMatchObject(reconvertedObject ? reconvertedObject : {})	
	})
	
	
	it('should correctly convert the portion data object in a string', () => {		
		const portionData: PortionData = {
			portionType: 120,
			amount: 55,
		}
		
		const portionDataString = convertPortionDataObjectToString(portionData)
		const reconvertedObject = convertPortionDataStringToObject(portionDataString)
		
		expect(reconvertedObject).not.toBe(null)
		expect(portionData).toMatchObject(reconvertedObject ? reconvertedObject : {})	
	})
	
	
	it('should correctly convert the chart config data object in a string', () => {		
		const chartConfigDataBase: ChartConfigData = {...initialChartConfigData, baseChartConfig: {
				chartType: CHART_TYPE_PIE,
				showLegend: false,
				showDetails: true
			}
		}
		
		// Base data test:
		
		let chartConfigUriString = makeChartConfigUriString(chartConfigDataBase, TAB_BASE_DATA)
		let reconvertedObject = getUpdatedChartConfig(chartConfigDataBase, chartConfigUriString, TAB_BASE_DATA)
		
		expect(reconvertedObject).not.toBe(null)
		expect(reconvertedObject).toMatchObject(chartConfigDataBase ? chartConfigDataBase : {})	
		
		
		// Vitamin data test:
		
		const chartConfigDataVitamin: ChartConfigData = {...initialChartConfigData, vitaminChartConfig: {
				portionType: GRAM,
				expand100: true
			}
		}
		
		chartConfigUriString = makeChartConfigUriString(chartConfigDataVitamin, TAB_VITAMIN_DATA)
		reconvertedObject = getUpdatedChartConfig(chartConfigDataVitamin, chartConfigUriString, TAB_VITAMIN_DATA)
		
		expect(reconvertedObject).not.toBe(null)
		expect(reconvertedObject).toMatchObject(chartConfigDataVitamin ? chartConfigDataVitamin : {})	
		
		
		// Carbs data set
		
		const chartConfigDataCarbs: ChartConfigData = {...initialChartConfigData, carbsChartConfig: {
				subChart: CARBS_DATA_DETAIL,
				showLegend: true,
				chartType: CHART_TYPE_BAR,
				expand100: false,
				hideRemainders: false
			}
		}
		
		chartConfigUriString = makeChartConfigUriString(chartConfigDataCarbs, TAB_CARBS_DATA)
		reconvertedObject = getUpdatedChartConfig(chartConfigDataCarbs, chartConfigUriString, TAB_CARBS_DATA)
		
		expect(reconvertedObject).not.toBe(null)
		expect(reconvertedObject).toMatchObject(chartConfigDataCarbs ? chartConfigDataCarbs : {})		
		
	})
	
	
	it('should correctly convert the whole fooddata panel data into a corresponding URI', () => {
		const foodItemId = 5
		const source = 2
		const portionData: PortionData = {
			portionType: 300,
			amount: 55
		}
				
		const chartConfigData: ChartConfigData = {...initialChartConfigData, lipidsChartConfig: {
				subChart: LIPIDS_DATA_OMEGA,
				chartType: CHART_TYPE_PIE,
				showLegend: false,
				expand100: false,
				hideRemainders: false
			}
		}
		
		const foodItemData: FoodItemUriData = {
			foodItemId: foodItemId,
			source: source,
			portionData: portionData,
			combineData: true,
			supplementData: true
		}
		
		const uriString = makeFoodDataPanelDefaultUri(foodItemData, userData, TAB_LIPIDS_DATA, DISPLAYMODE_CHART, chartConfigData)
		const uriObject = parseFoodDataPanelDefaultUri(uriString, chartConfigData)

		expect(uriObject).not.toBe(null)
		expect(uriObject?.selectedFoodItem).not.toBe(null)
		expect(uriObject?.selectedFoodItem.foodItemId).toBe(foodItemId)
		expect(uriObject?.selectedFoodItem.source).toBe(source)
		expect(uriObject?.selectedFoodItem.portionData).toMatchObject(portionData)
		expect(uriObject?.userData).toMatchObject(userData)
		expect(uriObject?.chartConfigData).toMatchObject(chartConfigData)
		expect(uriObject?.displayMode).toBe(DISPLAYMODE_CHART)
	})


	it('should correctly convert an aggregated fooddata panel item into a corresponding URI', () => {
		const nutrientData: NutrientData = {
			source: makeDefaultSource(),
			sourceItemId: "123",
			baseData: makeDefaultBaseData(),
			carbohydrateData: makeDefaultCarbsData(),
			lipidData: makeDefaultLipidsData(true),
			vitaminData: makeDefaultVitaminData(),
			mineralData: makeDefaultMineralData(),
			proteinData: makeDefaultProteinData()
		}
		
		const foodItem: FoodItem = {
			id: 1,
			nutrientDataList: [nutrientData],
			aggregated: true
		}
		

		const selectedFoodItem: SelectedFoodItem = {
			foodItem: foodItem,
			portion: {
				portionType: 1,
				amount: 937
			},
			combineData: false,
			supplementData: false,
			selectedSource: 1
		}
		
		const chartConfig = {...initialChartConfigData, vitaminData: {
			...initialChartConfigData.vitaminChartConfig, expand100: true
		}}
		
		const uriDataObject: AggregatedFoodItemUriData = {
			selectedFoodItem: selectedFoodItem,
			selectedDataPage: TAB_VITAMIN_DATA,
			chartConfigData: chartConfig,
			userData: userData
		}
		
		const queryString = convertAggregatedDataJsonToUriString(uriDataObject)
		const reconveredObect = convertAggregatedUriStringToObject(chartConfig, queryString)
		
		expect(reconveredObect).not.toBe(null)
		expect(reconveredObect).toMatchObject(uriDataObject)
	
	})
	
	
	it('should correctly convert direct compare data into a corresponding URI', () => {
		const nutrientData1: NutrientData = {
			source: makeDefaultSource(),
			sourceItemId: "123",
			baseData: makeDefaultBaseData(),
			carbohydrateData: makeDefaultCarbsData(),
			lipidData: makeDefaultLipidsData(true),
			vitaminData: makeDefaultVitaminData(),
			mineralData: makeDefaultMineralData(),
			proteinData: makeDefaultProteinData()
		}
		
		const nutrientData2: NutrientData = {...nutrientData1, baseData: {
			...nutrientData1.baseData, water: 12.74
		}}
		
		const selectedFoodItem1: SelectedFoodItem = {
			id: 1000,
			foodItem: {
				id: 1,
				nutrientDataList: [nutrientData1],
			},
			selectedSource: 1,
			combineData: false,
			supplementData: true,
			portion: {
				portionType: 123,
				amount: 450
			}
		}
		
		const selectedFoodItem2: SelectedFoodItem = {
			id: 1001,
			foodItem: {
				id: 2,
				nutrientDataList: [nutrientData2],
			},
			selectedSource: 1,
			combineData: true,
			supplementData: true,
			portion: {
				portionType: 111,
				amount: 20
			}
		}
		
		const uriString = makeDirectCompareDataUri(selectedFoodItem1, selectedFoodItem2, userData, 
			TAB_LIPIDS_DATA, initialDirectCompareConfigData)
		const reconveredObject = parseDirectComparetUri(uriString, initialDirectCompareConfigData)
		
		const expectedFoodItemUri1: FoodItemUriData = {
			foodItemId: 1,
			source: 1,
			portionData: {
				portionType: 123,
				amount: 450
			},
			combineData: false,
			supplementData: true
		}
		
		const expectedFoodItemUri2: FoodItemUriData = {
			foodItemId: 2,
			source: 1,
			portionData: {
				portionType: 111,
				amount: 20
			},
			combineData: true,
			supplementData: true
		}
		
		expect(reconveredObject).not.toBe(null)
		expect(reconveredObject?.selectedFoodItem1).toMatchObject(expectedFoodItemUri1)
		expect(reconveredObject?.selectedFoodItem2).toMatchObject(expectedFoodItemUri2)
	
		expect(reconveredObject?.userData).toMatchObject(userData)
		expect(reconveredObject?.chartConfigData).toMatchObject(initialDirectCompareConfigData)
		expect(reconveredObject?.selectedDataPage).toBe(TAB_LIPIDS_DATA)
	})
	
})

