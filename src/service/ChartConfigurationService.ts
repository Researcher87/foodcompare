/**
 * Returns a default-styled configuration for a bar chart.
 *
 * title: The charts title.
 * unit: The unit to use for the axis title and tooltip.
 * minYValue: Optional, a pre-defined maxYValue for the Y axis (e.g. 100)
 */
import {shortenName} from "./nutrientdata/NameTypeService";

export function getBarChartOptions(title: string, unit: string, maxYValue?: number | undefined) {
    let yAxis: any = {
        title: {
            display: true,
            text: unit
        }
    }

    if(maxYValue) {
        yAxis = {...yAxis, min: 0, max: maxYValue}
    }

    const scalesObject = {y: yAxis}
    return getOptions(title, unit, scalesObject);
}


export function getBarChartOptionsForRanking(title: string, unit: string) {
    const scales = getScalesForRankingChart(unit);
    const fullTitle = `${title} (${unit})`
    return getOptions(fullTitle, unit, scales);
}


export function getPieChartOptions(title: string, unit: string) {
    return getOptions(title, unit);
}


function getOptions(title: string, unit: string, scalesObject?: any | undefined) {
    const titleObj = title ? {display: true, text: title, fontSize: 18} : null;

    let options: any = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: titleObj,
            tooltip: getToolTips(unit),
            legend: {
                display: false
            },
        }
    }

    if (scalesObject !== undefined) {
        options = {...options, scales: scalesObject}
    }

    return options;
}

function getToolTips(unit: string) {
    return {
        enabled: true,
        maintainAspectRatio: true,
        callbacks: {
            label: tooltipItem => `${tooltipItem.label}: ${tooltipItem.formattedValue} ${unit}`
        }
    };
}


function getScalesForRankingChart(unit: string) {
    let scaleLabel: any | null = null;

    if (unit) {
        scaleLabel = {
            display: false,
            labelString: unit
        }
    }

    let axesObj = {};
    if (scaleLabel) {
        axesObj["scaleLabel"] = scaleLabel;
    }

    const yAxes = [axesObj];

    const scales = {
        yAxes: yAxes,
        xAxes: [{
            ticks: {
                autoSkip: false,
                callback: function (value, index, values) {
                    return shortenName(value, 24);
                }
            }
        }]
    };

    return scales;
}