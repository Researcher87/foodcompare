import {useContext, useEffect, useState} from "react";
import * as ChartConfig from "../../../config/ChartConfig"
import * as Constants from "../../../config/Constants"
import {CARBS_DATA_BASE, CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants"
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartConfigurationService";
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
import {useWindowDimension} from "../../../service/WindowDimension";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {color_carbs_mono_glucose} from "../../../config/ChartConfig";

export default function CarbsDataChart(props: CarbDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    let chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.carbsChartConfig
            : initialChartConfigData.carbsChartConfig

    const initialExpand100 =  props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.expand100
        : chartConfig.expand100

    const initialHideRemainders =  props.directCompareConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.hideRemainders
        : chartConfig.hideRemainders

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [hideRemainders, setShowHideRemainders] = useState<boolean>(initialHideRemainders ? initialHideRemainders : false)
    const [expand100, setExpand100] = useState<boolean>(initialExpand100 ? initialExpand100 : false)
    const [subChart, setSubChart] = useState<string>(chartConfig.subChart ? chartConfig.subChart : CARBS_DATA_BASE)
    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setSubChart(chartConfig.subChart ? chartConfig.subChart : CARBS_DATA_BASE)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
        updateChartConfig()
    }, [chartType, showLegend, hideRemainders, expand100, subChart, chartHeight, props])

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
        } else if(applicationContext) {
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

    const carbohydrateData = getNutrientData(props.selectedFoodItem).carbohydrateData;

    const handleChartSelectionChange = (event: any) => {
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
            setSubChart(event.target.value)
        }
    }

    const createBasicChartData = () => {
        const totalCarbsAmount = getNutrientData(props.selectedFoodItem).baseData.carbohydrates;
        const dietaryFibers = getNutrientData(props.selectedFoodItem).baseData.dietaryFibers;
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

        const labels = [applicationStrings.label_nutrient_sugar[lang],
            applicationStrings.label_nutrient_dietaryFibers[lang],
        ]

        const data = [valueSugar,
            valueDietaryFibers]

        const colors = [
            ChartConfig.color_chart_green_3,
            ChartConfig.color_chart_green_2,
        ]

        if(!hideRemainders) {
            labels.push(applicationStrings.label_nutrient_remainder[lang])
            colors.push(ChartConfig.color_chart_misc)
            data.push(valueMisc)
        }

        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const createDetailChartData = () => {
        const {carbohydrateData, baseData} = getNutrientData(props.selectedFoodItem)
        const totalAmount = getNutrientData(props.selectedFoodItem).baseData.carbohydrates;

        const valueGlucose = carbohydrateData.glucose !== null ? autoRound(carbohydrateData.glucose / totalAmount * 100) : null;
        const valueFructose = carbohydrateData.fructose !== null ? autoRound(carbohydrateData.fructose / totalAmount * 100) : null;
        const valueGalactose = carbohydrateData.galactose !== null ? autoRound(carbohydrateData.galactose / totalAmount * 100) : null;
        const valueSucrose = carbohydrateData.sucrose !== null ? autoRound(carbohydrateData.sucrose / totalAmount * 100) : null;
        const valueLactose = carbohydrateData.lactose !== null ? autoRound(carbohydrateData.lactose / totalAmount * 100) : null;
        const valueMaltose = carbohydrateData.maltose !== null ? autoRound(carbohydrateData.maltose / totalAmount * 100) : null;
        const valueStarch = carbohydrateData.starch !== null ? autoRound(carbohydrateData.starch / totalAmount * 100) : null;

        const valueDietaryFibers = baseData.dietaryFibers !== null ? autoRound(baseData.dietaryFibers / totalAmount * 100) : null;

        if (!valueMaltose && !valueSucrose && !valueLactose && !valueGlucose && !valueFructose && !valueGalactose) {
            return null
        }

        let valueMisc = 100
        const labels: Array<String> = []
        const data: Array<number> = []
        const colors: Array<String> = []

        if (valueGlucose) {
            valueMisc -= valueGlucose
            labels.push(applicationStrings.label_nutrient_carbohydrates_glucose[lang])
            data.push(valueGlucose)
            colors.push(ChartConfig.color_carbs_mono_glucose)
        }
        if (valueFructose) {
            valueMisc -= valueFructose
            labels.push(applicationStrings.label_nutrient_carbohydrates_fructose[lang])
            data.push(valueFructose)
            colors.push(ChartConfig.color_carbs_mono_fructose)
        }
        if (valueGalactose) {
            valueMisc -= valueGalactose
            labels.push(applicationStrings.label_nutrient_carbohydrates_galactose[lang])
            data.push(valueGalactose)
            colors.push(ChartConfig.color_carbs_mono_galactose)
        }
        if (valueSucrose) {
            valueMisc -= valueSucrose
            labels.push(applicationStrings.label_nutrient_carbohydrates_sucrose[lang])
            data.push(valueSucrose)
            colors.push(ChartConfig.color_carbs_di_sucrose)
        }
        if (valueLactose) {
            valueMisc -= valueLactose
            labels.push(applicationStrings.label_nutrient_carbohydrates_lactose[lang])
            data.push(valueLactose)
            colors.push(ChartConfig.color_carbs_di_lactose)
        }
        if (valueMaltose) {
            valueMisc -= valueMaltose
            labels.push(applicationStrings.label_nutrient_carbohydrates_maltose[lang])
            data.push(valueMaltose)
            colors.push(ChartConfig.color_carbs_di_maltose)
        }
        if (valueStarch) {
            valueMisc -= valueStarch
            labels.push(applicationStrings.label_nutrient_carbohydrates_starch[lang])
            data.push(valueStarch)
            colors.push(ChartConfig.color_carbs_starch)
        }

        if (valueDietaryFibers) {
            valueMisc -= valueDietaryFibers
            labels.push(applicationStrings.label_nutrient_dietaryFibers[lang])
            data.push(valueDietaryFibers)
            colors.push(ChartConfig.color_carbs_dietaryFibers)
        }

        valueMisc = autoRound(valueMisc);

        if(!hideRemainders) {
            labels.push(applicationStrings.label_nutrient_remainder[lang])
            data.push(valueMisc)
            colors.push(ChartConfig.color_chart_misc)
        }

        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
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
                color: ChartConfig.color_carbs_mono_glucose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_fructose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_fructose[lang],
                color: ChartConfig.color_carbs_mono_fructose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_galactose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_galactose[lang],
                color: ChartConfig.color_carbs_mono_galactose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_sucrose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_sucrose[lang],
                color: ChartConfig.color_carbs_di_sucrose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_lactose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_lactose[lang],
                color: ChartConfig.color_carbs_di_lactose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_maltose[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_maltose[lang],
                color: ChartConfig.color_carbs_di_maltose,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_carbohydrates_starch[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_carbohydrates_starch[lang],
                color: ChartConfig.color_carbs_starch,
            })
        }

        if (labels.includes(applicationStrings.label_nutrient_dietaryFibers[lang])) {
            legendData.push({
                item: applicationStrings.label_nutrient_dietaryFibers[lang],
                color: ChartConfig.color_carbs_dietaryFibers,
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
                <hr/>
                <Form>
                    <Form.Check inline={false}
                                label={applicationStrings.checkbox_expand100g[lang]}
                                type="checkbox"
                                disabled={chartType === Constants.CHART_TYPE_PIE}
                                checked={expand100 === true}
                                onChange={handleExpand100Change}>
                    </Form.Check>
                    <Form.Check inline={false}
                                label={applicationStrings.checkbox_chartoption_hideRemainders[lang]}
                                type="checkbox"
                                disabled={subChart === Constants.CARBS_DATA_DETAIL}
                                checked={hideRemainders === true}
                                onChange={handleHideRemaindersCheckbox}>
                    </Form.Check>
                </Form>
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


    const chartColType = chartType === CHART_TYPE_PIE ? "col-6" : "col-8";
    const detailChartData = createDetailChartData()
    const basicChartData = createBasicChartData()

    const containerHeight = calculateChartContainerHeight(windowSize,  props.directCompareUse)

    return (
        <div className="container-fluid">
            <div className="row" style={{height: containerHeight}} key={"carbs container " + containerHeight}>
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
            {!props.directCompareConfig &&
            <div className="row chartFormLine">
                <PieChartConfigurationForm chartType={chartType}
                                           showLegend={showLegend}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckbox}/>

            </div>
            }
        </div>
    );


}