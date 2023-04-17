import {AMOUNT_PORTION, CARBS_DATA_BASE, CHART_TYPE_PIE, LIPIDS_DATA_BASE, SEX_MALE} from "./Constants";
import {ChartConfigData, DirectCompareChartConfigData} from "../types/livedata/ChartConfigData";
import {WindowDimension} from "../service/WindowDimension";

export const release = "1.6"
export const buildDate = "2023-04-01"

export const maxMessageCharacters = 5000
export const maxElementsInRankingChart = 50

// The food class to be initially displayed in the food selector
export const initialFoodClassId = 1

// The food class to be initially displayed as the comparator in the direct comparison menu (second element)
export const initialComparisonFoodClassId = 7

export const minimalOmegaRatio = 0.3
export const maximalPortionSize = 5000
export const defaultPanelHeight = '468px'

export const smallFormsScreenSize: WindowDimension = {
    width: 1200,
    height: 800
}

export const initialUserDataAge = 35
export const initialUserDataSize = 175
export const initialUserDataWeight = 75
export const initialUserDataSex = SEX_MALE
export const initialUserDataPregnant = false
export const initialUserDataBreastfeeding = false
export const initialUserDataPalValue = 1.6
export const initialUserDataLeisureSports = false

export const initialChartConfigData: ChartConfigData = {
    baseChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: true,
        showDetails: false
    },
    vitaminChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false
    },
    mineralChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false
    },
    lipidsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: true,
        hideRemainders: false,
        subChart: LIPIDS_DATA_BASE,
        expand100: false
    },
    carbsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: true,
        subChart: CARBS_DATA_BASE,
        hideRemainders: false,
        expand100: false
    },
    proteinChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false
    }
}

export const initialDirectCompareConfigData: DirectCompareChartConfigData = {
    baseChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: false,
        showDetails: false
    },
    vitaminChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false,
        synchronize: true
    },
    mineralChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false,
        synchronize: true
    },
    lipidsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: false,
        hideRemainders: false,
        expand100: false,
        subChart1: LIPIDS_DATA_BASE,
        subChart2: LIPIDS_DATA_BASE
    },
    carbsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: false,
        hideRemainders: false,
        expand100: false,
        subChart1: CARBS_DATA_BASE,
        subChart2: CARBS_DATA_BASE
    },
    proteinChartConfig: {
        portionType: AMOUNT_PORTION,
        expand100: false,
        synchronize: true
    }
}