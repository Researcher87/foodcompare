import SelectedFoodItem from "./SelectedFoodItem";

// BASIC CHARTS COMPONENTS:

export interface ChartProps {
    selectedFoodItem: SelectedFoodItem
    directCompareUse?: boolean
}

export interface ChartPanelProps extends ChartProps {
    selectedDataTab: string
}

export interface BaseDataChartProps extends ChartProps {
    directCompareConfig?: {
        chartType: string,
        showLegend: boolean,
        showDetails: boolean
    }
}

export interface LipidsDataChartProps extends ChartProps {
    directCompareConfig?: PieChartDirectCompareConfig
}

export interface CarbDataChartProps extends ChartProps {
    directCompareConfig?: PieChartDirectCompareConfig
}

export interface ProteinDataChartProps extends ChartProps {
    directCompareUse?: boolean
    directCompareConfig?: BarChartDirectCompareConfig
}

export interface MineralVitaminChartProps extends ChartProps {
    selectedSubChart: string
    directCompareUse?: boolean
    directCompareConfig?: BarChartDirectCompareConfig
}


export interface BarChartDirectCompareConfig {
    maxValue?: number,
    portionType: string,
    expand100: boolean,
    barChartColor: string
}

export interface PieChartDirectCompareConfig {
    chartType: string,
    showLegend: boolean
    subChart: string
    chartIndex?: number
}


// DIRECT COMPARE CHARTS COMPONENTS:

export interface DirectCompareDataPanelProps {
    selectedFoodItem1: SelectedFoodItem
    selectedFoodItem2: SelectedFoodItem
}

export interface DC_MineralVitaminChartProps extends DirectCompareDataPanelProps {
    selectedSubChart: string
}

export interface PieChartDirectCompareProp extends DirectCompareDataPanelProps {
    chartType: string
}
