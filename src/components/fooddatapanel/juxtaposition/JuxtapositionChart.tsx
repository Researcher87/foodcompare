import {JuxtapositionChartProps} from "../../../types/livedata/ChartPropsData";
import {color_line_blue, color_line_red} from "../../../config/ChartConfig";
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
        applicationContext.applicationData.foodDataPanel.selectedFoodItems.length
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

    const getOptions = (title: string, unit: string, nutrientIndex: number) => {
        let options = getBarChartOptionsForJuxtaposition(title, unit)

        const barIndexOfSelectedFoodItem = chartData[nutrientIndex].chartItems.findIndex(
            chartItem => chartItem.id === props.selectedFoodItem.id
        )

        const ticks = {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            color: color_line_red,
            callback: function (value, index) {
                return index === barIndexOfSelectedFoodItem ? "▲" : ""
            }
        }

        options = {
            ...options, scales: {
                ...options.scales, x: {
                    ...options.scales.x, ticks: ticks
                }
            }
        }

        return options
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
            const dataAvailable = true   // Todo: calculate

            return (
                <div key={`juxchartdiv-${chartData.nutrientName}`}>
                    <div className="smooth-scroll">
                        {dataAvailable &&
                            <div>
                                <div>
                                    <Bar key={`juxchart-${chartData.nutrientName}`}
                                         data={chartDataObj}
                                         height={200}
                                         options={options}
                                    />
                                </div>
                                <hr/>
                            </div>
                        }
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