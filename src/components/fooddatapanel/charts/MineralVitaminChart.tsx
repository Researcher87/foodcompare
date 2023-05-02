import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {CHART_MINERALS, CHART_VITAMINS, GRAM, TAB_MINERAL_DATA, TAB_VITAMIN_DATA} from "../../../config/Constants";
import * as ChartConfig from "../../../config/ChartConfig"
import {applicationStrings} from "../../../static/labels";
import {getBarChartOptions} from "../../../service/ChartConfigurationService"
import {Bar} from "react-chartjs-2";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../../charthelper/BarChartConfigurationForm";
import {MineralVitaminChartProps} from "../../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../../service/WindowDimension";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {getMineralsChartData, getVitaminChartData} from "../../../service/chartdata/VitaminsMineralsDataService";

export default function MineralVitaminChart(props: MineralVitaminChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

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
    const [portionType_minerals, setPortionType_minerals] = useState<string>(chartConfigMinerals.portionType)
    const [expand100_minerals, setExpand100_minerals] = useState<boolean>(chartConfigMinerals.expand100)
    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        if (props.directCompareConfig) {
            setPortionType_vitamins(chartConfigVitamins.portionType)
            setExpand100_vitamins(chartConfigVitamins.expand100)
            setPortionType_minerals(chartConfigMinerals.portionType)
            setExpand100_minerals(chartConfigMinerals.expand100)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
        updateChartConfig()
    }, [portionType_vitamins, portionType_minerals, expand100_vitamins, expand100_minerals, chartHeight, props])


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
            return portionType_minerals !== config.portionType || expand100_minerals !== config.expand100
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
                        portionType: portionType_minerals,
                        expand100: expand100_minerals
                    }
                }

                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }


    const createVitaminChartData = () => {
        const vitaminData = props.precalculatedData !== undefined ? props.precalculatedData : getNutrientData(props.selectedFoodItem).vitaminData;

        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData;
        const userData = applicationContext.userData
        const portionAmount = portionType_vitamins === GRAM ? 100 : props.selectedFoodItem.portion.amount

        if (!vitaminData || !requirementData) {
            return null
        }

        const chartDisplayData = getVitaminChartData(vitaminData, requirementData, userData, portionAmount)

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_chart_green_3

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                label: applicationStrings.label_charttype_vitamins[lang],
                data: chartDisplayData.values,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }

    const createMineralChartData = () => {
        const mineralData = props.precalculatedData !== undefined ? props.precalculatedData : getNutrientData(props.selectedFoodItem).mineralData;
        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData;
        const userData = applicationContext.userData
        const portionAmount = portionType_minerals === GRAM ? 100 : props.selectedFoodItem.portion.amount

        if (!mineralData || !requirementData) {
            return null
        }

        const chartDisplayData = getMineralsChartData(mineralData, requirementData, userData, portionAmount, lang)

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_purple

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                label: applicationStrings.label_charttype_minerals[lang],
                data: chartDisplayData.values,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]
        };
    }

    const handleRadioButtonClick = (event: any): void => {
        if (props.selectedSubChart === CHART_VITAMINS) {
            setPortionType_vitamins(event.target.value)
        } else if (props.selectedSubChart === CHART_MINERALS) {
            setPortionType_minerals(event.target.value)
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
            if (expand100) {
                if (maxYValue === undefined) {
                    if (overallMaxValue < 100) {
                        maxYValue = 100
                    }
                } else if (maxYValue < 100) {
                    maxYValue = 100
                }
            }
        }

        const getScientificVitaminName = (vitamin: string): string | null => {
            const labelName = "label_nutrient_vit_scientific_" + vitamin.toLowerCase()
            if(applicationStrings[labelName]) {
                return applicationStrings[labelName][lang]
            } else {
                return null
            }
        }

        let barChartOptions = getBarChartOptions(title, "%", maxYValue);

        if (props.selectedSubChart === CHART_VITAMINS) {
            barChartOptions = {
                ...barChartOptions, plugins: {
                    ...barChartOptions.plugins, tooltip: {
                        ...barChartOptions.plugins.tooltip, callbacks: {
                            ...barChartOptions.plugins.tooltip.callbacks,
                            title: function (context) {
                                if (context && context.length > 0) {
                                    const scientificName = getScientificVitaminName(context[0].label)
                                    let title = `Vitamin ${context[0].label}`
                                    if(scientificName) {
                                        title = `${title}  (${scientificName})`
                                    }
                                    return title
                                }
                            }
                        }
                    }
                }
            }
        }

        return barChartOptions
    }


    const renderChartConfigurationForm = () => {
        const portionType = props.selectedSubChart === CHART_VITAMINS ? portionType_vitamins : portionType_minerals;
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
    const containerHeight = calculateChartContainerHeight(windowSize, props.directCompareUse)

    return (
        <div className="container-fluid">
            <div className="row" style={{height: containerHeight}} key={"base chart container " + containerHeight}>
                <div className={"col-12"}>
                    <Bar
                        data={data}
                        key={'chart ' + chartHeight}
                        height={chartHeight}
                        options={options}
                    />
                </div>
            </div>
            {props.directCompareUse !== true &&
            <div className="chart-control-button-bar">
                {renderChartConfigurationForm()}
            </div>
            }
        </div>
    )

}