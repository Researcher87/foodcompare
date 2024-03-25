import {ChartProps} from "../../../../types/livedata/ChartPropsData";
import {Pie, Bar} from "react-chartjs-2";
import React, {useContext} from "react";
import {applicationStrings} from "../../../../static/labels";
import {getBarChartOptions, getPieChartOptions} from "../../../../service/ChartConfigurationService";
import {LanguageContext} from "../../../../contexts/LangContext";
import {getNameFromFoodNameList} from "../../../../service/nutrientdata/NameTypeService";
import {ApplicationDataContextStore} from "../../../../contexts/ApplicationDataContext";
import {getNutrientData} from "../../../../service/nutrientdata/NutrientDataRetriever";

var ColorScheme = require('color-scheme');

export function AggregatedEnergyChart(props: ChartProps) {
    const language = useContext(LanguageContext).language
    const applicationContext = useContext(ApplicationDataContextStore)

    if (!applicationContext) {
        return <div/>
    }

    const createData = () => {
        const labels: Array<string> = []
        const values: Array<number> = []

        // Generate colors
        const scheme = new ColorScheme;
        scheme.from_hue(150).scheme('contrast').variation('pastel');
        let colors = scheme.colors().map(str => `#${str}`)
        scheme.from_hue(80).scheme('contrast').variation('pastel');
        const colors2 = scheme.colors().map(str => `#${str}`)
        scheme.from_hue(220).scheme('contrast').variation('pastel');
        const colors3 = scheme.colors().map(str => `#${str}`)
        colors = colors.concat(colors2)
        colors = colors.concat(colors3)

        const subElementsSorted = [...props.selectedFoodItem.compositeSubElements!!]
        subElementsSorted.sort((a, b) => {
            const nutrientDataA = getNutrientData(a)
            const nutrientDataB = getNutrientData(b)

            const energy100A = nutrientDataA.baseData.energy ?? 0
            const energyA = Math.round(a.portion.amount * energy100A / 100)

            const energy100B = nutrientDataB.baseData.energy ?? 0
            const energyB = Math.round(b.portion.amount * energy100B / 100)

            return energyB - energyA
        })

        subElementsSorted.forEach(item => {
            const name = getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, item.foodItem.nameId!!, language) ?? ''
            labels.push(name)

            const nutrientData = getNutrientData(item)
            const energy100 = nutrientData.baseData.energy ?? 0
            const energy = Math.round(item.portion.amount * energy100 / 100)
            values.push(energy)
        })

        return {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }

    const data = createData()

    const getOptionsPieChart = () => {
        let title = applicationStrings.label_charttype_energy_aggregated_title[language];
        return getPieChartOptions(title, "kcal");
    }

    const getOptionsBarChart = () => {
        let title = applicationStrings.label_charttype_energy_aggregated_title[language];
        const options = getBarChartOptions(title, "kcal");

        const scales = {
            xAxes: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 90,
                    minRotation: 90,
                    callback: function (index) {
                        const name = data.labels[index]
                        return name.length > 12 ? name.substring(0, 10) + "..." : name
                    },
                }
            }
        }

        return {...options, scales: scales}
    }

    let classPieChart = "col-6"
    let classBarChart = "col-6"
    const numberOfElements = props.selectedFoodItem.compositeSubElements?.length ?? 0

    if (numberOfElements >= 15) {
        let classPieChart = "col-5"
        let classBarChart = "col-7"
    }


    return (
        <div className={"container row"}>
            <div className={classPieChart}>
                <div className={"chart-area"}>
                    <Pie data={data}
                         key={'chart carbs'}
                         options={getOptionsPieChart()}
                    />
                </div>
            </div>
            <div className={classBarChart}>
                <div className={"chart-area"}>
                    <Bar data={data}
                         key={'chart carbs'}
                         options={getOptionsBarChart()}
                    />
                </div>
            </div>
        </div>
    )

}