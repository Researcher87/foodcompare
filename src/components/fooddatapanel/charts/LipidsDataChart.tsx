import {ChartProps} from "../ChartPanel";
import {useContext, useState} from "react";

import * as ChartConfig from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants";
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartService";
import {LanguageContext} from "../../../contexts/LangContext";
import {autoRound} from "../../../service/calculation/MathService";
import {applicationStrings} from "../../../static/labels";
import {OmegaData} from "../../../types/nutrientdata/FoodItem";
import {minimalOmegaRatio} from "../../../config/ApplicationSetting";
import {CustomLegend} from "./helper/CustomLegend";
import {ChartOptionSelector} from "./helper/ChartOptionSelector.";
import {Form} from "react-bootstrap";
import {default_chart_height} from "../../../config/ChartConfig";

export default function LipidsDataChart(props: ChartProps) {
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const [chartType, setChartType] = useState<string>(CHART_TYPE_PIE)
    const [showLegend, setShowLegend] = useState<boolean>(true)
    const [chartSelection, setChartSelection] = useState<string>(Constants.LIPIDS_DATA_BASE)

    const lipidsData = props.selectedFoodItem.foodItem.nutrientDataList[0].lipidData;
    const totalLipidsAmount = props.selectedFoodItem.foodItem.nutrientDataList[0].baseData.lipids;

    const handleChartSelectionChange = (event: any) => {
        setChartSelection(event.target.value)
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

        const data = {
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
        }

        return data;
    }


    const createOmegaChartData = (totalAmount: number, omegaData: OmegaData) => {
        if (!omegaData.omega3 || !omegaData.omega6 || !omegaData.uncertain) {
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

        const legendData = [
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

        return legendData;
    }


    const getLegendOmegaChart = () => {
        const legendData = [
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

        return legendData;
    }


    const handleRadioButtonClick = (event: any) => {
        setChartType(event.target.value)
    }

    const handleLegendCheckbox = () => {
        setShowLegend(!showLegend)
    }


    const lipidData = props.selectedFoodItem.foodItem.nutrientDataList[0].lipidData;

    const omegaDataRation = lipidData.omegaData ?
        lipidData.omegaData.uncertainRatio != null ? lipidData.omegaData.uncertainRatio : 100
        : 1

    let omegaDataAvailabe = false
    if (lipidData.omegaData && lipidData.omegaData.uncertainRatio && lipidData.omegaData.uncertainRatio <= minimalOmegaRatio) {
        omegaDataAvailabe = true
    }

    const chartColType = chartType === CHART_TYPE_PIE ? "col-6" : "col-8";

    const getOptions = () => {
        let title;

        if (chartSelection === Constants.LIPIDS_DATA_BASE) {
            title = applicationStrings.label_charttype_lipids_base_title[lang]
        } else if (chartSelection === Constants.LIPIDS_DATA_OMEGA) {
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
                            checked={chartSelection === Constants.LIPIDS_DATA_BASE}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <Form.Check inline={false}
                            label={applicationStrings.label_charttype_lipids_omega[lang]}
                            type="radio"
                            value={Constants.LIPIDS_DATA_OMEGA}
                            checked={chartSelection === Constants.LIPIDS_DATA_OMEGA}
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
                return <div>{applicationStrings.label_noData[lang]}</div>
            }
            data = createTotalChartData(totalLipidsAmount, saturated, unsaturatedMono, unsaturatedPoly);
        } else if (lipidsType === Constants.LIPIDS_DATA_OMEGA) {
            if (omegaData) {
                data = createOmegaChartData(totalLipidsAmount, omegaData)
            }

        }

        if(!data) {
            return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
        }

        return (
            <div>
                {chartType === CHART_TYPE_PIE &&
                <Pie data={data}
                     height={ChartConfig.default_chart_height}
                     options={getOptions()}
                     type="pie"
                />
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar data={data}
                     height={ChartConfig.default_chart_height}
                     options={getOptions()}
                     type="bar"
                />
                }
            </div>
        );
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-3 text-align-center">
                    {renderChartSelector()}
                </div>
                <div className={chartColType}>
                    {chartSelection === Constants.LIPIDS_DATA_BASE &&
                    renderChart(Constants.LIPIDS_DATA_BASE)
                    }
                    {omegaDataAvailabe && chartSelection === Constants.LIPIDS_DATA_OMEGA &&
                    renderChart(Constants.LIPIDS_DATA_OMEGA)
                    }
                    {!omegaDataAvailabe && chartSelection === Constants.LIPIDS_DATA_OMEGA &&
                    <p className="text-center" style={{height: ChartConfig.default_chart_height}}>
                        {applicationStrings.label_noData[lang]}
                    </p>
                    }
                </div>

                {showLegend && chartType === CHART_TYPE_PIE &&
                <div className="col-3">
                    {chartSelection === Constants.LIPIDS_DATA_BASE &&
                    <CustomLegend legendData={getLegendBaseChart()}/>
                    }
                    {chartSelection === Constants.LIPIDS_DATA_OMEGA &&
                    <CustomLegend legendData={getLegendOmegaChart()}/>
                    }
                </div>
                }
            </div>
            <div className="row chartFormLine">
                <ChartOptionSelector chartType={chartType}
                                     showLegend={showLegend}
                                     handleRadioButtonClick={handleRadioButtonClick}
                                     handleLegendCheckboxClick={handleLegendCheckbox}/>
            </div>
        </div>
    );

}