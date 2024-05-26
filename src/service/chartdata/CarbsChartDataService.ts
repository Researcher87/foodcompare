import {autoRound} from "../calculation/MathService";
import {applicationStrings} from "../../static/labels";
import * as ChartConfig from "../../config/ChartConfig";
import {NutrientData} from "../../types/nutrientdata/FoodItem";
import {ChartDisplayData, LegendData} from "../../types/livedata/ChartDisplayData";

export function getCarbBaseChartData(nutrientData: NutrientData, hideRemainders: boolean, totalAmount: number,
                                     language: string): ChartDisplayData | null {
    let totalCarbs = nutrientData.baseData.carbohydrates
    if(totalCarbs === 0) {
        return null
    }

    const dietaryFibers = nutrientData.baseData.dietaryFibers ? nutrientData.baseData.dietaryFibers : 0
    const sugar = nutrientData.carbohydrateData.sugar ? nutrientData.carbohydrateData.sugar : 0

    if(!dietaryFibers && !sugar) {
        return null
    }

    // Sometime the sum of the sub-data items is largen than the total carbs amount
    if(totalCarbs < (sugar+dietaryFibers)) {
        totalCarbs = sugar+dietaryFibers
    }

    const remainder = (sugar + dietaryFibers) < totalCarbs ? totalCarbs - sugar - dietaryFibers : 0
    const totalCarbsValue = hideRemainders ? totalCarbs - remainder : totalCarbs

    const valueSugar = sugar / totalCarbsValue * 100
    const valueDietaryFibers = dietaryFibers / totalCarbsValue * 100
    const valueRemainder = remainder / totalCarbsValue * 100;

    const labels = [applicationStrings.label_nutrient_sugar[language],
        applicationStrings.label_nutrient_dietaryFibers[language],
    ]

    const data = [
        autoRound(valueSugar),
        autoRound(valueDietaryFibers)
    ]

    const colors = [
        ChartConfig.color_chart_green_3,
        ChartConfig.color_chart_green_2,
    ]

    if(!hideRemainders && valueRemainder > 0) {
        labels.push(applicationStrings.label_nutrient_remainder[language])
        colors.push(ChartConfig.color_chart_misc)
        data.push(autoRound(valueRemainder))
    }

    return {
        labels: labels,
        values: data,
        colors: colors
    }
}

