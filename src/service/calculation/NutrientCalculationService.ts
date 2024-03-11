import {determineFoodRequirementRatio, determineProteinRequirementRatio} from "./DietaryRequirementService";
import {UserData} from "../../types/livedata/UserData";
import * as Constants from "../../config/Constants";

/**
 * Determines the maximum vitamin or mineral or protein value of a food item (referring to the daily dietary requirements).
 */
export function getMaximumValue(dataSet: any, amount: number, requirementData: any, userData: UserData, proteins?: boolean) {
    let maxValue = 0
    for (let dataSetKey in dataSet) {
        if (requirementData[dataSetKey]) {
            const ratioValue = proteins === true
                ? determineProteinRequirementRatio(requirementData[dataSetKey], dataSet[dataSetKey], amount, userData)
                : determineFoodRequirementRatio(requirementData[dataSetKey], dataSet[dataSetKey], amount, userData)
            if (ratioValue > maxValue) {
                maxValue = ratioValue
            }
        }
    }
    return maxValue
}


/**
 * Given two data sets of values, this method determines the attributes that has values for both objects. It
 * can be used to remove all data attributes (columns) where at least one of the two data sets does not provide
 * a value.
 * @param dataSet1
 * @param dataSet2
 */
export function getOverlappingValues(dataSet1: any, dataSet2: any): string[] {
    const overlapping: string[] = []
    for (const dataSetKey in dataSet1) {
        const value = dataSet1[dataSetKey]
        if((value !== null && value !== undefined) && (dataSet2[dataSetKey] !== null && dataSet2[dataSetKey] !== undefined)) {
            overlapping.push(dataSetKey)
        }
    }

    return overlapping
}


export function nullifyNonOverlappingValues(dataSet: any, overlappingAttributes: string[]): any {
    const newDataset: any = {}
    for (const dataSetKey in dataSet) {
        if(!overlappingAttributes.includes(dataSetKey)) {
            newDataset[dataSetKey] = null
        } else {
            newDataset[dataSetKey] = dataSet[dataSetKey]
        }
    }

    return newDataset
}

/**
 * Returns the unit of a nutrient. This unit refers to the default unit of the Food Data Central data sheets (resp.
 * the Food Compare Catalog)
 * @param selectedValue The selected nutrient
 * @param transformToDietaryRequirements Optionally, the specification that the daily requirements are used as unit
 * @return The unit (g, mg or %).
 */
export const getUnit = (selectedValue: string, transformToDietaryRequirements?: boolean) => {
    if (selectedValue === Constants.DATA_ENERGY) {
        return "kcal";
    } else if (selectedValue === Constants.DATA_WATER
        || selectedValue === Constants.DATA_LIPIDS
        || selectedValue === Constants.DATA_CARBS
        || selectedValue === Constants.DATA_CARBS_SUGAR
        || selectedValue === Constants.DATA_PROTEINS
        || selectedValue === Constants.DATA_ASH
        || selectedValue === Constants.DATA_CARBS_DIETARY_FIBERS
        || selectedValue === Constants.DATA_LIPIDS_SATURATED
        || selectedValue === Constants.DATA_LIPIDS_MONO_UNSATURATED
        || selectedValue === Constants.DATA_LIPIDS_POLY_UNSATURATED
        || selectedValue === Constants.DATA_LIPIDS_TRANSFATTY_ACIDS) {
        return "g";
    } else if (transformToDietaryRequirements) {
        return "%";
    } else {
        return "mg";
    }
}