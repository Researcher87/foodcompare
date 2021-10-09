import {UserData} from "../../types/livedata/UserData";
import {applicationStrings} from "../../static/labels";
import {determineProteinRequirementRatio} from "../calculation/DietaryRequirementService";
import {ProteinData} from "../../types/nutrientdata/FoodItem";
import {ProteinRequirementData} from "../../types/nutrientdata/DietaryRequirement";
import {ChartDisplayData} from "../../types/livedata/ChartDisplayData";

export function getProteinChartData(proteinData: ProteinData, requirementData: ProteinRequirementData,
                                    userData: UserData, portionAmount: number, lang: string): ChartDisplayData {
    const labels: Array<string> = [];
    const values: Array<number> = [];

    if (proteinData.histidine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_histidine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.histidine, proteinData.histidine, portionAmount, userData)
        )
    }

    if (proteinData.isoleucine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_isoleucine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.isoleucine, proteinData.isoleucine, portionAmount, userData)
        )
    }

    if (proteinData.leucine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_leucine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.leucine, proteinData.leucine, portionAmount, userData)
        )
    }

    if (proteinData.lysine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_lysine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.lysine, proteinData.lysine, portionAmount, userData)
        )
    }

    if (proteinData.methionine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_methionine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.methionine, proteinData.methionine, portionAmount, userData)
        )
    }

    if (proteinData.phenylalanine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_phenylalanine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.phenylalanine, proteinData.phenylalanine, portionAmount, userData)
        )
    }

    if (proteinData.threonine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_threonine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.threonine, proteinData.threonine, portionAmount, userData)
        )
    }

    if (proteinData.tryptophan !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_tryptophan[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.tryptophan, proteinData.tryptophan, portionAmount, userData)
        )
    }

    if (proteinData.valine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_valine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.valine, proteinData.valine, portionAmount, userData)
        )
    }

    if (proteinData.cystine !== null) {
        labels.push(applicationStrings.label_nutrient_proteins_cystine[lang]);
        values.push(determineProteinRequirementRatio(
            requirementData.cystine, proteinData.cystine, portionAmount, userData)
        )
    }

    return {
        labels: labels,
        values: values
    }
}