export function getCarbDetailsChartData(nutrientData: NutrientData, hideRemainders: boolean, totalAmount: number,
                                        language: string): ChartDisplayData | null {
    const {carbohydrateData, baseData} = nutrientData

    const totalCarbohydratesAmount = baseData.carbohydrates / totalAmount * 100

    const valueGlucose = carbohydrateData.glucose !== null ? carbohydrateData.glucose / totalAmount * 100 : 0;
    const valueFructose = carbohydrateData.fructose !== null ? carbohydrateData.fructose / totalAmount * 100 : 0;
    const valueGalactose = carbohydrateData.galactose !== null ? carbohydrateData.galactose / totalAmount * 100 : 0;
    const valueSucrose = carbohydrateData.sucrose !== null ? carbohydrateData.sucrose / totalAmount * 100 : 0;
    const valueLactose = carbohydrateData.lactose !== null ? carbohydrateData.lactose / totalAmount * 100 : 0;
    const valueMaltose = carbohydrateData.maltose !== null ? carbohydrateData.maltose / totalAmount * 100 : 0;
    const valueStarch = carbohydrateData.starch !== null ? carbohydrateData.starch / totalAmount * 100 : 0;
    const valueDietaryFibers = baseData.dietaryFibers !== null ? baseData.dietaryFibers / totalAmount * 100 : 0;

    if (!valueMaltose && !valueSucrose && !valueLactose && !valueGlucose && !valueFructose && !valueGalactose) {
        return null
    }

    const labels: string[] = []
    const data: number[] = []
    const colors: string[] = []

    const total = valueGlucose + valueFructose + valueGalactose + valueSucrose + valueLactose + valueMaltose 
        + valueStarch + valueDietaryFibers
    const valueRemainder = total < 100 ? 100 - total : 0 

    // Exceeding factor is used in case of the detail carbohydrates exceeding the actual amount of carbohydrates
    const exceedingFactor = total > totalCarbohydratesAmount
        ? total / totalCarbohydratesAmount
        : 1

    if (valueGlucose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_glucose[language])
        const value = hideRemainders ? valueGlucose / (100-valueRemainder) * 100 : valueGlucose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_mono_glucose)
    }
    if (valueFructose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_fructose[language])
        const value = hideRemainders ? valueFructose / (100-valueRemainder) * 100 : valueFructose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_mono_fructose)
    }
    if (valueGalactose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_galactose[language])
        const value = hideRemainders ? valueGalactose / (100-valueRemainder) * 100 : valueGalactose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_mono_galactose)
    }
    if (valueSucrose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_sucrose[language])
        const value = hideRemainders ? valueSucrose / (100-valueRemainder) * 100 : valueSucrose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_di_sucrose)
    }
    if (valueLactose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_lactose[language])
        const value = hideRemainders ? valueLactose / (100-valueRemainder) * 100 : valueLactose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_di_lactose)
    }
    if (valueMaltose) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_maltose[language])
        const value = hideRemainders ? valueMaltose / (100-valueRemainder) * 100 : valueMaltose / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_di_maltose)
    }
    if (valueStarch) {
        labels.push(applicationStrings.label_nutrient_carbohydrates_starch[language])
        const value = hideRemainders ? valueStarch / (100-valueRemainder) * 100 : valueStarch / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_starch)
    }

    if (valueDietaryFibers) {
        labels.push(applicationStrings.label_nutrient_dietaryFibers[language])
        const value = hideRemainders ? valueDietaryFibers / (100-valueRemainder) * 100 : valueDietaryFibers / exceedingFactor
        data.push(autoRound(value))
        colors.push(ChartConfig.color_carbs_dietaryFibers)
    }


    if(!hideRemainders) {
        labels.push(applicationStrings.label_nutrient_remainder[language])
        data.push(autoRound(valueRemainder))
        colors.push(ChartConfig.color_chart_misc)
    }

    return {
        labels: labels,
        values: data,
        colors: colors
    }
}


export function getCarbsBaseLegend(labels: string[], language: string): LegendData[] {
    const legendData: Array<any> = []

    if (labels.includes(applicationStrings.label_nutrient_sugar[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_sugar[language],
            color: ChartConfig.color_chart_green_3,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_dietaryFibers[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_dietaryFibers[language],
            color: ChartConfig.color_chart_green_2,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_remainder[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_remainder[language],
            color: ChartConfig.color_chart_misc,
        })
    }

    return legendData;
}


export function getCarbsDetailsLegend(labels: string[], language: string): LegendData[] {
    const legendData: Array<any> = []

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_glucose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_glucose[language],
            color: ChartConfig.color_carbs_mono_glucose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_fructose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_fructose[language],
            color: ChartConfig.color_carbs_mono_fructose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_galactose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_galactose[language],
            color: ChartConfig.color_carbs_mono_galactose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_sucrose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_sucrose[language],
            color: ChartConfig.color_carbs_di_sucrose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_lactose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_lactose[language],
            color: ChartConfig.color_carbs_di_lactose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_maltose[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_maltose[language],
            color: ChartConfig.color_carbs_di_maltose,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_carbohydrates_starch[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_carbohydrates_starch[language],
            color: ChartConfig.color_carbs_starch,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_dietaryFibers[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_dietaryFibers[language],
            color: ChartConfig.color_carbs_dietaryFibers,
        })
    }

    if (labels.includes(applicationStrings.label_nutrient_remainder[language])) {
        legendData.push({
            item: applicationStrings.label_nutrient_remainder[language],
            color: ChartConfig.color_chart_misc,
        })
    }

    return legendData;
}