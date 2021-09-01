import {useContext, useEffect, useState} from "react";

import * as ChartConfig from "../../../config/ChartConfig"
import {default_chart_height} from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CHART_TYPE_BAR, CHART_TYPE_PIE, LIPIDS_DATA_BASE} from "../../../config/Constants"
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartConfigurationService";
import {LanguageContext} from "../../../contexts/LangContext";
import {autoRound} from "../../../service/calculation/MathService";
import {applicationStrings} from "../../../static/labels";
import {OmegaData} from "../../../types/nutrientdata/FoodItem";
import {initialChartConfigData, minimalOmegaRatio} from "../../../config/ApplicationSetting";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {Form} from "react-bootstrap";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LipidsDataChartProps} from "../../../types/livedata/ChartPropsData";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {useWindowDimension} from "../../../service/WindowDimension";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";

export default function LipidsDataChart(props: LipidsDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    let chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.lipidsChartConfig
            : initialChartConfigData.lipidsChartConfig

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [subChart, setSubChart] = useState<string>(chartConfig.subChart  ? chartConfig.subChart : LIPIDS_DATA_BASE)

    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setSubChart(chartConfig.subChart ? chartConfig.subChart : LIPIDS_DATA_BASE)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
        updateChartConfig()
    }, [chartType, showLegend, subChart, chartHeight, windowSize, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentConfig = applicationContext.applicationData.foodDataPanel.chartConfigData.lipidsChartConfig
            if (chartType !== currentConfig.chartType
                || subChart !== currentConfig.subChart
                || showLegend !== currentConfig.showLegend) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    lipidsChartConfig: {
                        chartType: chartType,
                        showLegend: showLegend,
                        subChart: subChart
                    }
                }
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }

    const lipidsData = getNutrientData(props.selectedFoodItem).lipidData;
    const totalLipidsAmount = getNutrientData(props.selectedFoodItem).baseData.lipids;

    const handleChartSelectionChange = (event: any) => {
        if (props.directCompareConfig && props.directCompareConfig.handleSubchartChange) {
            props.directCompareConfig.handleSubchartChange(event)
        } else {
            setSubChart(event.target.value)
        }
    }

    const createTotalChartData = (totalAmount: number, saturated: number, unsaturatedMono: number, unsaturatedPoly: number): any => {
        const valueSaturated = autoRound(lipidsData.saturated!! / totalAmount * 100);
        const valueUnsaturatedMono = autoRound(lipidsData.unsaturatedMono!! / totalAmount * 100);
        const valueUnsaturatedPoly = autoRound(lipidsData.unsaturatedPoly!! / totalAmount * 100);

        let valueRemainder = totalAmount - (saturated + unsaturatedMono + unsaturatedPoly);
        valueRemainder = autoRound(valueRemainder / totalAmount * 100);

        if (valueRemainder < 0) {
            console.error("Fatty acids sum is erroneous. Food-Obj: ", props.selectedFoodItem);
            valueRemainder = 0;
        }

        return {
            labels: [applicationStrings.label_nutrient_lipids_saturated[lang],
                applicationStrings.label_nutrient_lipids_unsaturated_mono[lang],
                applicationStrings.label_nutrient_lipids_unsaturated_poly[lang],
                applicationStrings.label_nutrient_remainder[lang]],
            datasets: [{
                data: [valueSaturated,
                    valueUnsaturatedMono,
                    valueUnsaturatedPoly,
                    valueRemainder],
                backgroundColor: [
                    ChartConfig.color_lipids_saturated,
                    ChartConfig.color_lipids_unsaturated_mono,
                    ChartConfig.color_lipids_unsaturated_poly,
                    ChartConfig.color_lipids_misc,
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]
        };
    }


    const createOmegaChartData = (totalAmount: number, omegaData: OmegaData) => {
        if (omegaData.omega3 === null || omegaData.omega6 === null || omegaData.uncertain === null) {
            return null;
        }

        const valueOmega3 = autoRound(omegaData.omega3 / totalAmount * 100);
        const valueOmega6 = autoRound(omegaData.omega6 / totalAmount * 100);
        const valueUncertain = autoRound(omegaData.uncertain / totalAmount * 100);

        return {
            labels: [applicationStrings.label_nutrient_omega3[lang],
                applicationStrings.label_nutrient_omega6[lang],
                applicationStrings.label_unknown[lang]],
            datasets: [{
                data: [valueOmega3,
                    valueOmega6,
                    valueUncertain],
                backgroundColor: [
                    ChartConfig.color_lipids_omega3,
                    ChartConfig.color_lipids_omega6,
                    ChartConfig.color_lipids_misc,
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]
        };

    }


    const getLegendBaseChart = () => {
        return [
            {
                item: applicationStrings.label_nutrient_lipids_saturated[lang],
                color: ChartConfig.color_lipids_saturated,
            },
            {
                item: applicationStrings.label_nutrient_lipids_unsaturated_mono[lang],
                color: ChartConfig.color_lipids_unsaturated_mono
            },
            {
                item: applicationStrings.label_nutrient_lipids_unsaturated_poly[lang],
                color: ChartConfig.color_lipids_unsaturated_poly,
            },
            {
                item: applicationStrings.label_nutrient_remainder[lang],
                color: ChartConfig.color_lipids_misc
            },
        ];
    }


    const getLegendOmegaChart = () => {
        return [
            {
                item: applicationStrings.label_nutrient_omega3[lang],
                color: ChartConfig.color_lipids_omega3,
            },
            {
                item: applicationStrings.label_nutrient_omega6[lang],
                color: ChartConfig.color_lipids_omega6
            },
            {
                item: applicationStrings.label_unknown[lang],
                color: ChartConfig.color_lipids_misc,
            },
        ];
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
            return getBarChartOptions(title, "%");
        } else {
            return getPieChartOptions(title, "%");
        }
    }

    const renderChartSelector = () => {
        return (
            <Form>
                <Form.Label>
                    <b>{applicationStrings.label_datatype[languageContext.language]}:</b>
                </Form.Label>
                <Form.Check inline={false}
                            label={applicationStrings.label_charttype_lipids_base[lang]}
                            type="radio"
                            value={Constants.LIPIDS_DATA_BASE}
                            checked={subChart === Constants.LIPIDS_DATA_BASE}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <Form.Check inline={false}
                            label={applicationStrings.label_charttype_lipids_omega[lang]}
                            type="radio"
                            value={Constants.LIPIDS_DATA_OMEGA}
                            checked={subChart === Constants.LIPIDS_DATA_OMEGA}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
            </Form>
        )
    }

    const renderChart = (lipidsType) => {
        const {saturated, unsaturatedMono, unsaturatedPoly, omegaData} = lipidData

        let data
        if (lipidsType === Constants.LIPIDS_DATA_BASE) {
            if (!saturated || !unsaturatedMono || !unsaturatedPoly) {
                return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
            }
            data = createTotalChartData(totalLipidsAmount, saturated, unsaturatedMono, unsaturatedPoly);
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
                    <CustomLegend legendData={getLegendBaseChart()}/>
                    }
                    {subChart === Constants.LIPIDS_DATA_OMEGA &&
                    <CustomLegend legendData={getLegendOmegaChart()}/>
                    }
                </div>
                }
            </div>
            <div className="row chartFormLine">
                {!props.directCompareConfig &&
                <PieChartConfigurationForm chartType={chartType}
                                           showLegend={showLegend}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckbox}/>
                }
            </div>
        </div>
    );

}