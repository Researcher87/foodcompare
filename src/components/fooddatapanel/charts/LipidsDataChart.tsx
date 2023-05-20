import {useContext, useEffect, useState} from "react";

import {default_chart_height} from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CHART_TYPE_BAR, CHART_TYPE_PIE, LIPIDS_DATA_BASE} from "../../../config/Constants"
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartConfigurationService";
import {LanguageContext} from "../../../contexts/LangContext";
import {applicationStrings} from "../../../static/labels";
import {OmegaData} from "../../../types/nutrientdata/FoodItem";
import {initialChartConfigData, minimalOmegaRatio} from "../../../config/ApplicationSetting";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {Form} from "react-bootstrap";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LipidsDataChartProps} from "../../../types/livedata/ChartPropsData";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/ChartSizeCalculation";
import {useWindowDimension} from "../../../service/WindowDimension";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {
    getLipidsBaseChartLegend,
    getLipidsOmegaChartLegend,
    getOmegaChartData,
    getTotalLipidsChartData
} from "../../../service/chartdata/LipidsChartDataService";

export default function LipidsDataChart(props: LipidsDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    const chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.lipidsChartConfig
            : initialChartConfigData.lipidsChartConfig

    const initialExpand100 =  props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.expand100
        : chartConfig.expand100

    const initialHideRemainders =  props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.hideRemainders
        : chartConfig.hideRemainders

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [hideRemainders, setShowHideRemainders] = useState<boolean>(initialHideRemainders ? initialHideRemainders : false)
    const [expand100, setExpand100] = useState<boolean>(initialExpand100 ? initialExpand100 : false)
    const [subChart, setSubChart] = useState<string>(chartConfig.subChart ? chartConfig.subChart : LIPIDS_DATA_BASE)
    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setSubChart(chartConfig.subChart ? chartConfig.subChart : LIPIDS_DATA_BASE)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
        updateChartConfig()
    }, [chartType, showLegend, hideRemainders, expand100, subChart, chartHeight, windowSize, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentConfig = applicationContext.applicationData.foodDataPanel.chartConfigData.lipidsChartConfig
            if (chartType !== currentConfig.chartType
                || hideRemainders !== currentConfig.hideRemainders
                || expand100 !== currentConfig.expand100
                || subChart !== currentConfig.subChart
                || showLegend !== currentConfig.showLegend) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    lipidsChartConfig: {
                        chartType: chartType,
                        showLegend: showLegend,
                        subChart: subChart,
                        hideRemainders: hideRemainders,
                        expand100: expand100
                    }
                }
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        } else if(applicationContext) {
            const currentConfig = applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig
            if (hideRemainders !== currentConfig.hideRemainders
                || expand100 !== currentConfig.expand100) {
                applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.expand100 = expand100
                applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.hideRemainders = hideRemainders
            }
        }
    }

    const totalLipidsAmount = getNutrientData(props.selectedFoodItem).baseData.lipids;

    const handleChartSelectionChange = (event: any) => {
        const value = event.target.value
        if (props.directCompareConfig && props.directCompareConfig.handleSubchartChange) {
            props.directCompareConfig.handleSubchartChange(event)
        } else {
            setSubChart(value)
        }
    }

    const handleExpand100Change = () => {
        setExpand100(!expand100)
    }

    const handleHideRemaindersCheckbox = () => {
        setShowHideRemainders(!hideRemainders)
    }

    const createTotalChartData = (totalAmount: number): any => {
        const chartDisplayData  = getTotalLipidsChartData(lipidData, hideRemainders, totalAmount, lang)

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


    const createOmegaChartData = (totalAmount: number, omegaData: OmegaData) => {
        const chartDisplayData = getOmegaChartData(omegaData, hideRemainders, totalAmount, lang)
        if(!chartDisplayData) {
            return null
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
        setChartType(event.target.value)
    }

    const handleLegendCheckbox = () => {
        setShowLegend(!showLegend)
    }

    const lipidData = getNutrientData(props.selectedFoodItem).lipidData;

    let omegaDataAvailabe = false
    if (lipidData.omegaData && lipidData.omegaData.uncertainRatio && lipidData.omegaData.uncertainRatio <= minimalOmegaRatio) {
        omegaDataAvailabe = true
    }

    const chartColType = chartType === CHART_TYPE_PIE ? "col-6" : "col-8";

    const getOptions = () => {
        let title;

        if (subChart === Constants.LIPIDS_DATA_BASE) {
            title = applicationStrings.label_charttype_lipids_base_title[lang]
        } else if (subChart === Constants.LIPIDS_DATA_OMEGA) {
            title = applicationStrings.label_charttype_lipids_omega_title[lang];
        }

        if (chartType === CHART_TYPE_BAR) {
            return expand100 ? getBarChartOptions(title, "%", 100) : getBarChartOptions(title, "%");
        } else {
            return getPieChartOptions(title, "%");
        }
    }

    const renderChartSelector = () => {
        return (
            <div>
                <Form>
                    <Form.Label>
                        <b>{applicationStrings.label_datatype[languageContext.language]}:</b>
                    </Form.Label>
                    <Form.Check inline={false}
                                className="form-radiobutton"
                                label={applicationStrings.label_charttype_lipids_base[lang]}
                                type="radio"
                                value={Constants.LIPIDS_DATA_BASE}
                                checked={subChart === Constants.LIPIDS_DATA_BASE}
                                onChange={handleChartSelectionChange}>
                    </Form.Check>
                    <Form.Check inline={false}
                                className="form-radiobutton"
                                label={applicationStrings.label_charttype_lipids_omega[lang]}
                                type="radio"
                                value={Constants.LIPIDS_DATA_OMEGA}
                                checked={subChart === Constants.LIPIDS_DATA_OMEGA}
                                onChange={handleChartSelectionChange}>
                    </Form.Check>
                </Form>
                <hr/>
                <Form>
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
                                disabled={subChart === Constants.LIPIDS_DATA_OMEGA}
                                checked={hideRemainders}
                                onChange={handleHideRemaindersCheckbox}>
                    </Form.Check>
                </Form>
            </div>
        )
    }

    const renderChart = (lipidsType) => {
        const {saturated, unsaturatedMono, unsaturatedPoly, omegaData} = lipidData

        let data
        if (lipidsType === Constants.LIPIDS_DATA_BASE) {
            if (!saturated || !unsaturatedMono || !unsaturatedPoly) {
                return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
            }
            data = createTotalChartData(totalLipidsAmount);
        } else if (lipidsType === Constants.LIPIDS_DATA_OMEGA) {
            if (omegaData) {
                data = createOmegaChartData(totalLipidsAmount, omegaData)
            }

            if (!omegaData) {
                return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
            }
        }

        if (!data) {
            return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
        }

        return (
            <div>
                {chartType === CHART_TYPE_PIE &&
                <Pie data={data}
                     key={'chart ' + chartHeight}
                     height={chartHeight}
                     options={getOptions()}
                />
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar data={data}
                     key={'chart ' + chartHeight}
                     height={chartHeight}
                     options={getOptions()}
                />
                }
            </div>
        );
    }


    //const height = props.directCompareUse === true ? direct_compare_chartheight : default_chart_height
    const containerHeight = calculateChartContainerHeight(windowSize, props.directCompareUse)

    return (
        <div className="container-fluid">
            <div className="row" style={{height: containerHeight}} key={"lipids container " + containerHeight}>
                <div className="col-3 text-align-center">
                    {renderChartSelector()}
                </div>
                <div className={chartColType}>
                    {subChart === Constants.LIPIDS_DATA_BASE &&
                    renderChart(Constants.LIPIDS_DATA_BASE)
                    }
                    {omegaDataAvailabe && subChart === Constants.LIPIDS_DATA_OMEGA &&
                    renderChart(Constants.LIPIDS_DATA_OMEGA)
                    }
                    {!omegaDataAvailabe && subChart === Constants.LIPIDS_DATA_OMEGA &&
                    <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
                    }
                </div>

                {showLegend && chartType === CHART_TYPE_PIE &&
                <div className="col-3">
                    {subChart === Constants.LIPIDS_DATA_BASE &&
                    <CustomLegend legendData={getLipidsBaseChartLegend(lang)}/>
                    }
                    {subChart === Constants.LIPIDS_DATA_OMEGA &&
                    <CustomLegend legendData={getLipidsOmegaChartLegend(lang)}/>
                    }
                </div>
                }
            </div>
            {!props.directCompareConfig &&
            <div className="row chart-control-button-bar">
                <PieChartConfigurationForm key={"Config Lipids Chart"}
                                           chartType={chartType}
                                           showLegend={showLegend}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckbox}/>
            </div>
            }
        </div>
    );

}