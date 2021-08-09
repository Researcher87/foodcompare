import { initialChartConfigData } from "../config/ApplicationSetting"
import { CARBS_DATA_DETAIL, CHART_TYPE_BAR, CHART_TYPE_PIE, GRAM, LIPIDS_DATA_OMEGA, TAB_BASE_DATA, TAB_CARBS_DATA, TAB_LIPIDS_DATA, TAB_VITAMIN_DATA } from "../config/Constants"

import { getUpdatedChartConfig, makeChartConfigUriString } from "../service/uri/ChartConfigConverter"
import { convertAggregatedDataJsonToUriString, convertAggregatedUriStringToObject } from "../service/uri/FoodDataPanelAggregatedUriService"
import { convertPortionDataObjectToString, convertPortionDataStringToObject, convertUserDataObjectToString, convertUserDataStringToObject, makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri } from "../service/uri/FoodDataPanelUriService"
import { ChartConfigData } from "../types/livedata/ChartConfigData"
import SelectedFoodItem from "../types/livedata/SelectedFoodItem"
import { UriData } from "../types/livedata/UriData"
import FoodItem, { NutrientData, PortionData } from "../types/nutrientdata/FoodItem"
import { userData } from "./TestHelper"

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
				chartType: CHART_TYPE_BAR
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
				showLegend: false
			}
		}
		
		const uriString = makeFoodDataPanelDefaultUri(foodItemId, source, portionData, userData, true, false, TAB_LIPIDS_DATA, chartConfigData)
		const uriObject = parseFoodDataPanelDefaultUri(uriString, chartConfigData)
		
		expect(uriObject).not.toBe(null)
		expect(uriObject?.foodItemId).toBe(foodItemId)
		expect(uriObject?.source).toBe(source)
		expect(uriObject?.portionData).toMatchObject(portionData)
		expect(uriObject?.userData).toMatchObject(userData)
		expect(uriObject?.chartConfigData).toMatchObject(chartConfigData)
	})


	it('should correctly convert an aggregated fooddata panel item into a corresponding URI', () => {
		const nutrientData: NutrientData = {
			source: {
				id: 1,
				name: "dummy",
				url: "www.dummy.co"
			},
			sourceItemId: "123",
			baseData: {
				energy: 12.5,
				water: 14,
				lipids: 30,
				carbohydrates: 20,
				proteins: 5,
				ash: 7,
				alcohol: null,
				dietaryFibers: 0.7
			},
			carbohydrateData: {
				sugar: 0.8,
				fructose: 0.001233212,
				glucose: 0.08123882,
				maltose: null,
				sucrose: null,
				lactose: null,
				galactose: null,
				starch: 0
			},
			lipidData: {
				saturated: 0.8,
				unsaturatedMono: 1.9,
				unsaturatedPoly: 0.2,
				transFattyAcids: null,
				omegaData: null,
				cholesterol: 0.02
			},
			vitaminData: {
				a: 0.1,
				b1: 0.0000232,
				b2: 0.0023122,
				b3: null,
				b5: null,
				b6: 1.89,
				b7: null,
				b9: 2.20,
				b12: 0,
				c: 13.839932,
				d: null,
				e: 9.872721221,
				k: 0.0762
			},
			mineralData: {
				calcium: 0.9883,
				copper: 23.883773,
				iron: 9.827271902,
				magnesium: 0.8721,
				manganese: null,
				phosphorus: 3.34432321,
				potassium: 1.1123883,
				selenium: null,
				sodium: null,
				zinc: 9.98822992
			},
			proteinData: {
				tryptophan: 1.28388337,
				threonine: null,
				isoleucine: null,
				leucine: null,
				lysine: 0.0383873,
				methionine: null,
				cystine: null,
				phenylalanine: null,
				tyrosine: null,
				valine: null,
				arginine: null,
				histidine: null,
				alanine: null,
				asparticAcid: 2.22993821,
				glutamicAcid: null,
				glycine: null,
				proline: null,
				serine: null,
			}
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
		
		const uriDataObject: UriData = {
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
})