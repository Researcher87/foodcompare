import SelectedFoodItem from "./SelectedFoodItem";

// BASIC CHARTS COMPONENTS:

export interface ChartProps {
    selectedFoodItem: SelectedFoodItem
    directCompareUse?: boolean
    displayMode?: string
}

export interface BaseDataChartProps extends ChartProps {
    directCompareConfig?: PieChartDirectCompareConfig
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
    precalculatedData?: any
}

export interface MineralVitaminChartProps extends ChartProps {
    selectedSubChart: string
    directCompareUse?: boolean
    directCompareConfig?: BarChartDirectCompareConfig
    precalculatedData?: any
}

export interface JuxtapositionChartProps extends ChartProps {
    selectedGroup: number,
    selectedReference: number
}

export interface BarChartDirectCompareConfig {
    maxValue?: number,
    portionType: string,
    expand100: boolean,
    barChartColor: string,
    synchronize?: boolean
    hideRemainders?: boolean
}

export interface PieChartDirectCompareConfig {
    chartType: string,
    showLegend: boolean
    showDetails?: boolean
    hideRemainders?: boolean
    expand100?: boolean
    subChart?: string
    chartIndex?: number
    handleSubchartChange?: (event: any) => void
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
    dataPage: string
}

export interface PieChartConfigurationProps {
    chartType: string
    showLegend: boolean
    showDetails?: boolean
    detailsCheckboxAvailable?: boolean
    handleRadioButtonClick: (event: any) => void
    handleLegendCheckboxClick: () => void
    handleDetailsCheckboxClick?: () => void
}

export interface BarChartConfigurationProps {
    selectedFoodItem?: SelectedFoodItem
    portionType: string
    expand100: boolean
    synchronize?: boolean
    handleRadioButtonClick: (event: any) => void
    handleExpandCheckboxClick: () => void
    handleSynchronize?: () => void
}