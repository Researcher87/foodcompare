import {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import * as ChartConfig from "../../../config/ChartConfig"
import {Bar, Chart} from "react-chartjs-2";
import {getBarChartOptions} from "../../../service/ChartConfigurationService";
import {applicationStrings} from "../../../static/labels";
import {calculateBMR, calculateTotalEnergyConsumption} from "../../../service/calculation/EnergyService";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {default_chart_height} from "../../../config/ChartConfig";
import annotationPlugin from 'chartjs-plugin-annotation'
import {ChartProps} from "../../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../../service/WindowDimension";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";

export default function EnergyDataChart(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    const nutrientData = props.selectedFoodItem.foodItem.nutrientDataList[0];
    const energy100g = nutrientData.baseData.energy;

    Chart.register(annotationPlugin)

    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
    }, [chartHeight])

    if (!applicationContext || !energy100g) {
        return <div>No data.</div>
    }

    const createEnergyLevelChart = () => {
        const averagePortion = props.selectedFoodItem.portion.amount
        const energyPortion = Math.round(energy100g / 100 * averagePortion);

        return {
            labels: ["100 g", "Portion"],
            datasets: [{
                data: [energy100g,
                    energyPortion
                ],
                backgroundColor: [
                    ChartConfig.color_yellow,
                    ChartConfig.color_red,
                ],
                borderWidth: 2,
                borderColor: '#555',
            }]

        }
    }


    const renderUserDataInfoPage = () => {
        return (
            <div style={{paddingLeft: "50px", paddingTop: "50px"}}>
                {applicationContext.userData.initialValues ?
                    (<div>
                        <p>{applicationStrings.text_setUserdata_p1[lang]}</p>
                        <p>{applicationStrings.text_setUserdata_p2[lang]}</p>
                    </div>)
                    :
                    <p>{applicationStrings.text_setUserdata_p3[lang]}</p>
                }
            </div>
        )
    }


    const getOptions = () => {
        const {age, size, weight, sex, palValue, leisureSports} = applicationContext.userData
        const bmr = calculateBMR(age, size, weight, sex);
        const totalEnergy = calculateTotalEnergyConsumption(bmr, palValue, leisureSports);

        const annotation = {
            annotations: {
                line1: {
                    type: 'line',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    yMin: bmr,
                    yMax: bmr,
                    borderColor: ChartConfig.color_line_red,
                    borderWidth: 4,
                    label: {
                        enabled: true,
                        content: applicationStrings.label_chart_bmr[lang]
                    }
                },
                line2:
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        yMin: totalEnergy,
                        yMax: totalEnergy,
                        borderColor: ChartConfig.color_line_blue,
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            content: applicationStrings.label_chart_energyExpenditure[lang]
                        }
                    },
            }
        }

        let options: any = getBarChartOptions(applicationStrings.label_charttype_energy[languageContext.language], "kCal");
        options = {
            ...options, plugins: {
                ...options.plugins,
                annotation: annotation
            }
        }

        return options;
    }

    const data = createEnergyLevelChart();
    if (!data) {
        return <div style={{height: default_chart_height}}>{applicationStrings.label_noData[lang]}</div>
    }

    const containerHeight = calculateChartContainerHeight(windowSize,  props.directCompareUse)

    return (
        <div className="container-fluid" >
            <div className="row " style={{height: containerHeight}} key={"energy container " + containerHeight}>
                <div className="col-6">
                    <div>
                        <Bar
                            data={data}
                            key={'chart ' + chartHeight}
                            height={chartHeight}
                            options={getOptions()}
                            type={"bar"}
                        />
                    </div>
                </div>
                <div className="col-6">
                    {renderUserDataInfoPage()}
                </div>
            </div>
            <div style={{height: "64px"}}></div>
        </div>
    )

}