import ReactSelectOption from "../ReactSelectOption";

export interface ChartConfigData {
    baseChartConfig: GeneralChartConfigWithDetails
    vitaminChartConfig: BarChartConfig
    mineralChartConfig: BarChartConfig
    lipidsChartConfig: GeneralChartConfigWithSubCharts
    carbsChartConfig: GeneralChartConfigWithSubCharts
    proteinChartConfig: BarChartConfig
    energyChartConfig: GeneralChartConfig
}

export interface DirectCompareChartConfigData {
    baseChartConfig: GeneralChartConfigWithDetails
    vitaminChartConfig: DirectCompareBarChartConfig
    mineralChartConfig: DirectCompareBarChartConfig
    lipidsChartConfig: GeneralChartConfigDirectCompareWithSubCharts
    carbsChartConfig: GeneralChartConfigDirectCompareWithSubCharts
    proteinChartConfig: DirectCompareBarChartConfig
    energyChartConfig: GeneralChartConfig
}

export interface GeneralChartConfig {
    chartType: string
    showLegend: boolean
}

export interface GeneralChartConfigWithDetails extends GeneralChartConfig {
    showDetails: boolean
}

export interface GeneralChartConfigWithSubCharts extends GeneralChartConfig {
    subChart: string
    expand100: boolean
    hideRemainders: boolean
}

export interface GeneralChartConfigDirectCompareWithSubCharts extends GeneralChartConfig {
    subChart1: string
    subChart2: string
    hideRemainders: boolean
    expand100: boolean
}

export interface BarChartConfig {
    portionType: string
    expand100: boolean
}

export interface DirectCompareBarChartConfig extends BarChartConfig {
    synchronize: boolean
}

export interface JuxtapositionConfig {
    selectedGroup: ReactSelectOption | null,
    selectedComparisonReference: ReactSelectOption | null,
    chartSize: number,
    showLabels: boolean
}

// For URI String
export interface GeneralizedChartConfig {
	chartType?: string
	showLegend?: boolean
	showDetails?: boolean
	expand100?: boolean
	portionType?: string
	subChart?: string
	subChart2?: string,
	synchronize?: boolean
    hideRemainders?: boolean
}