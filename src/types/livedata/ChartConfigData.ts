export interface ChartConfigData {
    baseChartConfig: GeneralChartConfigWithDetails
    vitaminChartConfig: BarChartConfig
    mineralChartConfig: BarChartConfig
    lipidsChartConfig: GeneralChartConfigWithSubCharts
    carbsChartConfig: GeneralChartConfigWithSubCharts
    proteinChartConfig: BarChartConfig
}

export interface DirectCompareChartConfigData {
    baseChartConfig: GeneralChartConfigWithDetails
    vitaminChartConfig: DirectCompareBarChartConfig
    mineralChartConfig: DirectCompareBarChartConfig
    lipidsChartConfig: GeneralChartConfigDirectCompareWithSubCharts
    carbsChartConfig: GeneralChartConfigDirectCompareWithSubCharts
    proteinChartConfig: DirectCompareBarChartConfig
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
}

export interface GeneralChartConfigDirectCompareWithSubCharts extends GeneralChartConfig {
    subChart1: string
    subChart2: string
}

export interface BarChartConfig {
    portionType: string
    expand100: boolean
}

export interface DirectCompareBarChartConfig extends BarChartConfig {
    synchronize: boolean
}