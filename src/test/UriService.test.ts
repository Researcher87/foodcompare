import { initialChartConfigData } from "../config/ApplicationSetting"
import { CARBS_DATA_DETAIL, CHART_TYPE_BAR, CHART_TYPE_PIE, GRAM, LIPIDS_DATA_OMEGA, SEX_FEMALE, TAB_BASE_DATA, TAB_CARBS_DATA, TAB_LIPIDS_DATA, TAB_VITAMIN_DATA } from "../config/Constants"
import { getPalCategory } from "../service/calculation/EnergyService"
import { getNumberOfFixedLength } from "../service/calculation/MathService"
import { getUpdatedChartConfig, makeChartConfigUriString } from "../service/uri/ChartConfigConverter"
import { convertPortionDataObjectToString, convertPortionDataStringToObject, convertUserDataObjectToString, convertUserDataStringToObject, makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri } from "../service/uri/UriService"
import { ChartConfigData } from "../types/livedata/ChartConfigData"
import { UserData } from "../types/livedata/UserData"
import { PortionData } from "../types/nutrientdata/FoodItem"
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
	
})