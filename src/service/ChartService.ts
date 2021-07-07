/**
 * Returns a default-styled configuration for a bar chart.
 *
 * title: The charts title.
 * unit: The unit to use for the axis title and tooltip.
 * minYValue: Optional, a pre-defined maxYValue for the Y axis (e.g. 100)
 */
import {shortenName} from "./nutrientdata/NameTypeService";
import {formatNumber} from "chart.js/helpers";

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
    return getOptions(title, unit, scales);
}


export function getPieChartOptions(title: string, unit: string) {
    return getOptions(title, unit);
}


export function roundToNextValue(chartMaxValue: number) {

    const roundUp = (value: number, multiple: number) => {
        const remainder = value % multiple
        if(remainder === 0) {
            return value
        } else {
            return value + multiple - remainder
        }
    }

    let multiple
    if(chartMaxValue < 0.2) {
        multiple = 0.1
    } else if(chartMaxValue < 0.5) {
        multiple = 0.2
    } else if(chartMaxValue < 1) {
        multiple = 0.5
    } else if(chartMaxValue < 2) {
        multiple = 1
    } else if(chartMaxValue < 5) {
        multiple = 2
    } else if(chartMaxValue < 10) {
        multiple = 5
    } else if(chartMaxValue < 20) {
        multiple = 10
    } else if(chartMaxValue < 50) {
        multiple = 20
    } else if(chartMaxValue < 100) {
        multiple = 50
    } else if(chartMaxValue < 200) {
        multiple = 100
    } else if(chartMaxValue < 500) {
        multiple = 200
    } else if(chartMaxValue < 1000) {
        multiple = 500
    } else if(chartMaxValue < 2000) {
        multiple = 1000
    } else if(chartMaxValue < 5000) {
        multiple = 2000
    } else if(chartMaxValue < 10000) {
        multiple = 5000
    } else if(chartMaxValue < 20000) {
        multiple = 10000
    } else if(chartMaxValue < 50000) {
        multiple = 20000
    } else if(chartMaxValue < 100000) {
        multiple = 50000
    } else if(chartMaxValue < 200000) {
        multiple = 100000
    } else {
        multiple = 200000
    }

    // Add 1 % buffer to the maximum value
    chartMaxValue = chartMaxValue * 1.01

    return roundUp(chartMaxValue, multiple)
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
            display: true,
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