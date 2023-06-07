import {JuxtapositionChartProps} from "../../../types/livedata/ChartPropsData";
import {color_chart_black, color_gray, color_line_blue, color_line_red} from "../../../config/ChartConfig";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {
    createChartDataForJuxtapostionChart, getFoodItemsForComparison,
    JuxtapostionChartData
} from "../../../service/chartdata/JuxtapositionDataService";
import {LanguageContext} from "../../../contexts/LangContext";
import {Bar} from "react-chartjs-2";
import {
    getBarChartOptionsForJuxtaposition
} from "../../../service/ChartConfigurationService";
import SelectedFoodItem from "../../../types/livedata/SelectedFoodItem";
import {CHART_SIZE_LARGE, CHART_SIZE_MEDIUM, CHART_SIZE_SMALL} from "../../../config/Constants";
import {shortenName} from "../../../service/nutrientdata/NameTypeService";


export function JuxtapositionChart(props: JuxtapositionChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    if (applicationContext === null) {
        throw new Error("Application context is unavailable.")
    }

    const [chartData, setChartData] = useState<Array<JuxtapostionChartData>>([])


    useEffect(() => {
        updateChart()
    }, [
        applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
        applicationContext.applicationData.foodDataPanel.selectedFoodItems.length,
        applicationContext.applicationData.foodDataPanel.selectedFoodItemIndex
    ])

    const updateChart = async () => {
        const selectedFoodItemsInPanel = applicationContext.applicationData.foodDataPanel.selectedFoodItems
        const foodDataCorpus = applicationContext.foodDataCorpus
        const {selectedReference, selectedFoodItem} = props
        const referenceData = getFoodItemsForComparison(selectedReference, foodDataCorpus, selectedFoodItem,
            selectedFoodItemsInPanel)

        const newChartData = await createChartDataForJuxtapostionChart(props, foodDataCorpus, referenceData, language)
        setChartData(newChartData)
    }

    const showLabels = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData.showLabels

    const getOptions = (title: string, unit: string, nutrientIndex: number) => {
        let options = getBarChartOptionsForJuxtaposition(title, unit)

        const barIndexOfSelectedFoodItem = chartData[nutrientIndex].chartItems.findIndex(
            chartItem => chartItem.id === props.selectedFoodItem.id
        )

        const color = showLabels ? color_chart_black : color_line_red
        const maxRotation = showLabels ? 90 : 0
        const minRotation = showLabels ? 90 : 0

        const numberOfItemsInChart = chartData[nutrientIndex].chartItems.length
        const maxNumberOfTicks = 60

        const ticks = {
            autoSkip: false,
            color: color,
            minRotation: minRotation,
            maxRotation: maxRotation,
            callback: function (value, index) {
                const label = showLabels ? chartData[nutrientIndex].chartItems[index].name : ""
                const marker = showLabels ? "►" : "▲"

                if(numberOfItemsInChart <= maxNumberOfTicks) {   // Not too many bars in chart => you can print any label then
                    return index === barIndexOfSelectedFoodItem ? marker : shortenName(label, 18)
                } else { // Too many bars in chart => print only every nth label
                    const skip = Math.ceil(numberOfItemsInChart / maxNumberOfTicks)
                    return (index % skip === 0 || index === barIndexOfSelectedFoodItem)
                        ? index === barIndexOfSelectedFoodItem
                            ? marker
                            : shortenName(label, 18)
                        : ""
                }
            }
        }

        options = {
            ...options, scales: {
                ...options.scales, x: {
                    ...options.scales.x,
                    ticks: ticks
                }
            }
        }

        return options
    }


    const chartHeightCategory = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData.chartSize
    let height
    switch (chartHeightCategory) {
        case CHART_SIZE_SMALL:
            height = 125
            break
        default:
        case CHART_SIZE_MEDIUM:
            height = 200
            break
        case CHART_SIZE_LARGE:
            height = 300
            break
    }

    if(showLabels) {
        height += 115
    }

    const renderChartsOfGroup = () => {
        return chartData.map((chartData, nutrientIndex) => {
            const labels: string[] = []
            const data: number[] = []
            const colors: string[] = []
            chartData.chartItems.forEach((chartItem) => {
                const name = chartItem.name
                const color = chartItem.id === props.selectedFoodItem.id ? color_line_red : color_line_blue
                labels.push(name);
                data.push(chartItem.value);
                colors.push(color)
            })

            const chartDataObj = {
                labels: labels,
                datasets: [{
                    label: "",
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2
                }]
            }

            const options = getOptions(chartData.nutrientName, chartData.unit, nutrientIndex)

            return (
                <div key={`juxchartdiv-${chartData.nutrientName}`}>
                    <div className="smooth-scroll">
                        <div>
                            <div style={{height: `${height}px`}}>
                                <Bar key={`juxchart-${chartData.nutrientName}`}
                                     data={chartDataObj}
                                     options={options}
                                />
                            </div>
                            <hr/>
                        </div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div>
            <div>{renderChartsOfGroup()}</div>
        </div>
    )

}