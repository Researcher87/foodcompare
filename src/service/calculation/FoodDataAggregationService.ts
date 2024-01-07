import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodItem, {
    BaseData,
    CarbohydrateData, CarotenoidData, ExtendedVitaminE,
    LipidData,
    MineralData,
    NutrientData,
    ProteinData,
    VitaminData
} from "../../types/nutrientdata/FoodItem";
import {getNutrientData} from "../nutrientdata/NutrientDataRetriever";

export default function combineFoodItems(compositeList: Array<SelectedFoodItem>, preferredSource): SelectedFoodItem {
    let portionSize = 0;

    compositeList.forEach(selectedFoodItem => {
        portionSize += selectedFoodItem.portion.amount
    })

    const nutrientDataList = buildAggregatedNutrientDataList(compositeList, portionSize, preferredSource);
    const id = new Date().getTime();

    const aggreatedFoodItem: FoodItem = {
        id: id,
        nutrientDataList: nutrientDataList,
        aggregated: true
    }

    console.log('JUDE', compositeList)

    let combinedFoodItem: SelectedFoodItem = {
        id: id,
        foodItem: aggreatedFoodItem,
        portion: {
            portionType: 999,
            amount: portionSize
        },
        compositeSubElements: compositeList,
        selectedSource: -1,
        supplementData: true,
        combineData: false
    };

    return combinedFoodItem;
}


function buildAggregatedNutrientDataList(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): Array<NutrientData> {
    const baseData = buildBaseDataObject(compositeList, portionSize, preferredSource);
    const vitaminData = buildVitaminDataObject(compositeList, portionSize, preferredSource);
    const mineralData = buildMineralDataObject(compositeList, portionSize, preferredSource);
    const carbohydrateData = buildCarbohydrateData(compositeList, portionSize, preferredSource);
    const lipidData = buildLipidData(compositeList, portionSize, preferredSource);
    const proteinData = buildProteinData(compositeList, portionSize, preferredSource);

    let nutrientObject: NutrientData = {
        sourceItemId: "0",
        source: {id: 0, url: "", name: ""},
        baseData: baseData,
        vitaminData: vitaminData,
        mineralData: mineralData,
        carbohydrateData: carbohydrateData,
        lipidData: lipidData,
        proteinData: proteinData
    }

    nutrientObject = removeNutrientObjectsWithNullValues(nutrientObject, compositeList, preferredSource);

    const nutrientDataList: Array<NutrientData> = [];
    nutrientDataList.push(nutrientObject);

    return nutrientDataList;
}


/**
 * Removes all nutrient data elements that do not exist in ALL of the food elements within the list.
 * @param nutrientObject
 * @param compositeList
 */
