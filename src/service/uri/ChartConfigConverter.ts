import { AMOUNT_PORTION, CARBS_DATA_BASE, CARBS_DATA_DETAIL, CHART_TYPE_BAR, CHART_TYPE_PIE, GRAM, LIPIDS_DATA_BASE, LIPIDS_DATA_OMEGA, TAB_BASE_DATA, TAB_CARBS_DATA, TAB_LIPIDS_DATA, TAB_MINERAL_DATA, TAB_PROTEINS_DATA, TAB_VITAMIN_DATA } from "../../config/Constants"
import { ChartConfigData, GeneralizedChartConfig } from "../../types/livedata/ChartConfigData"
import { convertBooleanToDigit, convertStringToBoolean } from "../calculation/MathService"

/**
 * Converts/encodes a chart config data sub-element into the corresponding URI query string.
 */
export function makeChartConfigUriString(chartConfigData: ChartConfigData, selectedDataPage: string): string {
	let chartObject: any
	switch(selectedDataPage) {
		case TAB_BASE_DATA:
			chartObject = chartConfigData.baseChartConfig
			break
		case TAB_LIPIDS_DATA:
			chartObject = chartConfigData.lipidsChartConfig
			break
		case TAB_CARBS_DATA:
			chartObject = chartConfigData.carbsChartConfig
			break
		case TAB_VITAMIN_DATA:
			chartObject = chartConfigData.vitaminChartConfig
			break
		case TAB_MINERAL_DATA:
			chartObject = chartConfigData.mineralChartConfig
			break
		case TAB_PROTEINS_DATA:
			chartObject = chartConfigData.proteinChartConfig
			break
		default:
			chartObject = {}
	}
	
	const generalizedChartConfig = makeGeneralizedChartConfig(chartObject)
	return convertGeneralizedChartConfigToString(generalizedChartConfig)
}


/**
 * Converts/decodes a URI query string to get the encoded chart config data of the currently selected data page.
 * The resulting chart config will be added to the existing chart configuration data object passed to this method.
 */
export function getUpdatedChartConfig(chartConfigData: ChartConfigData, chartConfigUriString: string, selectedDataPage: string): ChartConfigData {
	const chartConfigFromUri = convertGeneralizedChartConfigStringToObject(chartConfigUriString)
	const {chartType, expand100, showDetails, showLegend, portionType, subChart} = chartConfigFromUri
	
	if(selectedDataPage === TAB_BASE_DATA) {
		if(!chartType || showLegend === undefined || showDetails === undefined) {
			return chartConfigData
		}

		return {...chartConfigData, baseChartConfig: {
				chartType: chartType,
				showLegend: showLegend,
				showDetails: showDetails
			}
		}
	}
	
	if(selectedDataPage === TAB_LIPIDS_DATA) {
		if(!chartType || showLegend === undefined || subChart === undefined) {
			return chartConfigData
		}

		return {...chartConfigData, lipidsChartConfig: {
				chartType: chartType,
				showLegend: showLegend,
				subChart: subChart
			}
		}
	}
	
	if(selectedDataPage === TAB_CARBS_DATA) {
		if(!chartType || showLegend === undefined || subChart === undefined) {
			return chartConfigData
		}

		return {...chartConfigData, carbsChartConfig: {
				chartType: chartType,
				showLegend: showLegend,
				subChart: subChart
			}
		}
	}
	
	if(selectedDataPage === TAB_VITAMIN_DATA || selectedDataPage === TAB_MINERAL_DATA || selectedDataPage === TAB_PROTEINS_DATA) {
		if(portionType === undefined || expand100 === undefined) {
			return chartConfigData
		}

		const barChartConfig = {
				portionType: portionType,
				expand100: expand100,
			}

		if(selectedDataPage === TAB_VITAMIN_DATA) {
			return {...chartConfigData, vitaminChartConfig: barChartConfig}
		}

		if(selectedDataPage === TAB_MINERAL_DATA) {
			return {...chartConfigData, mineralChartConfig: barChartConfig}
		}
		
		if(selectedDataPage === TAB_PROTEINS_DATA) {
			return {...chartConfigData, proteinChartConfig: barChartConfig}
		}

	}
	
	return chartConfigData
}

