import {NutrientData} from "../../types/nutrientdata/FoodItem";
import {autoRound} from "../calculation/MathService";
import {applicationStrings} from "../../static/labels";
import * as ChartConfig from "../../config/ChartConfig";
import {ChartDisplayData, LegendData} from "../../types/livedata/ChartDisplayData";
import {CATEGORY_BEVERAGE} from "../../config/Constants";

export function getTotalChartData(nutrientData: NutrientData, language: string, category: number | undefined): ChartDisplayData {
    const alcoholValuePercentage = nutrientData.baseData.alcohol !== null
        ? autoRound(nutrientData.baseData.alcohol)
        : null

    // Caffeine unit is milligram and needs to be converted to gram to match the other nutrient values
    const caffeine = nutrientData.baseData.caffeine ? nutrientData.baseData.caffeine / 1000 : null;

    const data = [autoRound(nutrientData.baseData.water),
        autoRound(nutrientData.baseData.carbohydrates),
        autoRound(nutrientData.baseData.lipids),
        autoRound(nutrientData.baseData.proteins),
    ]

    const labels: string[] = [applicationStrings.label_nutrient_water[language],
        applicationStrings.label_nutrient_carbohydrates_short[language],
        applicationStrings.label_nutrient_lipids[language],
        applicationStrings.label_nutrient_proteins[language],
    ]

    const colors = [
        ChartConfig.color_water,
        ChartConfig.color_carbs,
        ChartConfig.color_lipids,
        ChartConfig.color_proteins,
    ]

    if (alcoholValuePercentage !== null && (category === CATEGORY_BEVERAGE || category === undefined)) {
        data.push(alcoholValuePercentage)
        labels.push(applicationStrings.label_nutrient_alcohol[language])
        colors.push(ChartConfig.color_alcohol)
    }

    if (caffeine !== null && caffeine > 0) {
        data.push(autoRound(caffeine))
        labels.push(applicationStrings.label_nutrient_caffeine[language])
        colors.push(ChartConfig.color_caffeine)
    }

    // Add ash data at the end of the dataset (needed for bar chart display).
    labels.push(applicationStrings.label_nutrient_ash_short[language]);
    data.push(autoRound(nutrientData.baseData.ash));
    colors.push(ChartConfig.color_ash);

    return {
        labels: labels,
        values: data,
        colors: colors
    }
}


export function getNutrientChartData(nutrientData: NutrientData, language: string, showDetails: boolean,
                                     category: number | undefined): ChartDisplayData {
    const totalValue = nutrientData.baseData.carbohydrates + nutrientData.baseData.lipids
        + nutrientData.baseData.proteins + (nutrientData.baseData.alcohol ?? 0) + (nutrientData.baseData.caffeine ?? 0)

    let sugar = nutrientData.carbohydrateData?.sugar ? nutrientData.carbohydrateData.sugar : 0
    let dietaryFibers = nutrientData.baseData.dietaryFibers ? nutrientData.baseData.dietaryFibers : 0

    // NOTE: Sometimes the sugar or dietary fibers value is above the carbs value, which is impossible (> 100 %)
    if (sugar > totalValue) {
        sugar = totalValue
    }

    if (dietaryFibers > totalValue) {
        dietaryFibers = totalValue
    }
    if (sugar + dietaryFibers > totalValue) {  // Special case, where sug + fibers are above the 100 %
        sugar = (sugar / (sugar + dietaryFibers)) * totalValue
        dietaryFibers = (dietaryFibers / (sugar + dietaryFibers)) * totalValue
    }

    let carbValue = showDetails ? (nutrientData.baseData.carbohydrates - sugar - dietaryFibers)
        : nutrientData.baseData.carbohydrates;

    if (carbValue < 0) {
        carbValue = 0
    }

    const carbValuePerc = autoRound(carbValue / totalValue * 100)
    const sugarValuePerc = autoRound(sugar / totalValue * 100)
    const dietaryFibersPerc = autoRound(dietaryFibers / totalValue * 100)
    const lipidValuePerc = autoRound(nutrientData.baseData.lipids / totalValue * 100)
    const proteinsValuePerc = autoRound(nutrientData.baseData.proteins / totalValue * 100)
    const alcoholValuePerc = nutrientData.baseData.alcohol !== null
        ? autoRound(nutrientData.baseData.alcohol / totalValue * 100)
        : null

    const caffeinePerc = nutrientData.baseData.caffeine !== null
        ? autoRound((nutrientData.baseData.caffeine / 1000) / totalValue * 100)
        : null

    const labels = [applicationStrings.label_nutrient_lipids[language],
        applicationStrings.label_nutrient_proteins[language],
        applicationStrings.label_nutrient_carbohydrates_short[language]]

    const values = [lipidValuePerc, proteinsValuePerc, carbValuePerc];

    const colors = [
        ChartConfig.color_lipids,
        ChartConfig.color_proteins,
        ChartConfig.color_carbs
    ];

    if (alcoholValuePerc !== null && (category === CATEGORY_BEVERAGE || category === undefined)) {
        labels.push(applicationStrings.label_nutrient_alcohol[language])
        values.push(alcoholValuePerc)
        colors.push(ChartConfig.color_alcohol)
    }

    if (caffeinePerc !== null && caffeinePerc > 0) {
        labels.push(applicationStrings.label_nutrient_caffeine[language])
        values.push(caffeinePerc)
        colors.push(ChartConfig.color_caffeine)
    }

    if (showDetails) {
        if (sugarValuePerc > 0) {
            labels.push(applicationStrings.label_nutrient_sugar[language]);
            values.push(sugarValuePerc);
            colors.push(ChartConfig.color_carbs_sugar);
        }
        if (dietaryFibersPerc > 0) {
            labels.push(applicationStrings.label_nutrient_dietaryFibers_short[language]);
            values.push(dietaryFibersPerc);
            colors.push(ChartConfig.color_carbs_dietaryFibers);
        }
    }

    return {
        labels: labels,
        values: values,
        colors: colors
    }
}

export function getBaseChartLegendData(lang: string, showDetails: boolean, category: number | undefined): LegendData[] {
    const legendData: LegendData[] = [
        {
            item: applicationStrings.label_nutrient_water[lang],
            color: ChartConfig.color_water,
            separateNextElement: true
        },
        {
            item: applicationStrings.label_nutrient_lipids[lang],
            color: ChartConfig.color_lipids
        },
        {
            item: applicationStrings.label_nutrient_proteins[lang],
            color: ChartConfig.color_proteins
        },
        {
            item: applicationStrings.label_nutrient_carbohydrates_short[lang],
            color: ChartConfig.color_carbs,
        }
    ];

    if (showDetails) {
        legendData.push(
            {
                item: applicationStrings.label_nutrient_sugar[lang],
                color: ChartConfig.color_carbs_sugar,
                indent: 1,
            },
            {
                item: applicationStrings.label_nutrient_dietaryFibers[lang],
                color: ChartConfig.color_carbs_dietaryFibers,
                indent: 1,
                separateNextElement: true
            }
        );
    }

    if (category === CATEGORY_BEVERAGE || category === undefined) {
        legendData.push({
            item: applicationStrings.label_nutrient_alcohol[lang],
            color: ChartConfig.color_alcohol,
        })
    }

    legendData.push({
        item: applicationStrings.label_nutrient_caffeine[lang],
        color: ChartConfig.color_caffeine,
    })

    legendData.push({
        item: applicationStrings.label_nutrient_ash[lang],
        color: ChartConfig.color_ash
    })

    return legendData;
}