function removeNutrientObjectsWithNullValues(nutrientObject: NutrientData, compositeList: Array<SelectedFoodItem>, preferredSource: string) {
    if (!compositeList) {
        return nutrientObject;
    }

    for (let i = 0; i < compositeList.length; i++) {
        let selectedFoodItem = compositeList[i]
        const nutrientData = getNutrientData(selectedFoodItem)
        const threshold = 0.1;   // Defines the amount of base data which must exist to set a sub-value to null.

        // Remove base data
        if (nutrientData.baseData.carbohydrates >= threshold) {
            if (nutrientData.baseData.dietaryFibers == null) {
                nutrientObject.baseData.dietaryFibers = null;
            }
        }


        // Lipid data
        if (nutrientData.baseData.lipids >= threshold) {
            if (!nutrientData.lipidData || nutrientData.lipidData.saturated == null) {
                nutrientObject.lipidData.saturated = null;
            }

            if (!nutrientData.lipidData || nutrientData.lipidData.unsaturatedMono == null) {
                nutrientObject.lipidData.unsaturatedMono = null;
            }

            if (!nutrientData.lipidData || nutrientData.lipidData.unsaturatedPoly == null) {
                nutrientObject.lipidData.unsaturatedPoly = null;
            }

            if (!nutrientData.lipidData || nutrientData.lipidData.transFattyAcids == null) {
                nutrientObject.lipidData.transFattyAcids = null;
            }

            if (!nutrientData.lipidData || nutrientData.lipidData.cholesterol == null) {
                nutrientObject.lipidData.cholesterol = null;
            }

            if (!nutrientData.lipidData.omegaData &&
                (nutrientData.lipidData && nutrientData.lipidData.unsaturatedPoly && nutrientData.lipidData.unsaturatedPoly > threshold)) {
                nutrientObject.lipidData.omegaData = null;
            }
        }


        // Carbohydrate data
        if (nutrientData.baseData.carbohydrates >= threshold) {
            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.sugar == null) {
                nutrientObject.carbohydrateData.sugar = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.glucose == null) {
                nutrientObject.carbohydrateData.glucose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.fructose == null) {
                nutrientObject.carbohydrateData.fructose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.galactose == null) {
                nutrientObject.carbohydrateData.galactose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.sucrose == null) {
                nutrientObject.carbohydrateData.sucrose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.lactose == null) {
                nutrientObject.carbohydrateData.lactose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.maltose == null) {
                nutrientObject.carbohydrateData.maltose = null;
            }

            if (!nutrientData.carbohydrateData || nutrientData.carbohydrateData.starch == null) {
                nutrientObject.carbohydrateData.starch = null;
            }
        }


        // Vitamins:
        if (nutrientData.vitaminData.a === null) {
            nutrientObject.vitaminData.a = null
        }

        if (nutrientData.vitaminData.b1 === null) {
            nutrientObject.vitaminData.b1 = null
        }

        if (nutrientData.vitaminData.b2 === null) {
            nutrientObject.vitaminData.b2 = null
        }

        if (nutrientData.vitaminData.b3 === null) {
            nutrientObject.vitaminData.b3 = null
        }

        if (nutrientData.vitaminData.b5 === null) {
            nutrientObject.vitaminData.b5 = null
        }

        if (nutrientData.vitaminData.b6 === null) {
            nutrientObject.vitaminData.b6 = null
        }

        if (nutrientData.vitaminData.b7 === null) {
            nutrientObject.vitaminData.b7 = null
        }

        if (nutrientData.vitaminData.b9 === null) {
            nutrientObject.vitaminData.b9 = null
        }

        if (nutrientData.vitaminData.b12 === null) {
            nutrientObject.vitaminData.b12 = null
        }

        if (nutrientData.vitaminData.c === null) {
            nutrientObject.vitaminData.c = null
        }

        if (nutrientData.vitaminData.d === null) {
            nutrientObject.vitaminData.d = null
        }

        if (nutrientData.vitaminData.e === null) {
            nutrientObject.vitaminData.e = null
        }

        if (nutrientData.vitaminData.k === null) {
            nutrientObject.vitaminData.k = null
        }


        // Minerals:
        if (nutrientData.mineralData.calcium === null) {
            nutrientObject.mineralData.calcium = null
        }

        if (nutrientData.mineralData.copper === null) {
            nutrientObject.mineralData.copper = null
        }

        if (nutrientData.mineralData.iron === null) {
            nutrientObject.mineralData.iron = null
        }

        if (nutrientData.mineralData.magnesium === null) {
            nutrientObject.mineralData.magnesium = null
        }

        if (nutrientData.mineralData.manganese === null) {
            nutrientObject.mineralData.manganese = null
        }

        if (nutrientData.mineralData.phosphorus === null) {
            nutrientObject.mineralData.phosphorus = null
        }

        if (nutrientData.mineralData.potassium === null) {
            nutrientObject.mineralData.potassium = null
        }

        if (nutrientData.mineralData.selenium === null) {
            nutrientObject.mineralData.selenium = null
        }

        if (nutrientData.mineralData.sodium === null) {
            nutrientObject.mineralData.sodium = null
        }

        if (nutrientData.mineralData.zinc === null) {
            nutrientObject.mineralData.zinc = null
        }


        // Proteins:

        if (nutrientData.proteinData.alanine === null) {
            nutrientObject.proteinData.alanine = null
        }

        if (nutrientData.proteinData.arginine === null) {
            nutrientObject.proteinData.arginine = null
        }

        if (nutrientData.proteinData.asparticAcid === null) {
            nutrientObject.proteinData.asparticAcid = null
        }

        if (nutrientData.proteinData.cystine === null) {
            nutrientObject.proteinData.cystine = null
        }

        if (nutrientData.proteinData.glutamicAcid === null) {
            nutrientObject.proteinData.glutamicAcid = null
        }

        if (nutrientData.proteinData.glycine === null) {
            nutrientObject.proteinData.glycine = null
        }

        if (nutrientData.proteinData.histidine === null) {
            nutrientObject.proteinData.histidine = null
        }

        if (nutrientData.proteinData.isoleucine === null) {
            nutrientObject.proteinData.isoleucine = null
        }

        if (nutrientData.proteinData.leucine === null) {
            nutrientObject.proteinData.leucine = null
        }

        if (nutrientData.proteinData.lysine === null) {
            nutrientObject.proteinData.lysine = null
        }

        if (nutrientData.proteinData.methionine === null) {
            nutrientObject.proteinData.methionine = null
        }

        if (nutrientData.proteinData.phenylalanine === null) {
            nutrientObject.proteinData.phenylalanine = null
        }

        if (nutrientData.proteinData.proline === null) {
            nutrientObject.proteinData.proline = null
        }

        if (nutrientData.proteinData.serine === null) {
            nutrientObject.proteinData.serine = null
        }

        if (nutrientData.proteinData.threonine === null) {
            nutrientObject.proteinData.threonine = null
        }

        if (nutrientData.proteinData.tryptophan === null) {
            nutrientObject.proteinData.tryptophan = null
        }

        if (nutrientData.proteinData.tyrosine === null) {
            nutrientObject.proteinData.tyrosine = null
        }

        if (nutrientData.proteinData.valine === null) {
            nutrientObject.proteinData.valine = null
        }

    }

    return nutrientObject;
}


function buildBaseDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): BaseData {
    let energy = 0;
    let carbohydrates = 0;
    let lipids = 0;
    let proteins = 0;
    let water = 0;
    let dietaryFibers = 0;
    let alcohol = 0;
    let ash = 0;
    let caffeine = 0;

    compositeList.forEach(selectedFoodItem => {
        const baseData = getNutrientData(selectedFoodItem).baseData;
        const userSetPortion = selectedFoodItem.portion.amount;
        const portionFactor = userSetPortion / 100;

        energy += (baseData.energy ? baseData.energy : 0) * portionFactor;
        carbohydrates += baseData.carbohydrates * portionFactor;
        lipids += baseData.lipids * portionFactor;
        proteins += baseData.proteins * portionFactor;
        water += baseData.water * portionFactor;
        dietaryFibers += (baseData.dietaryFibers ? baseData.dietaryFibers : 0) * portionFactor;
        alcohol += (baseData.alcohol ? baseData.alcohol : 0) * portionFactor;
        ash += (baseData.ash ? baseData.ash : 0) * portionFactor;
        caffeine += (baseData.caffeine ? baseData.caffeine : 0) * portionFactor;
    })

    return {
        energy: createFinalValue(energy, portionSize),
        carbohydrates: createFinalValue(carbohydrates, portionSize),
        lipids: createFinalValue(lipids, portionSize),
        proteins: createFinalValue(proteins, portionSize),
        water: createFinalValue(water, portionSize),
        dietaryFibers: createFinalValue(dietaryFibers, portionSize),
        alcohol: alcohol,
        ash: ash,
        caffeine: caffeine
    }

}


function buildVitaminDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): VitaminData {
    let a = 0
    let b1 = 0
    let b2 = 0
    let b3 = 0
    let b5 = 0
    let b6 = 0
    let b7 = 0
    let b9 = 0
    let b12 = 0
    let c = 0
    let d = 0
    let e = 0
    let k = 0

    compositeList.forEach(selectedFoodItem => {
        const vitaminData = getNutrientData(selectedFoodItem).vitaminData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        a += (vitaminData.a ? vitaminData.a : 0) * portionFactor
        b1 += (vitaminData.b1 ? vitaminData.b1 : 0) * portionFactor
        b2 += (vitaminData.b2 ? vitaminData.b2 : 0) * portionFactor
        b3 += (vitaminData.b3 ? vitaminData.b3 : 0) * portionFactor
        b5 += (vitaminData.b5 ? vitaminData.b5 : 0) * portionFactor
        b6 += (vitaminData.b6 ? vitaminData.b6 : 0) * portionFactor
        b7 += (vitaminData.b7 ? vitaminData.b7 : 0) * portionFactor
        b9 += (vitaminData.b9 ? vitaminData.b9 : 0) * portionFactor
        b12 += (vitaminData.b12 ? vitaminData.b12 : 0) * portionFactor
        c += (vitaminData.c ? vitaminData.c : 0) * portionFactor
        d += (vitaminData.d ? vitaminData.d : 0) * portionFactor
        e += (vitaminData.e ? vitaminData.e : 0) * portionFactor
        k += (vitaminData.k ? vitaminData.k : 0) * portionFactor
    })

    return {
        a: createFinalValue(a, portionSize),
        b1: createFinalValue(b1, portionSize),
        b2: createFinalValue(b2, portionSize),
        b3: createFinalValue(b3, portionSize),
        b5: createFinalValue(b5, portionSize),
        b6: createFinalValue(b6, portionSize),
        b7: createFinalValue(b7, portionSize),
        b9: createFinalValue(b9, portionSize),
        b12: createFinalValue(b12, portionSize),
        c: createFinalValue(c, portionSize),
        d: createFinalValue(d, portionSize),
        e: createFinalValue(e, portionSize),
        k: createFinalValue(k, portionSize),
        carotenoidData: buildCarotenoidDataObject(compositeList, portionSize, preferredSource),
        extendedVitaminE: buildExtendedVitaminEObject(compositeList, portionSize, preferredSource)
    }
}


function buildCarotenoidDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): CarotenoidData {
    let alpha = 0
    let beta = 0
    let cryptoxanthin = 0
    let lycopene = 0
    let lutein = 0

    compositeList.forEach(selectedFoodItem => {
        const carotenoidData = getNutrientData(selectedFoodItem).vitaminData.carotenoidData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        if (carotenoidData !== null) {
            alpha += (carotenoidData.caroteneAlpha ? carotenoidData.caroteneAlpha : 0) * portionFactor
            beta += (carotenoidData.caroteneBeta ? carotenoidData.caroteneBeta : 0) * portionFactor
            cryptoxanthin += (carotenoidData.cryptoxanthin ? carotenoidData.cryptoxanthin : 0) * portionFactor
            lycopene += (carotenoidData.lycopene ? carotenoidData.lycopene : 0) * portionFactor
            lutein += (carotenoidData.lutein ? carotenoidData.lutein : 0) * portionFactor
        }
    })

    return {
        caroteneAlpha: createFinalValue(alpha, portionSize),
        caroteneBeta: createFinalValue(beta, portionSize),
        cryptoxanthin: createFinalValue(cryptoxanthin, portionSize),
        lycopene: createFinalValue(lycopene, portionSize),
        lutein: createFinalValue(lutein, portionSize)
    }
}

function buildExtendedVitaminEObject(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): ExtendedVitaminE {
    let tocopherolBeta = 0
    let tocopherolGamma = 0
    let tocopherolDelta = 0
    let tocotrienolAlpha = 0
    let tocotrienolBeta = 0
    let tocotrienolGamma = 0

    compositeList.forEach(selectedFoodItem => {
        const extendedVitaminEData = getNutrientData(selectedFoodItem).vitaminData.extendedVitaminE
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        if (extendedVitaminEData !== null) {
            tocopherolBeta += (extendedVitaminEData.tocopherolBeta ? extendedVitaminEData.tocopherolBeta : 0) * portionFactor
            tocopherolGamma += (extendedVitaminEData.tocopherolGamma ? extendedVitaminEData.tocopherolGamma : 0) * portionFactor
            tocopherolDelta += (extendedVitaminEData.tocopherolDelta ? extendedVitaminEData.tocopherolDelta : 0) * portionFactor
            tocotrienolAlpha += (extendedVitaminEData.tocotrienolAlpha ? extendedVitaminEData.tocotrienolAlpha : 0) * portionFactor
            tocotrienolBeta += (extendedVitaminEData.tocotrienolBeta ? extendedVitaminEData.tocotrienolBeta : 0) * portionFactor
            tocotrienolGamma += (extendedVitaminEData.tocotrienolGamma ? extendedVitaminEData.tocotrienolGamma : 0) * portionFactor
        }
    })

    return {
        tocopherolBeta: createFinalValue(tocopherolBeta, portionSize),
        tocopherolGamma: createFinalValue(tocopherolGamma, portionSize),
        tocopherolDelta: createFinalValue(tocopherolDelta, portionSize),
        tocotrienolAlpha: createFinalValue(tocotrienolAlpha, portionSize),
        tocotrienolBeta: createFinalValue(tocotrienolBeta, portionSize),
        tocotrienolGamma: createFinalValue(tocotrienolGamma, portionSize)
    }
}


function buildMineralDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): MineralData {
    let calcium = 0;
    let iron = 0;
    let magnesium = 0;
    let phosphorus = 0;
    let potassium = 0;
    let sodium = 0;
    let zinc = 0;
    let copper = 0;
    let manganese = 0;
    let selenium = 0;

    compositeList.forEach(selectedFoodItem => {
        const mineralData = getNutrientData(selectedFoodItem).mineralData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        calcium += (mineralData.calcium ? mineralData.calcium : 0) * portionFactor;
        iron += (mineralData.iron ? mineralData.iron : 0) * portionFactor;
        magnesium += (mineralData.magnesium ? mineralData.magnesium : 0)
        phosphorus += (mineralData.phosphorus ? mineralData.phosphorus : 0)
        potassium += (mineralData.potassium ? mineralData.potassium : 0)
        sodium += (mineralData.sodium ? mineralData.sodium : 0)
        zinc += (mineralData.zinc ? mineralData.zinc : 0)
        copper += (mineralData.copper ? mineralData.copper : 0)
        manganese += (mineralData.manganese ? mineralData.manganese : 0)
        selenium += (mineralData.selenium ? mineralData.selenium : 0)
    })

    return {
        calcium: createFinalValue(calcium, portionSize),
        iron: createFinalValue(iron, portionSize),
        magnesium: createFinalValue(magnesium, portionSize),
        phosphorus: createFinalValue(phosphorus, portionSize),
        potassium: createFinalValue(potassium, portionSize),
        sodium: createFinalValue(sodium, portionSize),
        zinc: createFinalValue(zinc, portionSize),
        copper: createFinalValue(copper, portionSize),
        manganese: createFinalValue(manganese, portionSize),
        selenium: createFinalValue(selenium, portionSize),
    }
}


function buildCarbohydrateData(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): CarbohydrateData {
    let glucose = 0;
    let fructose = 0;
    let galactose = 0;
    let sucrose = 0;
    let maltose = 0;
    let lactose = 0;
    let starch = 0;
    let sugar = 0;

    compositeList.forEach(selectedFoodItem => {
        const carbohydrateData = getNutrientData(selectedFoodItem).carbohydrateData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        glucose += (carbohydrateData.glucose ? carbohydrateData.glucose : 0) * portionFactor;
        fructose += (carbohydrateData.fructose ? carbohydrateData.fructose : 0) * portionFactor;
        galactose += (carbohydrateData.galactose ? carbohydrateData.galactose : 0) * portionFactor;
        sucrose += (carbohydrateData.sucrose ? carbohydrateData.sucrose : 0) * portionFactor;
        maltose += (carbohydrateData.maltose ? carbohydrateData.maltose : 0) * portionFactor;
        lactose += (carbohydrateData.lactose ? carbohydrateData.lactose : 0) * portionFactor;
        starch += (carbohydrateData.starch ? carbohydrateData.starch : 0) * portionFactor;
        sugar += (carbohydrateData.sugar ? carbohydrateData.sugar : 0) * portionFactor;
    })

    return {
        glucose: createFinalValue(glucose, portionSize),
        fructose: createFinalValue(fructose, portionSize),
        galactose: createFinalValue(galactose, portionSize),
        sucrose: createFinalValue(sucrose, portionSize),
        maltose: createFinalValue(maltose, portionSize),
        lactose: createFinalValue(lactose, portionSize),
        starch: createFinalValue(starch, portionSize),
        sugar: createFinalValue(sugar, portionSize),
    }
}


