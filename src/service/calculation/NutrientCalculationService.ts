import {determineFoodRequirementRatio, determineProteinRequirementRatio} from "./DietaryRequirementService";
import {UserData} from "../../types/livedata/UserData";
import {MineralData, VitaminData} from "../../types/nutrientdata/FoodItem";

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