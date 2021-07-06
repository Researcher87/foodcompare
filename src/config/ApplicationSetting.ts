import {AMOUNT_PORTION, CARBS_DATA_BASE, CHART_TYPE_PIE, LIPIDS_DATA_BASE, SEX_MALE} from "./Constants";
import {ChartConfigData} from "../types/livedata/ChartConfigData";

export const release = "1.0.2"
export const buildDate = "2021-07-02"

export const minimalOmegaRatio = 0.3
export const maximalPortionSize = 5000
export const defaultPanelHeight = '468px'

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
        expandTo100: false
    },
    mineralChartConfig: {
        portionType: AMOUNT_PORTION,
        expandTo100: false
    },
    lipidsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: true,
        subChart: LIPIDS_DATA_BASE
    },
    carbsChartConfig: {
        chartType: CHART_TYPE_PIE,
        showLegend: true,
        subChart: CARBS_DATA_BASE
    },
    proteinChartConfig: {
        portionType: AMOUNT_PORTION,
        expandTo100: false
    }
}