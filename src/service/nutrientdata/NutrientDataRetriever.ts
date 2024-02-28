import FoodItem, {NutrientData} from "../../types/nutrientdata/FoodItem";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";

export function getSourceName(sourceId: number) {
    switch (sourceId) {
        case 0:
            return "SR Legacy"
        case 1:
            return "FNDDS"
        default:
            return "unknown"
    }
}

export function getNutrientData(selectedFoodItem: SelectedFoodItem): NutrientData {
    return getNutrientDataForFoodItem(selectedFoodItem.foodItem, selectedFoodItem.selectedSource,
        selectedFoodItem.supplementData, selectedFoodItem.combineData)
}

export function getNutrientDataForFoodItem(foodItem: FoodItem, sourceToUse?: number, supplementData?: boolean,
                                           combineData?: boolean): NutrientData {
    if (sourceToUse === null || sourceToUse === undefined || foodItem.nutrientDataList.length === 1) {
        return foodItem.nutrientDataList[0]
    } else {
        const nutrientData = foodItem.nutrientDataList.find(nutrientDataObject => nutrientDataObject.source.id === sourceToUse)
        if (nutrientData) {
            if(supplementData || combineData) {
                const complement = foodItem.nutrientDataList.find(nutrientDataObject => nutrientDataObject.source.id !== sourceToUse)
                if(complement) {
                    if(supplementData && !combineData) {
                        return supplementNutrientData(nutrientData, complement)
                    }
                    if(combineData) {
                        return combineNutrientData(nutrientData, complement)
                    }
                }
            }
            return nutrientData
        } else {
            return foodItem.nutrientDataList[0]
        }
    }
}


export function supplementNutrientData(selectedNutrientData: NutrientData, complementeNutrientData: NutrientData): NutrientData {
    const supplementedBaseData = supplementCategory(selectedNutrientData.baseData, complementeNutrientData.baseData)
    const supplementedVitaminData = supplementCategory(selectedNutrientData.vitaminData, complementeNutrientData.vitaminData)
    const supplementedMineralData = supplementCategory(selectedNutrientData.mineralData, complementeNutrientData.mineralData)
    const supplementedCarbsData = supplementCategory(selectedNutrientData.carbohydrateData, complementeNutrientData.carbohydrateData)
    const supplementedProteinData = supplementCategory(selectedNutrientData.proteinData, complementeNutrientData.proteinData)

    const supplementedOmegaData = supplementCategory(selectedNutrientData.lipidData.omegaData, complementeNutrientData.lipidData.omegaData)
    let supplementedLipidData = supplementCategory(selectedNutrientData.lipidData, complementeNutrientData.lipidData)
    supplementedLipidData.omegaData = supplementedOmegaData

    return {
        source: selectedNutrientData.source,
        sourceItemId: selectedNutrientData.sourceItemId,
        baseData: supplementedBaseData,
        vitaminData: supplementedVitaminData,
        mineralData: supplementedMineralData,
        carbohydrateData: supplementedCarbsData,
        proteinData: supplementedProteinData,
        lipidData: supplementedLipidData
    }
}


function supplementCategory(nutrientCategory1: any, nutrientCategory2: any): any {
    if(!nutrientCategory2) {
        return nutrientCategory1
    }

    // Clone to prevent overwriting the nutrient database elements!
    const newDataObject = {...nutrientCategory1}

    const keysComplement = Object.keys(nutrientCategory2)
    keysComplement.forEach(key => {
        if(newDataObject[key] === null) {
            const objectHasChildren = nutrientCategory2[key] && Object.keys(nutrientCategory2[key]).length > 0
            // Add value from source 2 to source 1 if it is not a sub-object (like Omega object on Lipids object):
            if(nutrientCategory2[key] !== null && !objectHasChildren) {
                newDataObject[key] = nutrientCategory2[key]
            }
        }
    })

    return newDataObject
}


export function combineNutrientData(selectedNutrientData: NutrientData, complementeNutrientData: NutrientData): NutrientData {
    const combinedBaseData = combineCategory(selectedNutrientData.baseData, complementeNutrientData.baseData)
    const combinedVitaminData = combineCategory(selectedNutrientData.vitaminData, complementeNutrientData.vitaminData)
    const combinedMineralData = combineCategory(selectedNutrientData.mineralData, complementeNutrientData.mineralData)
    const combinedCarbsData = combineCategory(selectedNutrientData.carbohydrateData, complementeNutrientData.carbohydrateData)
    const combinedProteinData = combineCategory(selectedNutrientData.proteinData, complementeNutrientData.proteinData)

    const combinedOmegaData = combineCategory(selectedNutrientData.lipidData.omegaData, complementeNutrientData.lipidData.omegaData)
    let combinedLipidData = combineCategory(selectedNutrientData.lipidData, complementeNutrientData.lipidData)
    combinedLipidData.omegaData = combinedOmegaData

    return {
        source: selectedNutrientData.source,
        sourceItemId: selectedNutrientData.sourceItemId,
        baseData: combinedBaseData,
        vitaminData: combinedVitaminData,
        mineralData: combinedMineralData,
        carbohydrateData: combinedCarbsData,
        proteinData: combinedProteinData,
        lipidData: combinedLipidData
    }
}


function combineCategory(nutrientCategory1: any, nutrientCategory2: any): any {
    if(!nutrientCategory1 && nutrientCategory2) {
        return nutrientCategory2
    } else if(nutrientCategory1 && !nutrientCategory2) {
        return nutrientCategory1
    } else if(!nutrientCategory1 && !nutrientCategory2) {
        return null
    }

    const keys1: Array<string> = Object.keys(nutrientCategory1)
    const keys2: Array<string> = Object.keys(nutrientCategory2)

    // @ts-ignore
    const allKeys = [...new Set<string>([...keys1, ...keys2])]
    let finalObject = {}

    allKeys.forEach(key => {
        const value1 = nutrientCategory1[key] !== null
            ? nutrientCategory1[key]
            : null

        const value2 = nutrientCategory2[key] !== null
            ? nutrientCategory2[key]
            : null

        let finalValue

        if(value1 !== null && value2 === null) {
            finalValue = value1
        } else if(value1 === null && value2 !== null) {
            finalValue = value2
        } else if(value1 === null && value2 === null) {
            finalValue = null
        } else {
            finalValue = (value1 + value2) * 0.5
        }

        finalObject[key] = finalValue
    })

    return finalObject
}
