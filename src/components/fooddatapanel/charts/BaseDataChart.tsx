import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {applicationStrings} from "../../../static/labels";
import {autoRound} from "../../../service/calculation/MathService";
import * as ChartConfig from "../../../config/ChartConfig"
import {default_chart_height} from "../../../config/ChartConfig"
import {CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../config/Constants";
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartService";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BaseDataChartProps} from "../../../types/livedata/ChartPropsData";

export default function BaseDataChart(props: BaseDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.baseChartConfig
            : initialChartConfigData.baseChartConfig

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [showDetails, setShowDetails] = useState<boolean>(chartConfig.showDetails)

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setShowDetails(chartConfig.showDetails)
        }

        updateChartConfig()
    }, [chartType, showDetails, showLegend, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentConfig = applicationContext.applicationData.foodDataPanel.chartConfigData
            if (chartType !== currentConfig.baseChartConfig.chartType
                || showDetails !== currentConfig.baseChartConfig.showDetails
                || showLegend !== currentConfig.baseChartConfig.showLegend) {
                const newChartConfig = {
                    ...currentConfig,
                    baseChartConfig: {
                        chartType: chartType,
                        showDetails: showDetails,
                        showLegend: showLegend
                    }
                }
                applicationContext.applicationData.foodDataPanel.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }

    const createTotalChartData = () => {
        const nutrientData = props.selectedFoodItem.foodItem.nutrientDataList[0];

        return {
            labels: [applicationStrings.label_nutrient_water[lang],
                applicationStrings.label_nutrient_carbohydrates_short[lang],
                applicationStrings.label_nutrient_lipids[lang],
                applicationStrings.label_nutrient_proteins[lang],
                applicationStrings.label_nutrient_ash[lang]],
            datasets: [{
                label: applicationStrings.label_chart_totalComposition[lang],
                data: [autoRound(nutrientData.baseData.water),
                    autoRound(nutrientData.baseData.carbohydrates),
                    autoRound(nutrientData.baseData.lipids),
                    autoRound(nutrientData.baseData.proteins),
                    autoRound(nutrientData.baseData.ash)
                ],
                backgroundColor: [
                    ChartConfig.color_water,
                    ChartConfig.color_carbs,
                    ChartConfig.color_lipids,
                    ChartConfig.color_proteins,
                    ChartConfig.color_ash,
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]

        }
    }


    const createNutrientChartData = () => {
        const nutrientData = props.selectedFoodItem.foodItem.nutrientDataList[0];
        const totalValue = nutrientData.baseData.carbohydrates + nutrientData.baseData.lipids + nutrientData.baseData.proteins;

        const sugar = nutrientData.carbohydrateData?.sugar ? nutrientData.carbohydrateData.sugar : 0
        const dietaryFibers = nutrientData.baseData.dietaryFibers ? nutrientData.baseData.dietaryFibers : 0

        let carbValue = showDetails ? (nutrientData.baseData.carbohydrates - sugar - dietaryFibers)
            : nutrientData.baseData.carbohydrates;

        if (carbValue < 0) {
            carbValue = 0
        }

        const carbValuePerc = autoRound(carbValue / totalValue * 100)
        const sugarValuePerc = autoRound(sugar / totalValue * 100)
        const dietaryFibersPerc = autoRound(dietaryFibers / totalValue * 100)
        const lipidValuePerc = autoRound(nutrientData.baseData.lipids / totalValue * 100)
        const proteinsValuePerc = autoRound(nutrientData.baseData.proteins / totalValue * 100)

        const labels = [applicationStrings.label_nutrient_lipids[lang],
            applicationStrings.label_nutrient_proteins[lang],
            applicationStrings.label_nutrient_carbohydrates_short[lang]]

        const values = [lipidValuePerc, proteinsValuePerc, carbValuePerc];

        const backgroundColors = [
            ChartConfig.color_lipids,
            ChartConfig.color_proteins,
            ChartConfig.color_carbs
        ];

        if (showDetails) {
            if (sugarValuePerc > 0) {
                labels.push(applicationStrings.label_nutrient_sugar[lang]);
                values.push(sugarValuePerc);
                backgroundColors.push(ChartConfig.color_carbs_sugar);
            }
            if (dietaryFibersPerc > 0) {
                labels.push(applicationStrings.label_nutrient_dietaryFibers_short[lang]);
                values.push(dietaryFibersPerc);
                backgroundColors.push(ChartConfig.color_carbs_dietaryFibers);
            }
        }

        return {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_chart_nutrientComposition[lang],
                data: values,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const getLegendData = () => {
        const legendData: Array<any> = [
            {
                item: applicationStrings.label_nutrient_water[lang],
                color: ChartConfig.color_water,
                separateNextElement: true
            },
            {
                item: applicationStrings.label_nutrient_lipids[lang],
                color: ChartConfig.color_lipids
            },
            {
                item: applicationStrings.label_nutrient_proteins[lang],
                color: ChartConfig.color_proteins
            },
            {
                item: applicationStrings.label_nutrient_carbohydrates_short[lang],
                color: ChartConfig.color_carbs,
            }
        ];

        if (showDetails) {
            legendData.push(
                {
                    item: applicationStrings.label_nutrient_sugar[lang],
                    color: ChartConfig.color_carbs_sugar,
                    indent: 1,
                },
                {
                    item: applicationStrings.label_nutrient_dietaryFibers[lang],
                    color: ChartConfig.color_carbs_dietaryFibers,
                    indent: 1,
                    separateNextElement: true
                }
            );

        }

        legendData.push({
            item: applicationStrings.label_nutrient_ash[lang],
            color: ChartConfig.color_ash
        })

        return legendData;
    }


    const handleRadioButtonClick = (event: any) => {
        setChartType(event.target.value)
        updateChartConfig()
    }

    const handleLegendCheckboxClick = () => {
        setShowLegend(!showLegend)
        updateChartConfig()
    }

    const handleDetailsCheckboxClick = () => {
        setShowDetails(!showDetails)
        updateChartConfig()
    }

    const legendAllowed = showLegend && chartType === CHART_TYPE_PIE

    const getOptions = (title) => {
        return chartType === CHART_TYPE_BAR ? getBarChartOptions(title, "%") : getPieChartOptions(title, "%")
    }

    const renderTotalChart = () => {
        const totalChartData = createTotalChartData();
        if (!totalChartData) {
            return <div/>
        }

        return (
            <div>
                {chartType === CHART_TYPE_PIE &&
                <Pie
                    data={totalChartData}
                    height={ChartConfig.basedata_chart_height}
                    width={ChartConfig.basedata_piechart_width}
                    options={getOptions(applicationStrings.label_chart_totalComposition[lang])}
                    type={"pie"}/>
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar
                    data={totalChartData}
                    height={ChartConfig.basedata_chart_height}
                    width={ChartConfig.basedata_barchart_width}
                    options={getOptions(applicationStrings.label_chart_totalComposition[lang])}
                    type={"bar"}/>
                }
            </div>
        )
    }


    const renderNutrientChart = () => {
        const nutrientChartData = createNutrientChartData();

        return (
            <div className="chart">
                {chartType === CHART_TYPE_PIE &&
                <Pie
                    data={nutrientChartData}
                    height={ChartConfig.basedata_chart_height}
                    width={ChartConfig.basedata_piechart_width}
                    options={getOptions(applicationStrings.label_chart_nutrientComposition[lang])}
                    type={"pie"}
                />
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar
                    data={nutrientChartData}
                    height={ChartConfig.basedata_chart_height}
                    width={ChartConfig.basedata_barchart_width}
                    options={getOptions(applicationStrings.label_chart_nutrientComposition[lang])}
                    type={"bar"}
                />
                }
            </div>
        )
    }

    const height = props.directCompareUse === true ? "320px" : default_chart_height

    return (
        <div className="container-fluid">
            <div className="d-flex">
                <div className="d-inline-block">
                    <div className="row" style={{height: height}}>
                        <div className="col-6">
                            <div>{renderTotalChart()}</div>
                        </div>
                        <div className="col-6">
                            <div>{renderNutrientChart()}</div>
                        </div>
                    </div>
                </div>
                {legendAllowed &&
                <div className="d-inline-block float-right">
                    <CustomLegend legendData={getLegendData()}/>
                </div>
                }
            </div>
            {!props.directCompareUse &&
            <div className="row chartFormLine">
                <PieChartConfigurationForm chartType={chartType}
                                           showLegend={showLegend}
                                           showDetails={showDetails}
                                           detailsCheckboxAvailable={true}
                                           handleRadioButtonClick={handleRadioButtonClick}
                                           handleLegendCheckboxClick={handleLegendCheckboxClick}
                                           handleDetailsCheckboxClick={handleDetailsCheckboxClick}/>
            </div>
            }
        </div>
    )


}