import {autoRound} from "../calculation/MathService";
import {applicationStrings} from "../../static/labels";
import * as ChartConfig from "../../config/ChartConfig";
import {NutrientData} from "../../types/nutrientdata/FoodItem";
import {ChartDisplayData, LegendData} from "../../types/livedata/ChartDisplayData";

export function getCarbBaseChartData(nutrientData: NutrientData, hideRemainders: boolean, totalAmount: number,
                                     language: string): ChartDisplayData | null {
    let totalCarbsAmount = nutrientData.baseData.carbohydrates;
    let dietaryFibers = nutrientData.baseData.dietaryFibers;
    let sugar = nutrientData.carbohydrateData.sugar

    // NOTE: Sometimes the sugar or dietary fibers value is above the carbs value, which is impossible (> 100 %)
    if(sugar && (sugar > totalCarbsAmount)) {
        sugar = totalCarbsAmount
    }
    if(dietaryFibers && (dietaryFibers > totalCarbsAmount)) {
        dietaryFibers = totalCarbsAmount
    }
    if(sugar && dietaryFibers && (sugar + dietaryFibers > totalCarbsAmount)) {  // Special case, where sug + fibers are above the 100 %
        sugar = (sugar / (sugar+dietaryFibers)) * totalCarbsAmount
        dietaryFibers = (dietaryFibers / (sugar+dietaryFibers)) * totalCarbsAmount
    }

    if (!sugar || !dietaryFibers) {
        return null
    }

    let valueRemainder = totalCarbsAmount - (sugar + dietaryFibers);
    if (valueRemainder < 0) {
        valueRemainder = 0
    }

    totalCarbsAmount = hideRemainders ? totalCarbsAmount - valueRemainder : totalCarbsAmount
    valueRemainder = autoRound(valueRemainder / totalCarbsAmount * 100);

    const valueSugar = autoRound(sugar / totalCarbsAmount * 100);
    const valueDietaryFibers = autoRound(dietaryFibers / totalCarbsAmount * 100);

    if (totalCarbsAmount === 0) {
        return null;
    }

    const labels = [applicationStrings.label_nutrient_sugar[language],
        applicationStrings.label_nutrient_dietaryFibers[language],
    ]

    const data = [valueSugar,
        valueDietaryFibers]

    const colors = [
        ChartConfig.color_chart_green_3,
        ChartConfig.color_chart_green_2,
    ]

    if(!hideRemainders) {
        labels.push(applicationStrings.label_nutrient_remainder[language])
        colors.push(ChartConfig.color_chart_misc)
        data.push(valueRemainder)
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

    const valueGlucose = carbohydrateData.glucose !== null ? autoRound(carbohydrateData.glucose / totalAmount * 100) : null;
    const valueFructose = carbohydrateData.fructose !== null ? autoRound(carbohydrateData.fructose / totalAmount * 100) : null;
    const valueGalactose = carbohydrateData.galactose !== null ? autoRound(carbohydrateData.galactose / totalAmount * 100) : null;
    const valueSucrose = carbohydrateData.sucrose !== null ? autoRound(carbohydrateData.sucrose / totalAmount * 100) : null;
    const valueLactose = carbohydrateData.lactose !== null ? autoRound(carbohydrateData.lactose / totalAmount * 100) : null;
    const valueMaltose = carbohydrateData.maltose !== null ? autoRound(carbohydrateData.maltose / totalAmount * 100) : null;
    const valueStarch = carbohydrateData.starch !== null ? autoRound(carbohydrateData.starch / totalAmount * 100) : null;

    const valueDietaryFibers = baseData.dietaryFibers !== null ? autoRound(baseData.dietaryFibers / totalAmount * 100) : null;

    if (!valueMaltose && !valueSucrose && !valueLactose && !valueGlucose && !valueFructose && !valueGalactose) {
        return null
    }

    let valueRemainder = 100

    const labels: string[] = []
    const data: number[] = []
    const colors: string[] = []

    if (valueGlucose) {
        valueRemainder -= valueGlucose
        labels.push(applicationStrings.label_nutrient_carbohydrates_glucose[language])
        data.push(valueGlucose)
        colors.push(ChartConfig.color_carbs_mono_glucose)
    }
    if (valueFructose) {
        valueRemainder -= valueFructose
        labels.push(applicationStrings.label_nutrient_carbohydrates_fructose[language])
        data.push(valueFructose)
        colors.push(ChartConfig.color_carbs_mono_fructose)
    }
    if (valueGalactose) {
        valueRemainder -= valueGalactose
        labels.push(applicationStrings.label_nutrient_carbohydrates_galactose[language])
        data.push(valueGalactose)
        colors.push(ChartConfig.color_carbs_mono_galactose)
    }
    if (valueSucrose) {
        valueRemainder -= valueSucrose
        labels.push(applicationStrings.label_nutrient_carbohydrates_sucrose[language])
        data.push(valueSucrose)
        colors.push(ChartConfig.color_carbs_di_sucrose)
    }
    if (valueLactose) {
        valueRemainder -= valueLactose
        labels.push(applicationStrings.label_nutrient_carbohydrates_lactose[language])
        data.push(valueLactose)
        colors.push(ChartConfig.color_carbs_di_lactose)
    }
    if (valueMaltose) {
        valueRemainder -= valueMaltose
        labels.push(applicationStrings.label_nutrient_carbohydrates_maltose[language])
        data.push(valueMaltose)
        colors.push(ChartConfig.color_carbs_di_maltose)
    }
    if (valueStarch) {
        valueRemainder -= valueStarch
        labels.push(applicationStrings.label_nutrient_carbohydrates_starch[language])
        data.push(valueStarch)
        colors.push(ChartConfig.color_carbs_starch)
    }

    if (valueDietaryFibers) {
        valueRemainder -= valueDietaryFibers
        labels.push(applicationStrings.label_nutrient_dietaryFibers[language])
        data.push(valueDietaryFibers)
        colors.push(ChartConfig.color_carbs_dietaryFibers)
    }

    valueRemainder = autoRound(valueRemainder);
    if (valueRemainder < 0) {
        valueRemainder = 0;
    }

    if(!hideRemainders) {
        labels.push(applicationStrings.label_nutrient_remainder[language])
        data.push(valueRemainder)
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