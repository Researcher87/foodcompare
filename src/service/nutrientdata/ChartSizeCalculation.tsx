import {WindowDimension} from "../WindowDimension";
import {basedata_piechart_width, default_chart_height} from "../../config/ChartConfig";
import {TAB_BASE_DATA} from "../../config/Constants";

export function calculateChartHeight(currentDimension: WindowDimension, directCompare?: boolean, dataPage?: string): number {
    return directCompare === true
        ? currentDimension.height / 3
        : dataPage === TAB_BASE_DATA
            ? basedata_piechart_width
            : default_chart_height
}

export function calculateChartContainerHeight(currentDimension: WindowDimension, directCompare?: boolean): number {
    return directCompare === true
        ? calculateChartHeight(currentDimension, directCompare) + 24
        : calculateChartHeight(currentDimension, directCompare) + 10
}
