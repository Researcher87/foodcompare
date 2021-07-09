import {determineFoodRequirementRatio} from "./DietaryRequirementService";
import {UserData} from "../../types/livedata/UserData";

/**
 * Determines the maximum vitamin, mineral or protein value of a food item (referring to the daily dietary requirements).
 */
export function getMaximumValue(dataSet: any, amount: number, requirementData: any, userData: UserData) {
    let maxValue = 0
    for (let dataSetKey in dataSet) {
        if (requirementData[dataSetKey]) {
            const ratioValue = determineFoodRequirementRatio(requirementData[dataSetKey], dataSet[dataSetKey], amount, userData)
            if (ratioValue > maxValue) {
                maxValue = ratioValue
            }
        }
    }
    return maxValue
}

/**
 * Given two data sets of vitamins, minerals or proteins, this method nullifies each value if it does not occur in
 * both data sets. This can be used as part of the synchronization process where two bar charts should contain the
 * exact same amount of columns.
 */
export function nullifyIncompleValues(dataSet1: any, dataSet2: any) {
    for (let dataSetKey in dataSet1) {
        const value = dataSet1[dataSetKey]
        if(value === null && dataSet2[dataSetKey]) {
            dataSet2[dataSetKey] = null
        } else if(value !== null && (dataSet2[dataSetKey] === null || dataSet2[dataSetKey] === undefined)) {
            dataSet1[dataSetKey] = null
        }
    }

    for (let dataSetKey in dataSet2) {
        const value = dataSet2[dataSetKey]
        if(value === null && dataSet2[dataSetKey]) {
            dataSet2[dataSetKey] = null
        } else if(value !== null && (dataSet1[dataSetKey] === null || dataSet1[dataSetKey] === undefined)) {
            dataSet2[dataSetKey] = null
        }
    }
}