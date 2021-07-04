export interface ChartConfigData {
    baseChartConfig: GeneralChartConfigWithDetails
    vitaminChartConfig: BarChartConfig
    mineralChartConfig: BarChartConfig
    lipidsChartConfig: GeneralChartConfigWithSubCharts
    carbsChartConfig: GeneralChartConfigWithSubCharts
    proteinChartConfig: BarChartConfig
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
    expandTo100: boolean
}