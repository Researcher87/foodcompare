import {useContext, useEffect, useState} from "react";
import * as ChartConfig from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CARBS_DATA_BASE, CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants";
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartService";
import {LanguageContext} from "../../../contexts/LangContext";
import {autoRound} from "../../../service/calculation/MathService";
import {applicationStrings} from "../../../static/labels";
import {Form} from "react-bootstrap";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {CarbDataChartProps} from "../../../types/livedata/ChartPropsData";
import {GeneralChartConfigDirectCompareWithSubCharts} from "../../../types/livedata/ChartConfigData";
import {default_chart_height} from "../../../config/ChartConfig";

export default function CarbsDataChart(props: CarbDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    let chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
            : initialChartConfigData.carbsChartConfig

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [subChart, setSubChart] = useState<string>(chartConfig.subChart)

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setSubChart(chartConfig.subChart ? chartConfig.subChart : CARBS_DATA_BASE)
        }

        updateChartConfig()
    }, [chartType, showLegend, subChart, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentConfig = applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
            if (chartType !== currentConfig.chartType
                || subChart !== currentConfig.subChart
                || showLegend !== currentConfig.showLegend) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    carbsChartConfig: {
                        chartType: chartType,
                        showLegend: showLegend,
                        subChart: subChart
                    }
                }
                applicationContext.applicationData.foodDataPanel.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }

    const carbohydrateData = props.selectedFoodItem.foodItem.nutrientDataList[0].carbohydrateData;

    const handleChartSelectionChange = (event: any) => {
        if (applicationContext && props.directCompareConfig) {
            const currentSettings = applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart

            const carbsChartConfig: GeneralChartConfigDirectCompareWithSubCharts = props.directCompareConfig.chartIndex === 1
                ? {
                    chartType: chartType,
                    showLegend: showLegend,
                    subChart1: event.target.value,
                    subChart2: currentSettings.carbsChartConfig.subChart2
                }
                : {
                    chartType: chartType,
                    showLegend: showLegend,
                    subChart1: currentSettings.carbsChartConfig.subChart1,
                    subChart2: event.target.value
                }

            const newChartConfig = {
                ...currentSettings,
                carbsChartConfig: carbsChartConfig
            }
            applicationContext.applicationData.directCompareDataPanel.updateDirectCompareChartConfig(newChartConfig)
        } else {
            setSubChart(event.target.value)
        }
    }

    const createBasicChartData = () => {
        const totalCarbsAmount = props.selectedFoodItem.foodItem.nutrientDataList[0].baseData.carbohydrates;
        const dietaryFibers = props.selectedFoodItem.foodItem.nutrientDataList[0].baseData.dietaryFibers;
        const sugar = carbohydrateData.sugar

        if (!sugar || !dietaryFibers) {
            return null
        }

        const valueSugar = autoRound(sugar / totalCarbsAmount * 100);
        const valueDietaryFibers = autoRound(dietaryFibers / totalCarbsAmount * 100);

        if (totalCarbsAmount === 0) {
            return null;
        }

        let valueMisc = totalCarbsAmount - (sugar + dietaryFibers);
        valueMisc = autoRound(valueMisc / totalCarbsAmount * 100);

        if (valueMisc < 0) {
            console.warn("Carbo hydrate value is erroneous. Food-Obj: ", props.selectedFoodItem);
            valueMisc = 0;
        }

        return {
            labels: [applicationStrings.label_nutrient_sugar[lang],
                applicationStrings.label_nutrient_dietaryFibers[lang],
                applicationStrings.label_nutrient_remainder[lang]
            ],
            datasets: [{
                data: [valueSugar,
                    valueDietaryFibers,
                    valueMisc],
                backgroundColor: [
                    ChartConfig.color_chart_green_3,
                    ChartConfig.color_chart_green_2,
                    ChartConfig.color_chart_misc,
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const createDetailChartData = () => {
        const carbohydrateData = props.selectedFoodItem.foodItem.nutrientDataList[0].carbohydrateData;

        const totalAmount = props.selectedFoodItem.foodItem.nutrientDataList[0].baseData.carbohydrates;

        const valueGlucose = carbohydrateData.glucose !== null ? autoRound(carbohydrateData.glucose / totalAmount * 100) : null;
        const valueFructose = carbohydrateData.fructose !== null ? autoRound(carbohydrateData.fructose / totalAmount * 100) : null;
        const valueGalactose = carbohydrateData.galactose !== null ? autoRound(carbohydrateData.galactose / totalAmount * 100) : null;
        const valueSucrose = carbohydrateData.sucrose !== null ? autoRound(carbohydrateData.sucrose / totalAmount * 100) : null;
        const valueLactose = carbohydrateData.lactose !== null ? autoRound(carbohydrateData.lactose / totalAmount * 100) : null;
        const valueMaltose = carbohydrateData.maltose !== null ? autoRound(carbohydrateData.maltose / totalAmount * 100) : null;
        const valueStarch = carbohydrateData.starch !== null ? autoRound(carbohydrateData.starch / totalAmount * 100) : null;

        if (!valueMaltose && !valueSucrose && !valueLactose && !valueGlucose && !valueFructose && !valueGalactose) {
            return null
        }

        let valueMisc = 100
        const labels: Array<String> = []
        const values: Array<number> = []

        if (valueGlucose) {
            valueMisc -= valueGlucose
            labels.push(applicationStrings.label_nutrient_carbohydrates_glucose[lang])
            values.push(valueGlucose)
        }
        if (valueFructose) {
            valueMisc -= valueFructose
            labels.push(applicationStrings.label_nutrient_carbohydrates_fructose[lang])
            values.push(valueFructose)
        }
        if (valueGalactose) {
            valueMisc -= valueGalactose
            labels.push(applicationStrings.label_nutrient_carbohydrates_galactose[lang])
            values.push(valueGalactose)
        }
        if (valueSucrose) {
            valueMisc -= valueSucrose
            labels.push(applicationStrings.label_nutrient_carbohydrates_sucrose[lang])
            values.push(valueSucrose)
        }
        if (valueLactose) {
            valueMisc -= valueLactose
            labels.push(applicationStrings.label_nutrient_carbohydrates_lactose[lang])
            values.push(valueLactose)
        }
        if (valueMaltose) {
            valueMisc -= valueMaltose
            labels.push(applicationStrings.label_nutrient_carbohydrates_maltose[lang])
            values.push(valueMaltose)
        }
        if (valueStarch) {
            valueMisc -= valueStarch
            labels.push(applicationStrings.label_nutrient_carbohydrates_starch[lang])
            values.push(valueStarch)
        }

        valueMisc = autoRound(valueMisc);
        labels.push(applicationStrings.label_nutrient_remainder[lang])
        values.push(valueMisc)

        return {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    ChartConfig.color_chart_green_1,
                    ChartConfig.color_chart_green_2,
                    ChartConfig.color_chart_green_3,
                    ChartConfig.color_chart_yellow_1,
                    ChartConfig.color_chart_yellow_2,
                    ChartConfig.color_chart_yellow_3,
                    ChartConfig.color_chart_orange,
                    ChartConfig.color_chart_misc
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]
        };
    }


    const getLegendBaseChart = (labels: Array<String>) => {
        const legendData: Array<any> = []

        if (labels.includes(applicationStrings.label_nutrient_sugar[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_sugar[lang],
                color: ChartConfig.color_chart_green_3,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_dietaryFibers[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_dietaryFibers[lang],
                color: ChartConfig.color_chart_green_2,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_remainder[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_remainder[lang],
                color: ChartConfig.color_chart_misc,
            })
        }

        return legendData;
    }


    const getLegendDetailsChart = (labels: Array<String>) => {
        const legendData: Array<any> = []

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_glucose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_glucose[lang],
                color: ChartConfig.color_chart_green_1,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_fructose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_fructose[lang],
                color: ChartConfig.color_chart_green_2,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_galactose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_galactose[lang],
                color: ChartConfig.color_chart_green_3,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_sucrose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_sucrose[lang],
                color: ChartConfig.color_chart_yellow_1,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_lactose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_lactose[lang],
                color: ChartConfig.color_chart_yellow_2,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_maltose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_maltose[lang],
                color: ChartConfig.color_chart_yellow_3,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_starch[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_starch[lang],
                color: ChartConfig.color_chart_orange,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_remainder[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_remainder[lang],
                color: ChartConfig.color_chart_misc,
            })
        }

        return legendData;
    }


    const handleRadioButtonClick = (event: any) => {
        setChartType(event.target.value)
    }

    const handleLegendCheckbox = () => {
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
            return getBarChartOptions(title, "%");
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
                            label={applicationStrings.label_charttype_carbs_base[lang]}
                            type="radio"
                            value={Constants.CARBS_DATA_BASE}
                            checked={subChart === Constants.CARBS_DATA_BASE}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <Form.Check inline={false}
                            label={applicationStrings.label_charttype_carbs_detail[lang]}
                            type="radio"
                            value={Constants.CARBS_DATA_DETAIL}
                            checked={subChart === Constants.CARBS_DATA_DETAIL}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
            </Form>
        )
    }


    const renderChart = (data: any) => {
        if (!data) {
            return (
                <div style={{height: ChartConfig.default_chart_height}}>
                    {applicationStrings.label_noData[lang]}
                </div>
            )
        }

        const height = props.directCompareUse ? ChartConfig.direct_compare_chartheight : ChartConfig.default_chart_height

        return (
            <div>
                {chartType === CHART_TYPE_PIE &&
                <Pie data={data}
                     height={height}
                     options={getOptions()}
                     type="pie"
                />
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar data={data}
                     height={height}
                     options={getOptions()}
                     type={"bar"}
                />
                }
            </div>
        );
    }


    const chartColType = chartType === CHART_TYPE_PIE ? "col-6" : "col-8";
    const detailChartData = createDetailChartData()
    const basicChartData = createBasicChartData()

    const height = props.directCompareUse === true ? "320px" : default_chart_height

    return (
        <div className="container-fluid">
            <div className="row" style={{height: height}}>
                <div className="col-3" style={{display: "block"}}>
                    {renderChartSelector()}
                </div>
                <div className={chartColType}>
                    {subChart === Constants.CARBS_DATA_BASE &&
                    renderChart(basicChartData)
                    }
                    {detailChartData && subChart === Constants.CARBS_DATA_DETAIL &&
                    renderChart(detailChartData)
                    }
                    {!detailChartData && subChart === Constants.CARBS_DATA_DETAIL &&
                    <div style={{height: ChartConfig.default_chart_height}}>
                        {applicationStrings.label_noData[lang]}
                    </div>
                    }
                </div>

                {showLegend && chartType === Constants.CHART_TYPE_PIE &&
                <div className="col-3">
                    {subChart === Constants.CARBS_DATA_BASE && basicChartData &&
                    <CustomLegend legendData={getLegendBaseChart(basicChartData.labels)}/>
                    }
                    {subChart === Constants.CARBS_DATA_DETAIL && detailChartData &&
                    <CustomLegend legendData={getLegendDetailsChart(detailChartData.labels)}/>
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