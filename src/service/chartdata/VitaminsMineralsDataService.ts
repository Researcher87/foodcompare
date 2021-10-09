import {determineFoodRequirementRatio} from "../calculation/DietaryRequirementService";
import {MineralData, VitaminData} from "../../types/nutrientdata/FoodItem";
import {MineralRequirementData, VitaminRequirementData} from "../../types/nutrientdata/DietaryRequirement";
import {UserData} from "../../types/livedata/UserData";
import {ChartDisplayData} from "../../types/livedata/ChartDisplayData";
import {applicationStrings} from "../../static/labels";

export function getVitaminChartData(vitaminData: VitaminData, requirementData: VitaminRequirementData, userData: UserData,
                                    portionAmount: number): ChartDisplayData {
    const labels: Array<string> = [];
    const values: Array<number> = [];

    if (vitaminData.a !== null) {
        labels.push("A");
        values.push(determineFoodRequirementRatio(requirementData.a, vitaminData.a, portionAmount, userData));
    }

    if (vitaminData.b1 !== null) {
        labels.push("B1");
        values.push(determineFoodRequirementRatio(requirementData.b1, vitaminData.b1, portionAmount, userData));
    }

    if (vitaminData.b2 !== null) {
        labels.push("B2");
        values.push(determineFoodRequirementRatio(requirementData.b2, vitaminData.b2, portionAmount, userData));
    }

    if (vitaminData.b3 !== null) {
        labels.push("B3");
        values.push(determineFoodRequirementRatio(requirementData.b3, vitaminData.b3, portionAmount, userData));
    }

    if (vitaminData.b5 !== null) {
        labels.push("B5");
        values.push(determineFoodRequirementRatio(requirementData.b5, vitaminData.b5, portionAmount, userData));
    }

    if (vitaminData.b6 !== null) {
        labels.push("B6");
        values.push(determineFoodRequirementRatio(requirementData.b6, vitaminData.b6, portionAmount, userData));
    }

    if (vitaminData.b9 !== null) {
        labels.push("B9");
        values.push(determineFoodRequirementRatio(requirementData.b9, vitaminData.b9, portionAmount, userData));
    }

    if (vitaminData.b12 !== null) {
        labels.push("B12");
        values.push(determineFoodRequirementRatio(requirementData.b12, vitaminData.b12, portionAmount, userData));
    }

    if (vitaminData.c !== null) {
        labels.push("C");
        values.push(determineFoodRequirementRatio(requirementData.c, vitaminData.c, portionAmount, userData));
    }

    if (vitaminData.d !== null) {
        labels.push("D");
        values.push(determineFoodRequirementRatio(requirementData.d, vitaminData.d, portionAmount, userData));
    }

    if (vitaminData.e !== null) {
        labels.push("E");
        values.push(determineFoodRequirementRatio(requirementData.e, vitaminData.e, portionAmount, userData));
    }

    if (vitaminData.k !== null) {
        labels.push("K");
        values.push(determineFoodRequirementRatio(requirementData.k, vitaminData.k, portionAmount, userData));
    }

    return {
        labels: labels,
        values: values
    }
}


export function getMineralsChartData(mineralData: MineralData, requirementData: MineralRequirementData, userData: UserData,
                                     portionAmount: number, language: string): ChartDisplayData {
    const labels: Array<string> = [];
    const values: Array<number> = [];

    if (mineralData.calcium !== null) {
        labels.push(applicationStrings.label_nutrient_min_calcium[language]);
        values.push(determineFoodRequirementRatio(requirementData.calcium, mineralData.calcium, portionAmount, userData));
    }

    if (mineralData.iron !== null) {
        labels.push(applicationStrings.label_nutrient_min_iron[language]);
        values.push(determineFoodRequirementRatio(requirementData.iron, mineralData.iron, portionAmount, userData));
    }

    if (mineralData.magnesium !== null) {
        labels.push(applicationStrings.label_nutrient_min_magnesium[language]);
        values.push(determineFoodRequirementRatio(requirementData.magnesium, mineralData.magnesium, portionAmount, userData));
    }

    if (mineralData.phosphorus !== null) {
        labels.push(applicationStrings.label_nutrient_min_phosphorus[language]);
        values.push(determineFoodRequirementRatio(requirementData.phosphorus, mineralData.phosphorus, portionAmount, userData));
    }

    if (mineralData.potassium !== null) {
        labels.push(applicationStrings.label_nutrient_min_potassimum[language]);
        values.push(determineFoodRequirementRatio(requirementData.potassium, mineralData.potassium, portionAmount, userData));
    }

    if (mineralData.sodium !== null) {
        labels.push(applicationStrings.label_nutrient_min_sodium[language]);
        values.push(determineFoodRequirementRatio(requirementData.sodium, mineralData.sodium, portionAmount, userData));
    }

    if (mineralData.zinc !== null) {
        labels.push(applicationStrings.label_nutrient_min_zinc[language]);
        values.push(determineFoodRequirementRatio(requirementData.zinc, mineralData.zinc, portionAmount, userData));
    }

    if (mineralData.copper !== null) {
        labels.push(applicationStrings.label_nutrient_min_copper[language]);
        values.push(determineFoodRequirementRatio(requirementData.copper, mineralData.copper, portionAmount, userData));
    }

    if (mineralData.manganese !== null) {
        labels.push(applicationStrings.label_nutrient_min_manganese[language]);
        values.push(determineFoodRequirementRatio(requirementData.manganese, mineralData.manganese, portionAmount, userData));
    }

    if (mineralData.selenium !== null) {
        labels.push(applicationStrings.label_nutrient_min_selenium[language]);
        values.push(determineFoodRequirementRatio(requirementData.selenium, mineralData.selenium, portionAmount, userData));
    }

    return {
        labels: labels,
        values: values
    }
}