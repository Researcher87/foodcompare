import {useContext} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import * as ChartConfig from "../../../config/ChartConfig"
import {Bar, Chart} from "react-chartjs-2";
import {getBarChartOptions} from "../../../service/ChartConfigurationService";
import {applicationStrings} from "../../../static/labels";
import {calculateBMR, calculateTotalEnergyConsumption} from "../../../service/calculation/EnergyService";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {ChartProps} from "../../../types/livedata/ChartPropsData";
import {isMobileDevice, useWindowDimension} from "../../../service/WindowDimension";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";

export default function EnergyDataChart(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    const nutrientData = getNutrientData(props.selectedFoodItem);
    const energy100g = nutrientData.baseData.energy;

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
        const showInfotext = !(isMobileDevice() && props.directCompareUse)

        return (
            <div style={{paddingLeft: "2vw", paddingTop: "2vh", maxWidth: "90%"}}>
                {!isMobileDevice()
                    ? <div className={"header-label"}><b>{`${energy100g}`} kcal / 100 g</b></div>
                    : <p><b>{`${energy100g}`} kcal / 100 g</b></p>
                }

                {showInfotext &&
                <div className="text-small" style={{paddingTop: "30px"}}>
                    {applicationContext.userData.initialValues ?
                        (<div>
                            <p>{applicationStrings.text_setUserdata_p1[lang]}</p>
                            <p>{applicationStrings.text_setUserdata_p2[lang]}</p>
                        </div>)
                        :
                        <p>{applicationStrings.text_setUserdata_p3[lang]}</p>
                    }
                </div>
                }
            </div>
        )
    }


    const getOptions = () => {
        const {age, size, weight, sex, palValue, leisureSports} = applicationContext.userData
        const bmr = calculateBMR(age, size, weight, sex);
        const totalEnergy = calculateTotalEnergyConsumption(bmr, palValue, leisureSports);

        if (props.directCompareUse) {

        }

        const annotation1 = {
            drawTime: 'afterDatasetsDraw',
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
            },
        }

        const annotation2 =
            {
                drawTime: 'afterDatasetsDraw',
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
            }

        const annotation = {
            annotations: {
                line1: annotation1,
                line2: !(props.directCompareUse && isMobileDevice()) ? annotation2 : undefined,
            }
        }

        let options: any = getBarChartOptions(applicationStrings.label_charttype_energy[languageContext.language], "kcal");
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
        return <div>{applicationStrings.label_noData[lang]}</div>
    }

    const chartClass = props.directCompareUse ? "col-12 chart-area-dc" : "col-12 chart-area"

    return (
        <div className="container-fluid">
            <div className="row " key={"energy container"}>
                <div className="col-7">
                    <div className={chartClass}>
                        <Bar
                            data={data}
                            key={'chart energy'}
                            options={getOptions()}
                        />
                    </div>
                </div>
                <div className="col-5">
                    {renderUserDataInfoPage()}
                </div>
            </div>
        </div>
    )

}