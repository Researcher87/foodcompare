import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import {CHART_MINERALS, CHART_VITAMINS} from "../../config/Constants";
import {DirectCompareDataPanelProps} from "./DirectCompareDataPanel";
import {determineFoodRequirementRatio} from "../../service/calculation/DietaryRequirementService";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {roundToNextValue} from "../../service/ChartService";

interface DC_MineralVitaminChartProps extends DirectCompareDataPanelProps {
    chartType: string
}

export function DC_MineralVitaminChart(props: DC_MineralVitaminChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)

    if (!applicationContext) {
        return <div></div>
    }

    const nutrientData1 = props.selectedFoodItem1.foodItem.nutrientDataList[0]
    const nutrientData2 = props.selectedFoodItem2.foodItem.nutrientDataList[0]

    const dataSet1 = props.chartType === CHART_VITAMINS ? nutrientData1.vitaminData : nutrientData1.mineralData
    const dataSet2 = props.chartType === CHART_VITAMINS ? nutrientData2.vitaminData : nutrientData2.mineralData

    const requirementData = props.chartType === CHART_VITAMINS
        ? applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData
        : applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData

    if (!requirementData) {
        return <div></div>
    }

    let maxValue = 0
    for (let dataSet1Key in dataSet1) {
        if(requirementData[dataSet1Key]) {
            const ratioValue = determineFoodRequirementRatio(requirementData[dataSet1Key], dataSet1[dataSet1Key],
                props.selectedFoodItem1.portion.amount, applicationContext.userData)
            if(ratioValue > maxValue) {
                maxValue = ratioValue
            }
        }
    }

    for (let dataSet2Key in dataSet2) {
        if(requirementData[dataSet2Key]) {
            const ratioValue = determineFoodRequirementRatio(requirementData[dataSet2Key], dataSet1[dataSet2Key],
                props.selectedFoodItem1.portion.amount, applicationContext.userData)
            if(ratioValue > maxValue) {
                maxValue = ratioValue
            }
        }
    }

    const maxY = roundToNextValue(maxValue)

    const preconfig = {
        maxValue: maxY,
        chartType: props.chartType,
        expand100: false
    }

    return <div>
        <MineralVitaminChart selectedSubChart={props.chartType} selectedFoodItem={props.selectedFoodItem1}
                             directCompareUse={true} presetConfig={preconfig}/>
        <MineralVitaminChart selectedSubChart={props.chartType} selectedFoodItem={props.selectedFoodItem2}
                             directCompareUse={true} presetConfig={preconfig}/>
    </div>

}