function buildProteinData(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): ProteinData {
    let tryptophan = 0;
    let threonine = 0;
    let isoleucine = 0;
    let leucine = 0;
    let lysine = 0;
    let methionine = 0;
    let cystine = 0;
    let phenylalanine = 0;
    let tyrosine = 0;
    let valine = 0;
    let arginine = 0;
    let histidine = 0;
    let alanine = 0;
    let asparticAcid = 0;
    let glutamicAcid = 0;
    let glycine = 0;
    let proline = 0;
    let serine = 0;

    compositeList.forEach(selectedFoodItem => {
        const proteinData = getNutrientData(selectedFoodItem).proteinData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        tryptophan += (proteinData.tryptophan ? proteinData.tryptophan : 0) * portionFactor;
        threonine += (proteinData.threonine ? proteinData.threonine : 0) * portionFactor;
        isoleucine += (proteinData.isoleucine ? proteinData.isoleucine : 0) * portionFactor;
        leucine += (proteinData.leucine ? proteinData.leucine : 0) * portionFactor;
        lysine += (proteinData.lysine ? proteinData.lysine : 0) * portionFactor;
        methionine += (proteinData.methionine ? proteinData.methionine : 0) * portionFactor;
        cystine += (proteinData.cystine ? proteinData.cystine : 0) * portionFactor;
        phenylalanine += (proteinData.phenylalanine ? proteinData.phenylalanine : 0) * portionFactor;
        tyrosine += (proteinData.tyrosine ? proteinData.tyrosine : 0) * portionFactor;
        valine += (proteinData.valine ? proteinData.valine : 0) * portionFactor;
        arginine += (proteinData.arginine ? proteinData.arginine : 0) * portionFactor;
        histidine += (proteinData.histidine ? proteinData.histidine : 0) * portionFactor;
        alanine += (proteinData.alanine ? proteinData.alanine : 0) * portionFactor;
        asparticAcid += (proteinData.asparticAcid ? proteinData.asparticAcid : 0) * portionFactor;
        glutamicAcid += (proteinData.glutamicAcid ? proteinData.glutamicAcid : 0) * portionFactor;
        glycine += (proteinData.glycine ? proteinData.glycine : 0) * portionFactor;
        proline += (proteinData.proline ? proteinData.proline : 0) * portionFactor;
        serine += (proteinData.serine ? proteinData.serine : 0) * portionFactor;
    })

    return {
        tryptophan: createFinalValue(tryptophan, portionSize),
        threonine: createFinalValue(threonine, portionSize),
        isoleucine: createFinalValue(isoleucine, portionSize),
        leucine: createFinalValue(leucine, portionSize),
        lysine: createFinalValue(lysine, portionSize),
        methionine: createFinalValue(methionine, portionSize),
        cystine: createFinalValue(cystine, portionSize),
        phenylalanine: createFinalValue(phenylalanine, portionSize),
        tyrosine: createFinalValue(tyrosine, portionSize),
        valine: createFinalValue(valine, portionSize),
        arginine: createFinalValue(arginine, portionSize),
        histidine: createFinalValue(histidine, portionSize),
        alanine: createFinalValue(alanine, portionSize),
        asparticAcid: createFinalValue(asparticAcid, portionSize),
        glutamicAcid: createFinalValue(glutamicAcid, portionSize),
        glycine: createFinalValue(glycine, portionSize),
        proline: createFinalValue(proline, portionSize),
        serine: createFinalValue(serine, portionSize),
    }

}


function buildLipidData(compositeList: Array<SelectedFoodItem>, portionSize: number, preferredSource: string): LipidData {
    let unsaturatedMono = 0;
    let unsaturatedPoly = 0;
    let saturated = 0;
    let omega3 = 0;
    let omega6 = 0;
    let omegaUncertain = 0;
    let cholesterol = 0;
    let transFattyAcids = 0;

    compositeList.forEach(selectedFoodItem => {
        const lipidData = getNutrientData(selectedFoodItem).lipidData
        const userSetPortion = selectedFoodItem.portion.amount
        const portionFactor = userSetPortion / 100

        unsaturatedMono += (lipidData.unsaturatedMono ? lipidData.unsaturatedMono : 0) * portionFactor;
        unsaturatedPoly += (lipidData.unsaturatedPoly ? lipidData.unsaturatedPoly : 0) * portionFactor;
        saturated += (lipidData.saturated ? lipidData.saturated : 0) * portionFactor;
        omega3 += (lipidData.omegaData?.omega3 ? lipidData.omegaData.omega3 : 0) * portionFactor;
        omega6 += (lipidData.omegaData?.omega6 ? lipidData.omegaData.omega6 : 0) * portionFactor;
        omegaUncertain += (lipidData.omegaData?.uncertain ? lipidData.omegaData.uncertain : 0) * portionFactor;
        cholesterol += (lipidData.cholesterol ? lipidData.cholesterol : 0) * portionFactor;
        transFattyAcids += (lipidData.transFattyAcids ? lipidData.transFattyAcids : 0) * portionFactor;
    })

    const omegaRatio = (omega3 + omega6) / (omega3 + omega6 + omegaUncertain)

    return {
        unsaturatedMono: createFinalValue(unsaturatedMono, portionSize),
        unsaturatedPoly: createFinalValue(unsaturatedPoly, portionSize),
        saturated: createFinalValue(saturated, portionSize),
        omegaData: {
            omega3: createFinalValue(omega3, portionSize),
            omega6: createFinalValue(omega6, portionSize),
            uncertain: createFinalValue(omegaUncertain, portionSize),
            uncertainRatio: omegaRatio
        },
        cholesterol: createFinalValue(cholesterol, portionSize),
        transFattyAcids: createFinalValue(transFattyAcids, portionSize),
    }
}


function createFinalValue(value, totalPortionAmount) {
    return (value / totalPortionAmount) * 100;
}