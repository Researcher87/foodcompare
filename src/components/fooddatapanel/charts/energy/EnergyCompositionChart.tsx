import {ChartProps} from "../../../../types/livedata/ChartPropsData";
import {applicationStrings} from "../../../../static/labels";
import {Pie} from "react-chartjs-2";
import React, {useContext} from "react";
import {getPieChartOptions} from "../../../../service/ChartConfigurationService";
import {LanguageContext} from "../../../../contexts/LangContext";
import {getNutrientData} from "../../../../service/nutrientdata/NutrientDataRetriever";
import * as ChartConfig from "../../../../config/ChartConfig";
import {calculateEnergyData} from "../../../../service/calculation/EnergyService";
import {CustomLegend} from "../../../charthelper/CustomLegend";
import {showEnergyChartLegend} from "../../../../service/chartdata/BaseChartDataService";
import {isMobileDevice} from "../../../../service/WindowDimension";
import {autoRound} from "../../../../service/calculation/MathService";

export function EnergyCompositionChart(props: ChartProps) {
    const language = useContext(LanguageContext).language
    const nutrientData = getNutrientData(props.selectedFoodItem);
    const portionAmount = props.selectedFoodItem.portion.amount

    if(!nutrientData.baseData.energy) {
        return <div>No data</div>
    }

    const energy100g = Math.round(nutrientData.baseData.energy)

    const transformToPortion = (value) => {
        return autoRound((value * portionAmount) / 100)
    }

    const createData = () => {
        const energyData = calculateEnergyData(nutrientData.baseData)

        if (!energyData) {
            return
        }

        const labels = [
            applicationStrings.label_nutrient_carbohydrates[language],
            applicationStrings.label_nutrient_dietaryFibers[language],
            applicationStrings.label_nutrient_lipids[language],
            applicationStrings.label_nutrient_proteins[language],
            applicationStrings.label_nutrient_alcohol[language],
        ]

        const values = [
            transformToPortion(energyData.carbohydrates - energyData.dietaryFibers),
            transformToPortion(energyData.dietaryFibers),
            transformToPortion(energyData.fat),
            transformToPortion(energyData.proteins),
            transformToPortion(energyData.alcohol),
        ]

        const colors = [
            ChartConfig.color_carbs,
            ChartConfig.color_carbs_dietaryFibers,
            ChartConfig.color_lipids,
            ChartConfig.color_proteins,
            ChartConfig.color_alcohol,
        ]

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

    const getOptions = () => {
        let title = applicationStrings.label_charttype_energy_composition[language];
        return getPieChartOptions(title, "kcal");
    }

    const chartClass = props.directCompareUse ? "col-12 chart-area-dc" : "col-12 chart-area"

    if (!data) {
        return (
            <div className={chartClass}>
                {applicationStrings.label_noData[language]}
            </div>
        )
    }

    const keyWordStyle = {minWidth: "15ch", fontWeight: "bold", fontSize: "0.8rem"}

    const makeValue = (value: number) => {
        return <span style={{fontSize: "0.8rem"}}>1 g ≈ {value} kcal</span>
    }

    const energyPerPortion = transformToPortion(nutrientData.baseData.energy)

    return (
        <div className={"container row"}>
            <div className={"col-7"}>
                <div className={chartClass}>
                    <Pie data={data}
                         key={'chart carbs'}
                         options={getOptions()}
                    />
                </div>
            </div>
            <div className={"col-5"}>
                <div style={{paddingTop: "1vh", paddingBottom: "1vh"}}>
                    {!isMobileDevice()
                        ? <div className={"header-label-small"}>
                            <span style={{paddingRight: "1.25ch"}}>
                                <b>{energy100g} kcal / 100 g</b>
                            </span>
                            <span>
                                <b>({energyPerPortion} kcal {applicationStrings.label_per_portion[language]})</b>
                            </span>
                        </div>
                        : <p><b>{energy100g} kcal / 100 g ({energyPerPortion} kcal {applicationStrings.label_per_portion[language]})</b></p>
                    }
                </div>
                <div style={{borderLeft: "1px solid #aaaaaa", paddingLeft: "0.5vw", paddingBottom: "2vh"}}>
                    <div className={"d-flex flex-row align-items-baseline"}>
                        <div style={keyWordStyle}>{applicationStrings.label_nutrient_carbohydrates[language]}:</div>
                        <div>{makeValue(4)}</div>
                    </div>
                    <div className={"d-flex flex-row align-items-baseline"}>
                        <div style={keyWordStyle}>{applicationStrings.label_nutrient_dietaryFibers[language]}:</div>
                        <div>{makeValue(2)}</div>
                    </div>
                    <div className={"d-flex flex-row align-items-baseline"}>
                        <div style={keyWordStyle}>{applicationStrings.label_nutrient_lipids[language]}:</div>
                        <div>{makeValue(9)}</div>
                    </div>
                    <div className={"d-flex flex-row align-items-baseline"}>
                        <div style={keyWordStyle}>{applicationStrings.label_nutrient_proteins[language]}:</div>
                        <div>{makeValue(4)}</div>
                    </div>
                    <div className={"d-flex flex-row align-items-baseline"}>
                        <div style={keyWordStyle}>{applicationStrings.label_nutrient_alcohol[language]}:</div>
                        <div>{makeValue(7)}</div>
                    </div>
                </div>
                <CustomLegend legendData={showEnergyChartLegend(language)}/>
            </div>
        </div>
    )

}