import {NutrientData} from "../../types/nutrientdata/FoodItem";
import {autoRound} from "../calculation/MathService";
import {applicationStrings} from "../../static/labels";
import * as ChartConfig from "../../config/ChartConfig";
import {ChartDisplayData, LegendData} from "../../types/livedata/ChartDisplayData";

export function getTotalChartData(nutrientData: NutrientData, language: string): ChartDisplayData {
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

    if (alcoholValuePercentage !== null) {
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


export function getNutrientChartData(nutrientData: NutrientData, language: string, showDetails: boolean): ChartDisplayData {
    const totalValue = nutrientData.baseData.carbohydrates + nutrientData.baseData.lipids
        + nutrientData.baseData.proteins + (nutrientData.baseData.alcohol ?? 0) + (nutrientData.baseData.caffeine ?? 0)

    let sugar = nutrientData.carbohydrateData?.sugar ?? 0
    let dietaryFibers = nutrientData.baseData.dietaryFibers ?? 0
    let saturatedFattyAcids = nutrientData.lipidData.saturated ?? 0

    // NOTE: Sometimes the sugar or dietary fibers value is above the carbs value, which is impossible (> 100 %)
    if (sugar > totalValue) {
        sugar = totalValue
    }

    if (dietaryFibers > totalValue) {
        dietaryFibers = totalValue
    }
    if (sugar + dietaryFibers > totalValue) {  // Special case, where sugar + fibers are above the 100 %
        sugar = (sugar / (sugar + dietaryFibers)) * totalValue
        dietaryFibers = (dietaryFibers / (sugar + dietaryFibers)) * totalValue
    }

    let carbValue = showDetails ? (nutrientData.baseData.carbohydrates - sugar - dietaryFibers)
        : nutrientData.baseData.carbohydrates;

    if (carbValue < 0) {
        carbValue = 0
    }

    let lipidsValue = showDetails ? (nutrientData.baseData.lipids - saturatedFattyAcids) : nutrientData.baseData.lipids

    const carbValuePerc = autoRound(carbValue / totalValue * 100)
    const sugarValuePerc = autoRound(sugar / totalValue * 100)
    const saturatedFattyAcidsValuePerc = autoRound(saturatedFattyAcids / totalValue * 100)
    const dietaryFibersPerc = autoRound(dietaryFibers / totalValue * 100)
    const lipidValuePerc = autoRound(lipidsValue / totalValue * 100)
    const proteinsValuePerc = autoRound(nutrientData.baseData.proteins / totalValue * 100)
    const alcoholValuePerc = nutrientData.baseData.alcohol !== null
        ? autoRound(nutrientData.baseData.alcohol / totalValue * 100)
        : null

    const caffeinePerc = nutrientData.baseData.caffeine !== null
        ? autoRound((nutrientData.baseData.caffeine / 1000) / totalValue * 100)
        : null

    // 1. Start with carbohydrate data
    const labels = [applicationStrings.label_nutrient_carbohydrates_short[language]]
    const values = [carbValuePerc];
    const colors = [ ChartConfig.color_carbs];

    // 1a. If details are selected, the carbs detail data comes next
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

    // 2. Next comes lipid data
    labels.push(
        applicationStrings.label_nutrient_lipids[language]
    )

    values.push(
        lipidValuePerc
    )

    colors.push(
        ChartConfig.color_lipids
    )

    // 2a. If details are selected, show the lipids details (saturated)
    if(showDetails && saturatedFattyAcids > 0) {
        labels.push(applicationStrings.label_nutrient_lipids_saturated_short[language]);
        values.push(saturatedFattyAcidsValuePerc);
        colors.push(ChartConfig.color_lipids_saturated);
    }


    // 3. Next comes protein data
    labels.push(
        applicationStrings.label_nutrient_proteins[language],
    )

    values.push(
        proteinsValuePerc, 
    )

    colors.push(
        ChartConfig.color_proteins,
    )
    
    // 4. Finally, if available, show alcohol and caffeine data
    if (alcoholValuePerc !== null) {
        labels.push(applicationStrings.label_nutrient_alcohol[language])
        values.push(alcoholValuePerc)
        colors.push(ChartConfig.color_alcohol)
    }

    if (caffeinePerc !== null && caffeinePerc > 0) {
        labels.push(applicationStrings.label_nutrient_caffeine[language])
        values.push(caffeinePerc)
        colors.push(ChartConfig.color_caffeine)
    }

    return {
        labels: labels,
        values: values,
        colors: colors
    }
}

export function getBaseChartLegendData(lang: string, showDetails: boolean): LegendData[] {
    const legendData: LegendData[] = [
        {
            item: applicationStrings.label_nutrient_water[lang],
            color: ChartConfig.color_water,
            separateNextElement: true
        },
        {
            item: applicationStrings.label_nutrient_carbohydrates[lang],
            color: ChartConfig.color_carbs,
        },
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

    legendData.push(
        {
            item: applicationStrings.label_nutrient_lipids[lang],
            color: ChartConfig.color_lipids
        },
    )

    if (showDetails) {
        legendData.push(
            {
                item: applicationStrings.label_nutrient_lipids_saturated_short[lang],
                color: ChartConfig.color_lipids_saturated,
                indent: 1,
            },
        );
    }

    legendData.push(
        {
            item: applicationStrings.label_nutrient_proteins[lang],
            color: ChartConfig.color_proteins
        }
    )

    legendData.push({
        item: applicationStrings.label_nutrient_alcohol[lang],
        color: ChartConfig.color_alcohol,
    })

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


export function showEnergyChartLegend(lang: string): LegendData[] {
    const legendData: LegendData[] = [
        {
            item: applicationStrings.label_nutrient_carbohydrates[lang],
            color: ChartConfig.color_carbs,
        },
        {
            item: applicationStrings.label_nutrient_dietaryFibers[lang],
            color: ChartConfig.color_carbs_dietaryFibers,
            indent: 1
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
            item: applicationStrings.label_nutrient_alcohol[lang],
            color: ChartConfig.color_alcohol
        },
    ];

    return legendData
}