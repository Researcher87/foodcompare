import {isMobileDevice, WindowDimension} from "./WindowDimension";
import {
    basedata_piechart_width,
    basedata_piechart_width_m, datapanel_container_min_width, datapanel_container_min_width_m,
    default_chart_height,
    default_chart_height_m
} from "../config/ChartConfig";
import {TAB_BASE_DATA} from "../config/Constants";

export function calculateChartHeight(currentDimension: WindowDimension, directCompare?: boolean, dataPage?: string): number {
    const mobile = isMobileDevice()

    // Mobile devices don't need to be regarded in direct compare menu, as the functionality is disabled
    if(directCompare) {
        return currentDimension.height / 3
    } else {
        return dataPage === TAB_BASE_DATA
            ? mobile
                ? basedata_piechart_width_m
                : basedata_piechart_width
            : mobile
                ? default_chart_height_m
                : default_chart_height
    }
}

export function calculateChartContainerHeight(currentDimension: WindowDimension, directCompare?: boolean): number {
    return directCompare === true
        ? calculateChartHeight(currentDimension, directCompare) + 24
        : calculateChartHeight(currentDimension, directCompare) + 10
}

export function calculateMinimalDataPanelWidth() {
    return isMobileDevice() ? datapanel_container_min_width_m : datapanel_container_min_width
}
