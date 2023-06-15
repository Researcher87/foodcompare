import {ChartItem} from "../../service/RankingService";
import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {color_green} from "../../config/ChartConfig";
import {getBarChartOptionsForRanking} from "../../service/ChartConfigurationService";
import {Bar} from "react-chartjs-2";
import {applicationStrings} from "../../static/labels";
import {isMobileDevice} from "../../service/WindowDimension";

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

        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: color_green,
                borderWidth: 2,
                borderColor: '#555',
            }]
        };
    }

    const getOptions = () => {
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
    const options = getOptions();
    const dataAvailable = chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0;

    const width = isMobileDevice()
        ? 40 * props.chartItems.length + 150
        : 50 * props.chartItems.length + 150
    const height = isMobileDevice() ? 200 : 500;
    const maxWidth = isMobileDevice() ? "90vw": 1000;

    let containerStyle: any = {
        position: "relative",
        width: `${width}px`
    }

    if(isMobileDevice()) {
        containerStyle.height = `90vh`
    }

    return (
        <div>
            <div className="smooth-scroll" style={{overflowX: "auto", position: "absolute", maxWidth: maxWidth}}>
                {dataAvailable &&
                    <div style={containerStyle}>
                        <Bar id="chart"
                             data={chartData}
                             height={height}
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