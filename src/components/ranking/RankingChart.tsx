import {ChartItem} from "../../service/RankingService";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {color_green} from "../../config/ChartConfig";
import {getBarChartOptionsForRanking} from "../../service/ChartConfigurationService";
import {Bar} from "react-chartjs-2";
import {applicationStrings} from "../../static/labels";

interface RankingChartProps {
    chartItems: Array<ChartItem>
    unit: string
    selectedElement: string
}

export function RankingChart(props: RankingChartProps) {
    const {language} = useContext(LanguageContext)

    const createChartData = () => {
        const labels: Array<String> = [];
        const data: Array<number> = [];

        for (let i = 0; i < props.chartItems.length; i++) {
            const chartItem = props.chartItems[i];

            const name = chartItem.name
            labels.push(name);
            data.push(chartItem.value);
        }

        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: color_green,
                borderWidth: 2,
                borderColor: '#555',
            }]

        }

        return chartData;
    }

    const getOptions = (title) => {
        let options = getBarChartOptionsForRanking(props.selectedElement, props.unit)
        options = {
            ...options, plugins: {
                ...options.plugins, title: {
                    ...options.plugins.title,
                    position: "left"
                }
            }
        }
        return options
    }


    const chartData: any = createChartData();
    const title = "Title?";
    const options = getOptions(title);
    const dataAvailable = chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0;

    const width = 50 * props.chartItems.length + 150;

    console.log('Chart items: ', props.chartItems)

    return (
        <div>
            <div className="smooth-scroll" style={{overflowX: "auto", position: "absolute", maxWidth: "1000px"}}>
                {dataAvailable &&
                <div style={{position: "relative", width: `${width}px`}}>
                    <Bar id="chart"
                         data={chartData}
                         height={500}
                         options={options}
                    />
                </div>
                }
                {!dataAvailable &&
                <span>{applicationStrings.label_noData[language]}</span>
                }
            </div>
        </div>

    )

}