export function makeGeneralizedChartConfig(chartObject: any): GeneralizedChartConfig {
	const generalizedChartObject: GeneralizedChartConfig = {}
	if(chartObject.chartType) {
		generalizedChartObject.chartType = chartObject.chartType
	}
	
	if(chartObject.expand100) {
		generalizedChartObject.expand100 = chartObject.expand100
	}
	
	if(chartObject.showDetails) {
		generalizedChartObject.showDetails = chartObject.showDetails
	}
	
	if(chartObject.showLegend) {
		generalizedChartObject.showLegend = chartObject.showLegend
	}
	
	if(chartObject.portionType) {
		generalizedChartObject.portionType = chartObject.portionType
	}

	if(chartObject.subChart) {
		generalizedChartObject.subChart = chartObject.subChart
	}
	
	return generalizedChartObject
}


export function convertGeneralizedChartConfigToString(chartObject: GeneralizedChartConfig) {
	const {chartType, expand100, showDetails, showLegend, portionType, subChart} = chartObject
	
	const chartTypeKey = chartType === undefined || chartType === null ? 0 : chartType === CHART_TYPE_PIE ? 1 : 2
	const portionTypeKey = portionType === undefined || portionType === null ? 0 : portionType === AMOUNT_PORTION ? 1 : 2			
								
	const expand100Key = expand100 ? convertBooleanToDigit(expand100) : 0
	const showLegendKey = showLegend ? convertBooleanToDigit(showLegend) : 0
	const showDetailsKey = showDetails ? convertBooleanToDigit(showDetails) : 0
	
	const subChartKey = subChart ? getSubChartKey(subChart) : 0
	
	return `${chartTypeKey}${portionTypeKey}${expand100Key}${showLegendKey}${showDetailsKey}${subChartKey}`
}


export function convertGeneralizedChartConfigStringToObject(uriString: string): GeneralizedChartConfig {
	if(!uriString) {
		return {}
	}
	
	const stringToParse = uriString.trim()
	if(stringToParse.length !== 6) {
		return {}
	}
	
	const chartTypeKey = stringToParse.substring(0, 1)
	const portionTypeKey = stringToParse.substring(1, 2)
	const expand100Key = stringToParse.substring(2, 3)
	const showLegendKey = stringToParse.substring(3, 4)
	const showDetailsKey = stringToParse.substring(4, 5)
	const subChartKey = stringToParse.substring(5, 6)
	
	const chartTypeNumber = parseInt(chartTypeKey)
	const portionTypeNumber = parseInt(portionTypeKey)
	const subChartNumber = parseInt(subChartKey)
		
	const chartType = chartTypeNumber === 0 || isNaN(chartTypeNumber) 
						? undefined 
						: chartTypeNumber === 1 ? CHART_TYPE_PIE : CHART_TYPE_BAR
						
	const portionType = portionTypeNumber === 0 || isNaN(portionTypeNumber) 
						? undefined 
						: portionTypeNumber === 1 ? AMOUNT_PORTION : GRAM
	
	const subChart = chartTypeNumber === 0 || isNaN(chartTypeNumber) ? undefined : getSubChartFromKey(subChartNumber)
	
	return {
		chartType: chartType,
		portionType: portionType,
		expand100: convertStringToBoolean(expand100Key),
		showLegend: convertStringToBoolean(showLegendKey),
		showDetails: convertStringToBoolean(showDetailsKey),
		subChart: subChart ? subChart : undefined
	}
	
}


export function getSubChartKey(subChart: string): number {
	switch(subChart) {
		case CARBS_DATA_BASE:
			return 1
		case CARBS_DATA_DETAIL:
			return 2
		case LIPIDS_DATA_BASE:
			return 3
		case LIPIDS_DATA_OMEGA:
			return 4
		default:
			return 0
	}
}

export function getSubChartFromKey(key: number): string | null {
	switch(key) {
		case 1:
			return CARBS_DATA_BASE
		case 2:
			return CARBS_DATA_DETAIL
		case 3:
			return LIPIDS_DATA_BASE
		case 4:
			return LIPIDS_DATA_OMEGA
		default:
			return null
	}		
}
