import {useContext, useEffect, useState} from "react";
import * as ChartConfig from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants";
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
import {ChartProps} from "../../../types/livedata/ChartPropsData";

export default function CarbsDataChart(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const chartConfig = applicationContext
        ? applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
        : initialChartConfigData.carbsChartConfig

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [chartSelection, setChartSelection] = useState<string>(chartConfig.subChart)

    useEffect(() => {
        updateChartConfig()
    }, [chartType, showLegend, chartSelection])

    const updateChartConfig = () => {
        if (applicationContext) {
            const newChartConfig = {
                ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                carbsChartConfig: {
                    chartType: chartType,
                    showLegend: showLegend,
                    subChart: chartSelection
                }
            }
            applicationContext.applicationData.foodDataPanel.updateFoodDataPanelChartConfig(newChartConfig)
        }
    }

    const carbohydrateData = props.selectedFoodItem.foodItem.nutrientDataList[0].carbohydrateData;

    const handleChartSelectionChange = (event: any) => {
        setChartSelection(event.target.value)
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

        if(labels.includes(applicationStrings.label_nutrient_sugar[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_sugar[lang],
                color: ChartConfig.color_chart_green_3,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_dietaryFibers[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_dietaryFibers[lang],
                color: ChartConfig.color_chart_green_2,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_remainder[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_remainder[lang],
                color: ChartConfig.color_chart_misc,
            })
        }

        return legendData;
    }


    const getLegendDetailsChart = (labels: Array<String>) => {
        const legendData: Array<any> = []

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_glucose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_glucose[lang],
                color: ChartConfig.color_chart_green_1,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_fructose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_fructose[lang],
                color: ChartConfig.color_chart_green_2,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_galactose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_galactose[lang],
                color: ChartConfig.color_chart_green_3,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_sucrose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_sucrose[lang],
                color: ChartConfig.color_chart_yellow_1,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_lactose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_lactose[lang],
                color: ChartConfig.color_chart_yellow_2,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_maltose[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_maltose[lang],
                color: ChartConfig.color_chart_yellow_3,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_carbohydrates_starch[lang])) {
            legendData.push(            {
                item: applicationStrings.label_nutrient_carbohydrates_starch[lang],
                color: ChartConfig.color_chart_orange,
            })
        }

        if(labels.includes(applicationStrings.label_nutrient_remainder[lang])) {
            legendData.push(            {
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

        if (chartSelection === Constants.CARBS_DATA_BASE) {
            title = applicationStrings.label_charttype_carbs_base[lang];
        } else if (chartSelection === Constants.CARBS_DATA_DETAIL) {
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
                            checked={chartSelection === Constants.CARBS_DATA_BASE}
                            onChange={handleChartSelectionChange}>
                </Form.Check>
                <Form.Check inline={false}
                            label={applicationStrings.label_charttype_carbs_detail[lang]}
                            type="radio"
                            value={Constants.CARBS_DATA_DETAIL}
                            checked={chartSelection === Constants.CARBS_DATA_DETAIL}
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
                     type={"bar"}
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
            <div className="row">
                <div className="col-3" style={{display: "block"}}>
                    {renderChartSelector()}
                </div>
                <div className={chartColType}>
                    {chartSelection === Constants.CARBS_DATA_BASE &&
                    renderChart(basicChartData)
                    }
                    {detailChartData && chartSelection === Constants.CARBS_DATA_DETAIL &&
                    renderChart(detailChartData)
                    }
                    {!detailChartData && chartSelection === Constants.CARBS_DATA_DETAIL &&
                    <div style={{height: ChartConfig.default_chart_height}}>
                        {applicationStrings.label_noData[lang]}
                    </div>
                    }
                </div>

                {showLegend && chartType === Constants.CHART_TYPE_PIE &&
                <div className="col-3">
                    {chartSelection === Constants.CARBS_DATA_BASE && basicChartData &&
                    <CustomLegend legendData={getLegendBaseChart(basicChartData.labels)}/>
                    }
                    {chartSelection === Constants.CARBS_DATA_DETAIL && detailChartData &&
                    <CustomLegend legendData={getLegendDetailsChart(detailChartData.labels)}/>
                    }
                </div>
                }
            </div>
            <div className="row chartFormLine">
                <PieChartConfigurationForm chartType={chartType}
                                           showLegend={showLegend}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckbox}/>
            </div>
        </div>
    );


}