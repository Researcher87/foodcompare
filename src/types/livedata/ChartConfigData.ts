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
}

interface GeneralChartConfig {
    chartType: string
    showLegend: boolean
}

interface GeneralChartConfigWithDetails extends GeneralChartConfig {
    showDetails: boolean
}

interface GeneralChartConfigWithSubCharts extends GeneralChartConfig {
    subChart: string
}

interface BarChartConfig {
    portionType: string
    expand100: boolean
}

interface DirectCompareBarChartConfig extends BarChartConfig{
    synchronize: boolean
}