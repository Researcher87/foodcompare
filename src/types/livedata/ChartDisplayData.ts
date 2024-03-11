export interface ChartDisplayData {
    labels: string[],
    values: number[],
    colors?: string[]
}

export interface LegendData {
    item: string
    color: string
    separateNextElement?: boolean
    indent?: number
}