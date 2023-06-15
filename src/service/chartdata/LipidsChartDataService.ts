import {LipidData, OmegaData} from "../../types/nutrientdata/FoodItem";
import {autoRound} from "../calculation/MathService";
import {applicationStrings} from "../../static/labels";
import * as ChartConfig from "../../config/ChartConfig";
import {ChartDisplayData, LegendData} from "../../types/livedata/ChartDisplayData";

export function getTotalLipidsChartData(lipidsData: LipidData, hideRemainders: boolean, portionAmount: number,
                                           language: string): ChartDisplayData {
    const {saturated, unsaturatedMono, unsaturatedPoly} = lipidsData

    let valueRemainder = portionAmount - (saturated!! + unsaturatedMono!! + unsaturatedPoly!!);
    if (valueRemainder < 0) {
        valueRemainder = 0
    }

    const portionAmountToUse = hideRemainders ? portionAmount - valueRemainder : portionAmount
    valueRemainder = autoRound(valueRemainder / portionAmount * 100);

    const valueSaturated = autoRound(saturated!! / portionAmountToUse * 100);
    const valueUnsaturatedMono = autoRound(unsaturatedMono!! / portionAmountToUse * 100);
    const valueUnsaturatedPoly = autoRound(unsaturatedPoly!! / portionAmountToUse * 100);

    const labels: string[] = [applicationStrings.label_nutrient_lipids_saturated_short[language],
        applicationStrings.label_nutrient_lipids_unsaturated_mono_short[language],
        applicationStrings.label_nutrient_lipids_unsaturated_poly_short[language]]

    const colors: string[] = [
        ChartConfig.color_lipids_saturated,
        ChartConfig.color_lipids_unsaturated_mono,
        ChartConfig.color_lipids_unsaturated_poly]

    const values: number[] = [valueSaturated,
        valueUnsaturatedMono,
        valueUnsaturatedPoly]

    if(!hideRemainders) {
        labels.push(applicationStrings.label_nutrient_remainder[language])
        colors.push(ChartConfig.color_lipids_misc)
        values.push(valueRemainder)
    }

    return {
        labels: labels,
        values: values,
        colors: colors
    }
}


export function getOmegaChartData(omegaData: OmegaData, hideRemainders: boolean, totalAmount: number, lang: string): ChartDisplayData | null {
    if (omegaData === null || omegaData.omega3 === null || omegaData.omega6 === null || omegaData.uncertain === null) {
        return null;
    }

    const valueOmega3 = autoRound(omegaData.omega3 / totalAmount * 100);
    const valueOmega6 = autoRound(omegaData.omega6 / totalAmount * 100);
    const valueUncertain = autoRound(omegaData.uncertain / totalAmount * 100);

    const labels: string[] = [applicationStrings.label_nutrient_omega3[lang],
        applicationStrings.label_nutrient_omega6[lang]]

    const values: number[] = [valueOmega3,
        valueOmega6]

    const colors: string[] = [
        ChartConfig.color_lipids_omega3,
        ChartConfig.color_lipids_omega6
    ]

    if(!hideRemainders) {
        labels.push(applicationStrings.label_unknown[lang])
        colors.push(ChartConfig.color_lipids_misc)
        values.push(valueUncertain)
    }

    return {
        labels: labels,
        values: values,
        colors: colors
    }
}


export function getLipidsBaseChartLegend(language: string): LegendData[] {
    return [
        {
            item: applicationStrings.label_nutrient_lipids_saturated[language],
            color: ChartConfig.color_lipids_saturated,
        },
        {
            item: applicationStrings.label_nutrient_lipids_unsaturated_mono[language],
            color: ChartConfig.color_lipids_unsaturated_mono
        },
        {
            item: applicationStrings.label_nutrient_lipids_unsaturated_poly[language],
            color: ChartConfig.color_lipids_unsaturated_poly,
        },
        {
            item: applicationStrings.label_nutrient_remainder[language],
            color: ChartConfig.color_lipids_misc
        },
    ];
}

export function getLipidsOmegaChartLegend(language: string): LegendData[] {
    return [
        {
            item: applicationStrings.label_nutrient_omega3[language],
            color: ChartConfig.color_lipids_omega3,
        },
        {
            item: applicationStrings.label_nutrient_omega6[language],
            color: ChartConfig.color_lipids_omega6
        },
        {
            item: applicationStrings.label_unknown[language],
            color: ChartConfig.color_lipids_misc,
        },
    ];
}