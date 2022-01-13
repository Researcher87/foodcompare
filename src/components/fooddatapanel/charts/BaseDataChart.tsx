import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {applicationStrings} from "../../../static/labels";
import * as ChartConfig from "../../../config/ChartConfig"
import {CHART_TYPE_BAR, CHART_TYPE_PIE, TAB_BASE_DATA} from "../../../config/Constants";
import {Bar, Pie} from "react-chartjs-2";
import {getBarChartOptions, getPieChartOptions} from "../../../service/ChartConfigurationService";
import {PieChartConfigurationForm} from "../../charthelper/PieChartConfigurationForm";
import {CustomLegend} from "../../charthelper/CustomLegend";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BaseDataChartProps} from "../../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../../service/WindowDimension";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {ChartDisplayData} from "../../../types/livedata/ChartDisplayData";
import {getBaseChartLegendData, getNutrientChartData, getTotalChartData} from "../../../service/chartdata/BaseChartDataService";

export default function BaseDataChart(props: BaseDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    const chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.baseChartConfig
            : initialChartConfigData.baseChartConfig

    const showDetailsProp = chartConfig.showDetails
        ? chartConfig.showDetails
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.baseChartConfig.showDetails
            : initialChartConfigData.baseChartConfig.showDetails

    const [chartType, setChartType] = useState<string>(chartConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(chartConfig.showLegend)
    const [showDetails, setShowDetails] = useState<boolean>(showDetailsProp)
    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse, TAB_BASE_DATA))

    useEffect(() => {
        if (props.directCompareConfig) {
            setChartType(chartConfig.chartType)
            setShowLegend(chartConfig.showLegend)
            setShowDetails(showDetailsProp)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse, TAB_BASE_DATA))
        updateChartConfig()
    }, [chartType, showDetails, showLegend, chartHeight, props])

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
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }

    const createTotalChartData = () => {
        const category = props.selectedFoodItem.foodClass?.category
        const nutrientData = getNutrientData(props.selectedFoodItem)
        const chartDisplayData: ChartDisplayData = getTotalChartData(nutrientData, lang, category)

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                label: applicationStrings.label_chart_totalComposition[lang],
                data: chartDisplayData.values,
                backgroundColor: chartDisplayData.colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }

    const createNutrientChartData = () => {
        const category = props.selectedFoodItem.foodClass?.category
        const nutrientData = getNutrientData(props.selectedFoodItem)
        const chartDisplayData: ChartDisplayData = getNutrientChartData(nutrientData, lang, showDetails, category)

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                label: applicationStrings.label_chart_nutrientComposition[lang],
                data: chartDisplayData.values,
                backgroundColor: chartDisplayData.colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
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


    const renderSubChart = (title: string, chartData: any) => {
        if (!chartData) {
            return <div/>
        }

        return (
            <div>
                {chartType === CHART_TYPE_PIE &&
                <Pie
                    data={chartData}
                    key={'chart ' + chartHeight}
                    height={chartHeight}
                    width={ChartConfig.basedata_piechart_width}
                    options={getOptions(title)}/>
                }
                {chartType === CHART_TYPE_BAR &&
                <Bar
                    data={chartData}
                    key={'chart ' + chartHeight}
                    height={chartHeight}
                    width={ChartConfig.basedata_barchart_width}
                    options={getOptions(title)}/>
                }
            </div>
        )
    }

    const totalChartData = createTotalChartData();
    const nutrientChartData = createNutrientChartData();

    const totalChartDataTitle = applicationStrings.label_chart_totalComposition[lang]
    const nutrientChartDataTitle = applicationStrings.label_chart_nutrientComposition[lang]

    const containerHeight = calculateChartContainerHeight(windowSize, props.directCompareUse)
    const justifyContent = props.directCompareUse ? "center" : "left"

    return (
        <div className="container-fluid">
            <div className="d-flex text-align-center" style={{justifyContent: justifyContent}}>
                <div className="d-inline-block">
                    <div className="row" style={{height: containerHeight}}
                         key={"base chart container " + containerHeight}>
                        <div className="col-6">
                            <div>{renderSubChart(totalChartDataTitle, totalChartData)}</div>
                        </div>
                        <div className="col-6">
                            <div>{renderSubChart(nutrientChartDataTitle, nutrientChartData)}</div>
                        </div>
                    </div>
                </div>
                {legendAllowed &&
                <div className="d-inline-block float-right">
                    <CustomLegend legendData={getBaseChartLegendData(lang, showDetails, props.selectedFoodItem.foodClass?.category)}/>
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