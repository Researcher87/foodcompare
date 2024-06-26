import React, {useContext, useEffect, useState} from "react";
import * as Constants from "../../../config/Constants"
import {CARBS_DATA_BASE, CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants"
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartConfigurationService";
import {LanguageContext} from "../../../contexts/LangContext";
import {applicationStrings} from "../../../static/labels";
import {Form} from "react-bootstrap";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {CarbDataChartProps} from "../../../types/livedata/ChartPropsData";
import {GeneralChartConfigDirectCompareWithSubCharts} from "../../../types/livedata/ChartConfigData";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {
    getCarbBaseChartData,
    getCarbDetailsChartData,
    getCarbsBaseLegend,
    getCarbsDetailsLegend
} from "../../../service/chartdata/CarbsChartDataService";

export default function CarbsDataChart(props: CarbDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    let chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
            : initialChartConfigData.carbsChartConfig

    const initialExpand100 = props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.expand100
        : chartConfig.expand100

    const initialHideRemainders = props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.hideRemainders
        : chartConfig.hideRemainders

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [hideRemainders, setShowHideRemainders] = useState<boolean>(initialHideRemainders ? initialHideRemainders : false)
    const [expand100, setExpand100] = useState<boolean>(initialExpand100 ? initialExpand100 : false)
    const [subChart, setSubChart] = useState<string>(chartConfig.subChart ? chartConfig.subChart : CARBS_DATA_BASE)

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setSubChart(chartConfig.subChart ? chartConfig.subChart : CARBS_DATA_BASE)
        }

        updateChartConfig()
    }, [chartType, showLegend, hideRemainders, expand100, subChart, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentConfig = applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
            if (chartType !== currentConfig.chartType
                || subChart !== currentConfig.subChart
                || hideRemainders !== currentConfig.hideRemainders
                || expand100 !== currentConfig.expand100
                || showLegend !== currentConfig.showLegend) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    carbsChartConfig: {
                        chartType: chartType,
                        showLegend: showLegend,
                        hideRemainders: hideRemainders,
                        expand100: expand100,
                        subChart: subChart
                    }
                }
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        } else if (applicationContext) {
            const currentConfig = applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig
            if (hideRemainders !== currentConfig.hideRemainders
                || expand100 !== currentConfig.expand100) {
                applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.expand100 = expand100
                applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.hideRemainders = hideRemainders
            }
        }
    }

    const handleExpand100Change = () => {
        setExpand100(!expand100)
    }

    const handleHideRemaindersCheckbox = () => {
        setShowHideRemainders(!hideRemainders)
    }

    const handleChartSelectionChange = (event: any) => {
        const value = event.target.value

        if (applicationContext && props.directCompareConfig) {
            const currentSettings = applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart

            const carbsChartConfig: GeneralChartConfigDirectCompareWithSubCharts = props.directCompareConfig.chartIndex === 1
                ? {
                    chartType: chartType,
                    showLegend: showLegend,
                    hideRemainders: true,
                    expand100: true,
                    subChart1: event.target.value,
                    subChart2: currentSettings.carbsChartConfig.subChart2
                }
                : {
                    chartType: chartType,
                    showLegend: showLegend,
                    hideRemainders: true,
                    expand100: true,
                    subChart1: currentSettings.carbsChartConfig.subChart1,
                    subChart2: event.target.value
                }

            const newChartConfig = {
                ...currentSettings,
                carbsChartConfig: carbsChartConfig
            }
            applicationContext.setDirectCompareData.updateDirectCompareChartConfig(newChartConfig)
        } else {
            setSubChart(value)
        }
    }

    const createBasicChartData = () => {
        const nutrientData = getNutrientData(props.selectedFoodItem)
        const totalAmount = getNutrientData(props.selectedFoodItem).baseData.carbohydrates;
        const chartDisplayData = getCarbBaseChartData(nutrientData, hideRemainders, totalAmount, lang)

        if (!chartDisplayData) {
            return
        }

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                data: chartDisplayData.values,
                backgroundColor: chartDisplayData.colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const createDetailChartData = () => {
        const nutrientData = getNutrientData(props.selectedFoodItem)
        const totalAmount = getNutrientData(props.selectedFoodItem).baseData.carbohydrates;
        const chartDisplayData = getCarbDetailsChartData(nutrientData, hideRemainders, totalAmount, lang)

        if (!chartDisplayData) {
            return
        }

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                data: chartDisplayData.values,
                backgroundColor: chartDisplayData.colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        };
    }


    const handleRadioButtonClick = (event: any) => {
        const value = event.target.value
        setChartType(value)
    }

    const handleLegendCheckbox = () => {
        setShowLegend(!showLegend)
        setShowLegend(!showLegend)
    }

    const getOptions = () => {
        let title;

        if (subChart === Constants.CARBS_DATA_BASE) {
            title = applicationStrings.label_charttype_carbs_base[lang];
        } else if (subChart === Constants.CARBS_DATA_DETAIL) {
            title = applicationStrings.label_charttype_carbs_detail[lang];
        }

        if (chartType === CHART_TYPE_BAR) {
            return expand100 ? getBarChartOptions(title, "%", 100) : getBarChartOptions(title, "%");
        } else {
            return getPieChartOptions(title, "%");
        }
    }


    const renderChartSelector = () => {
        return (
            <Form>
                <Form.Label>
                    <b>{applicationStrings.label_datatype[lang]}:</b>
                </Form.Label>
                <Form.Check inline={false}
                            className={"form-radiobutton"}
                            label={applicationStrings.label_charttype_carbs_base[lang]}
                            type="radio"
                            value={Constants.CARBS_DATA_BASE}
                            checked={subChart === Constants.CARBS_DATA_BASE}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <Form.Check inline={false}
                            className={"form-radiobutton"}
                            label={applicationStrings.label_charttype_carbs_detail[lang]}
                            type="radio"
                            value={Constants.CARBS_DATA_DETAIL}
                            checked={subChart === Constants.CARBS_DATA_DETAIL}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <hr/>
                <Form.Check inline={false}
                            className="form-radiobutton"
                            label={applicationStrings.checkbox_expand100g[lang]}
                            type="checkbox"
                            disabled={chartType === Constants.CHART_TYPE_PIE}
                            checked={expand100}
                            onChange={handleExpand100Change}>
                </Form.Check>
                <Form.Check inline={false}
                            className="form-radiobutton"
                            label={applicationStrings.checkbox_chartoption_hideRemainders[lang]}
                            type="checkbox"
                            checked={hideRemainders}
                            onChange={handleHideRemaindersCheckbox}>
                </Form.Check>
            </Form>
        )
    }


    const renderChart = (data: any) => {
        const chartClass = props.directCompareUse ? "col-12 chart-area-dc" : "col-12 chart-area"

        if (!data) {
            return (
                <div className={chartClass}>
                    {applicationStrings.label_noData[lang]}
                </div>
            )
        }

        return (
            <div className={chartClass}>
                {chartType === CHART_TYPE_PIE &&
                <Pie data={data}
                     key={'chart carbs'}
                     options={getOptions()}
                />
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar data={data}
                     key={'chart carbs'}
                     options={getOptions()}
                />
                }
            </div>
        );
    }


    const chartColType = chartType === CHART_TYPE_PIE ? "col-6" : "col-8";
    const detailChartData = createDetailChartData()
    const basicChartData = createBasicChartData()

    return (
        <div className="container-fluid">
            <div className="row" key={"carbs container"}>
                <div className="col-3 text-align-center">
                    {renderChartSelector()}
                </div>
                <div className={chartColType}>
                    {subChart === Constants.CARBS_DATA_BASE &&
                    renderChart(basicChartData)
                    }
                    {subChart === Constants.CARBS_DATA_DETAIL &&
                    renderChart(detailChartData)
                    }
                </div>

                {showLegend && chartType === Constants.CHART_TYPE_PIE &&
                <div className="col-3">
                    {subChart === Constants.CARBS_DATA_BASE && basicChartData &&
                    <CustomLegend legendData={getCarbsBaseLegend(basicChartData.labels, lang)}/>
                    }
                    {subChart === Constants.CARBS_DATA_DETAIL && detailChartData &&
                    <CustomLegend legendData={getCarbsDetailsLegend(detailChartData.labels, lang)}/>
                    }
                </div>
                }
            </div>
            {!props.directCompareConfig &&
            <div className="row chart-control-button-bar">
                <PieChartConfigurationForm chartType={chartType}
                                           showLegend={showLegend}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckbox}/>

            </div>
            }
        </div>
    );


}