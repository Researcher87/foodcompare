import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {CHART_MINERALS, CHART_VITAMINS, GRAM} from "../../../config/Constants";
import {determineFoodRequirementRatio} from "../../../service/calculation/DietaryRequirementService";
import * as ChartConfig from "../../../config/ChartConfig"
import {applicationStrings} from "../../../static/labels";
import {getBarChartOptions} from "../../../service/ChartService"
import {Bar} from "react-chartjs-2";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../../charthelper/BarChartConfigurationForm";
import {MineralVitaminChartProps} from "../../../types/livedata/ChartPropsData";

export default function MineralVitaminChart(props: MineralVitaminChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const chartConfigVitamins = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.vitaminChartConfig
            : initialChartConfigData.vitaminChartConfig

    const chartConfigMinerals = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.mineralChartConfig
            : initialChartConfigData.mineralChartConfig

    const [portionType_vitamins, setPortionType_vitamins] = useState<string>(chartConfigVitamins.portionType)
    const [expand100_vitamins, setExpand100_vitamins] = useState<boolean>(chartConfigVitamins.expand100)
    const [chartType_minerals, setChartType_minerals] = useState<string>(chartConfigMinerals.portionType)
    const [expand100_minerals, setExpand100_minerals] = useState<boolean>(chartConfigMinerals.expand100)

    useEffect(() => {
        if (props.directCompareConfig) {
            setPortionType_vitamins(chartConfigVitamins.portionType)
            setExpand100_vitamins(chartConfigVitamins.expand100)
            setChartType_minerals(chartConfigMinerals.portionType)
            setExpand100_minerals(chartConfigMinerals.expand100)
        }

        updateChartConfig()
    }, [portionType_vitamins, chartType_minerals, expand100_vitamins, expand100_minerals, props])


    if (!applicationContext || applicationContext.foodDataCorpus.dietaryRequirements === null) {
        return <div/>
    }

    const anyValueChanged = (): boolean => {
        const config = props.selectedSubChart === CHART_VITAMINS
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.vitaminChartConfig
            : applicationContext.applicationData.foodDataPanel.chartConfigData.mineralChartConfig

        if (props.selectedSubChart === CHART_VITAMINS) {
            return portionType_vitamins !== config.portionType || expand100_vitamins !== config.expand100
        } else {
            return chartType_minerals !== config.portionType || expand100_minerals !== config.expand100
        }
    }

    const updateChartConfig = () => {
        if (!props.directCompareConfig && anyValueChanged()) {
            if (applicationContext) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    vitaminChartConfig: {
                        portionType: portionType_vitamins,
                        expand100: expand100_vitamins
                    },
                    mineralChartConfig: {
                        portionType: chartType_minerals,
                        expand100: expand100_minerals
                    }
                }

                applicationContext.applicationData.foodDataPanel.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }


    const createVitaminChartData = () => {
        const vitaminData = props.selectedFoodItem.foodItem.nutrientDataList[0].vitaminData;
        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData;

        if (!vitaminData || !requirementData) {
            return null
        }

        const amount = portionType_vitamins === GRAM ? 100 : props.selectedFoodItem.portion.amount

        const labels: Array<string> = [];
        const data: Array<number> = [];

        if (vitaminData.a !== null) {
            labels.push("A");
            data.push(determineFoodRequirementRatio(requirementData.a, vitaminData.a, amount, applicationContext.userData));
        }

        if (vitaminData.b1 !== null) {
            labels.push("B1");
            data.push(determineFoodRequirementRatio(requirementData.b1, vitaminData.b1, amount, applicationContext.userData));
        }

        if (vitaminData.b2 !== null) {
            labels.push("B2");
            data.push(determineFoodRequirementRatio(requirementData.b2, vitaminData.b2, amount, applicationContext.userData));
        }

        if (vitaminData.b3 !== null) {
            labels.push("B3");
            data.push(determineFoodRequirementRatio(requirementData.b3, vitaminData.b3, amount, applicationContext.userData));
        }

        if (vitaminData.b5 !== null) {
            labels.push("B5");
            data.push(determineFoodRequirementRatio(requirementData.b5, vitaminData.b5, amount, applicationContext.userData));
        }

        if (vitaminData.b6 !== null) {
            labels.push("B6");
            data.push(determineFoodRequirementRatio(requirementData.b6, vitaminData.b6, amount, applicationContext.userData));
        }

        if (vitaminData.b9 !== null) {
            labels.push("B9");
            data.push(determineFoodRequirementRatio(requirementData.b9, vitaminData.b9, amount, applicationContext.userData));
        }

        if (vitaminData.b12 !== null) {
            labels.push("B12");
            data.push(determineFoodRequirementRatio(requirementData.b12, vitaminData.b12, amount, applicationContext.userData));
        }

        if (vitaminData.c !== null) {
            labels.push("C");
            data.push(determineFoodRequirementRatio(requirementData.c, vitaminData.c, amount, applicationContext.userData));
        }

        if (vitaminData.d !== null) {
            labels.push("D");
            data.push(determineFoodRequirementRatio(requirementData.d, vitaminData.d, amount, applicationContext.userData));
        }

        if (vitaminData.e !== null) {
            labels.push("E");
            data.push(determineFoodRequirementRatio(requirementData.e, vitaminData.e, amount, applicationContext.userData));
        }

        if (vitaminData.k !== null) {
            labels.push("K");
            data.push(determineFoodRequirementRatio(requirementData.k, vitaminData.k, amount, applicationContext.userData));
        }

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_chart_green_3

        return {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_vitamins[lang],
                data: data,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]

        }
    }

    const createMineralChartData = () => {
        const mineralData = props.selectedFoodItem.foodItem.nutrientDataList[0].mineralData;
        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData;

        if (!mineralData || !requirementData) {
            return null
        }

        const amount = chartType_minerals === GRAM ? 100 : props.selectedFoodItem.portion.amount

        const labels: Array<string> = [];
        const data: Array<number> = [];

        if (mineralData.calcium !== null) {
            labels.push(applicationStrings.label_nutrient_min_calcium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.calcium, mineralData.calcium, amount, applicationContext.userData));
        }

        if (mineralData.iron !== null) {
            labels.push(applicationStrings.label_nutrient_min_iron[lang]);
            data.push(determineFoodRequirementRatio(requirementData.iron, mineralData.iron, amount, applicationContext.userData));
        }

        if (mineralData.magnesium !== null) {
            labels.push(applicationStrings.label_nutrient_min_magnesium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.magnesium, mineralData.magnesium, amount, applicationContext.userData));
        }

        if (mineralData.phosphorus !== null) {
            labels.push(applicationStrings.label_nutrient_min_phosphorus[lang]);
            data.push(determineFoodRequirementRatio(requirementData.phosphorus, mineralData.phosphorus, amount, applicationContext.userData));
        }

        if (mineralData.potassium !== null) {
            labels.push(applicationStrings.label_nutrient_min_potassimum[lang]);
            data.push(determineFoodRequirementRatio(requirementData.potassium, mineralData.potassium, amount, applicationContext.userData));
        }

        if (mineralData.sodium !== null) {
            labels.push(applicationStrings.label_nutrient_min_sodium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.sodium, mineralData.sodium, amount, applicationContext.userData));
        }

        if (mineralData.zinc !== null) {
            labels.push(applicationStrings.label_nutrient_min_zinc[lang]);
            data.push(determineFoodRequirementRatio(requirementData.zinc, mineralData.zinc, amount, applicationContext.userData));
        }

        if (mineralData.copper !== null) {
            labels.push(applicationStrings.label_nutrient_min_copper[lang]);
            data.push(determineFoodRequirementRatio(requirementData.copper, mineralData.copper, amount, applicationContext.userData));
        }

        if (mineralData.manganese !== null) {
            labels.push(applicationStrings.label_nutrient_min_manganese[lang]);
            data.push(determineFoodRequirementRatio(requirementData.manganese, mineralData.manganese, amount, applicationContext.userData));
        }

        if (mineralData.selenium !== null) {
            labels.push(applicationStrings.label_nutrient_min_selenium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.selenium, mineralData.selenium, amount, applicationContext.userData));
        }

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_purple

        const chartData = {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_minerals[lang],
                data: data,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]

        }

        return chartData;
    }

    const handleRadioButtonClick = (event: any): void => {
        if (props.selectedSubChart === CHART_VITAMINS) {
            setPortionType_vitamins(event.target.value)
        } else if (props.selectedSubChart === CHART_MINERALS) {
            setChartType_minerals(event.target.value)
        }
    }

    const handleExpandCheckbox = () => {
        if (props.selectedSubChart === CHART_VITAMINS) {
            setExpand100_vitamins(!expand100_vitamins)
        } else if (props.selectedSubChart === CHART_MINERALS) {
            setExpand100_minerals(!expand100_minerals)
        }
    }

    const getOptions = (title, maxValue) => {
        const expand100 = props.selectedSubChart === CHART_VITAMINS ? expand100_vitamins : expand100_minerals;
        const overallMaxValue = props.directCompareConfig && props.directCompareConfig.maxValue
            ? props.directCompareConfig.maxValue
            : maxValue

        let maxYValue
        if (!props.directCompareConfig) {
            if (expand100 && overallMaxValue < 100) {
                maxYValue = 100
            }
        } else {

            if (props.directCompareConfig.maxValue) {
                maxYValue = props.directCompareConfig.maxValue
            }
            if (expand100 === true) {
                if (maxYValue === undefined) {
                    if (overallMaxValue < 100) {
                        maxYValue = 100
                    }
                } else if (maxYValue < 100) {
                    maxYValue = 100
                }
            }
        }

        return getBarChartOptions(title, "%", maxYValue);
    }


    const renderChartConfigurationForm = () => {
        const portionType = props.selectedSubChart === CHART_VITAMINS ? portionType_vitamins : chartType_minerals;
        const expand100 = props.selectedSubChart === CHART_VITAMINS ? expand100_vitamins : expand100_minerals;

        const barChartProps = {
            selectedFoodItem: props.selectedFoodItem,
            portionType: portionType,
            expand100: expand100,
            handleRadioButtonClick: handleRadioButtonClick,
            handleExpandCheckboxClick: handleExpandCheckbox
        }

        return <BarChartConfigurationForm {...barChartProps} />
    }


    const data = props.selectedSubChart === CHART_VITAMINS ? createVitaminChartData() : createMineralChartData();
    if (!data) {
        return <div/>
    }

    const maxValue = (data && data.datasets && data.datasets.length > 0) ? Math.max(...data.datasets[0].data) : 0;

    const title = props.selectedSubChart === CHART_VITAMINS ? applicationStrings.label_charttype_vitamins[lang] :
        applicationStrings.label_charttype_minerals[lang];

    const options = getOptions(title, maxValue);
    const height = props.directCompareConfig ? ChartConfig.direct_compare_chartheight : ChartConfig.default_chart_height

    return (
        <div className="container-fluid">
            <div className="row">
                <div className={"col-12"}>
                    <Bar
                        data={data}
                        height={height}
                        options={options}
                        type={"bar"}
                    />
                </div>
            </div>
            <div className="row chartFormLine">
                {props.directCompareUse !== true &&
                renderChartConfigurationForm()
                }
            </div>
        </div>
    )

}