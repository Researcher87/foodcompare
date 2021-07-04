import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import FoodItem, {
    BaseData,
    CarbohydrateData,
    LipidData,
    MineralData,
    NutrientData,
    ProteinData,
    VitaminData
} from "../types/nutrientdata/FoodItem";

export default function combineFoodItems(compositeList: Array<SelectedFoodItem>): SelectedFoodItem {
    let portionSize = 0;

    compositeList.forEach(selectedFoodItem => {
        portionSize += selectedFoodItem.portion.amount
    })

    const nutrientDataList = buildAggregatedNutrientDataList(compositeList, portionSize);
    const id = new Date().getTime();

    const aggreatedFoodItem: FoodItem = {
        id: id,
        nutrientDataList: nutrientDataList,
        aggregated: true
    }

    let combinedFoodItem: SelectedFoodItem = {
        id: id,
        foodItem: aggreatedFoodItem,
        portion: {
            portionType: 999,
            amount: portionSize
        },
        compositeSubElements: compositeList
    };

    return combinedFoodItem;
}


function buildAggregatedNutrientDataList(compositeList: Array<SelectedFoodItem>, portionSize: number): Array<NutrientData> {
    const baseData = buildBaseDataObject(compositeList, portionSize);
    const vitaminData = buildVitaminDataObject(compositeList, portionSize);
    const mineralData = buildMineralDataObject(compositeList, portionSize);
    const carbohydrateData = buildCarbohydrateData(compositeList, portionSize);
    const lipidData = buildLipidData(compositeList, portionSize);
    const proteinData = buildProteinData(compositeList, portionSize);

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

    nutrientObject = removeNutrientObjectsWithNullValues(nutrientObject, compositeList);

    const nutrientDataList: Array<NutrientData> = [];
    nutrientDataList.push(nutrientObject);

    return nutrientDataList;
}


/**
 * Removes all nutrient data elements that do not exist in ALL of the food elements within the list.
 * @param nutrientObject
 * @param compositeList
 */
function removeNutrientObjectsWithNullValues(nutrientObject: NutrientData, compositeList: Array<SelectedFoodItem>) {
    if (!compositeList) {
        return nutrientObject;
    }

    for (let i = 0; i < compositeList.length; i++) {
        let foodItem = compositeList[i].foodItem;
        const nutrientData = foodItem.nutrientDataList[0];

        const threshold = 0.05;   // Defines the amount of base data which must be exist to set a sub-value to null.

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

    }

    return nutrientObject;
}


function buildBaseDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number): BaseData {
    let energy = 0;
    let carbohydrates = 0;
    let lipids = 0;
    let proteins = 0;
    let water = 0;
    let dietaryFibers = 0;
    let alcohol = 0;
    let ash = 0;

    compositeList.forEach(selectedFoodItem => {
        const baseData = selectedFoodItem.foodItem.nutrientDataList[0].baseData;
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
    })

    return {
        energy: createFinalValue(energy, portionSize),
        carbohydrates: createFinalValue(carbohydrates, portionSize),
        lipids: createFinalValue(lipids, portionSize),
        proteins: createFinalValue(proteins, portionSize),
        water: createFinalValue(water, portionSize),
        dietaryFibers: createFinalValue(dietaryFibers, portionSize),
        alcohol: alcohol,
        ash: ash
    }

}


function buildVitaminDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number): VitaminData {
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
        const vitaminData = selectedFoodItem.foodItem.nutrientDataList[0].vitaminData
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
    }
}


function buildMineralDataObject(compositeList: Array<SelectedFoodItem>, portionSize: number): MineralData {
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
        const mineralData = selectedFoodItem.foodItem.nutrientDataList[0].mineralData
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


function buildCarbohydrateData(compositeList: Array<SelectedFoodItem>, portionSize: number): CarbohydrateData {
    let glucose = 0;
    let fructose = 0;
    let galactose = 0;
    let sucrose = 0;
    let maltose = 0;
    let lactose = 0;
    let starch = 0;
    let sugar = 0;

    compositeList.forEach(selectedFoodItem => {
        const carbohydrateData = selectedFoodItem.foodItem.nutrientDataList[0].carbohydrateData
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


function buildProteinData(compositeList: Array<SelectedFoodItem>, portionSize: number): ProteinData {
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
        const proteinData = selectedFoodItem.foodItem.nutrientDataList[0].proteinData
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


function buildLipidData(compositeList: Array<SelectedFoodItem>, portionSize: number): LipidData {
    let unsaturatedMono = 0;
    let unsaturatedPoly = 0;
    let saturated = 0;
    let omega3 = 0;
    let omega6 = 0;
    let omegaUncertain = 0;
    let cholesterol = 0;
    let transFattyAcids = 0;

    compositeList.forEach(selectedFoodItem => {
        const lipidData = selectedFoodItem.foodItem.nutrientDataList[0].lipidData
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