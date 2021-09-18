import * as MathService from './calculation/MathService';
import {applicationStrings} from "../static/labels";
import {FoodTableDataObject} from "../types/livedata/SelectedFoodItemData";
import {getNutrientData} from "./nutrientdata/NutrientDataRetriever";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";

export function createBaseDataTable(selectedFoodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];

    const {water, carbohydrates, lipids, proteins, dietaryFibers, ash, alcohol} = getNutrientData(selectedFoodItem).baseData
    const {sugar}  = getNutrientData(selectedFoodItem).carbohydrateData

    if(water) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_water[language],
            water,
            portion, "g")
        );
    }

    if(carbohydrates) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates[language],
            carbohydrates,
            portion, "g")
        );
    }

    if(sugar) {
        tableData.push(createTableObject(
            `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_sugar[language]}`,
            sugar,
            portion, "g")
        );
    }

    if(dietaryFibers) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_dietaryFibers[language],
            dietaryFibers,
            portion, "g")
        );
    }

    if(lipids) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids[language],
            lipids,
            portion, "g")
        );
    }

    if(proteins) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins[language],
            proteins,
            portion, "g")
        );
    }

    if(alcohol) {
        tableData.push(createTableObjectAlcohol(
            applicationStrings.label_nutrient_alcohol[language],
            alcohol,
            portion, "g")
        );
    }

    if(ash) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_ash[language],
            ash,
            portion, "g")
        );
    }

    return tableData;
}



export function createVitaminTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];
    const nutrientData = getNutrientData(foodItem)
    
    if(nutrientData.vitaminData.a != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_a[language],
            nutrientData.vitaminData.a,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b1 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b1[language],
            nutrientData.vitaminData.b1,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b2 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b2[language],
            nutrientData.vitaminData.b2,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b3 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b3[language],
            nutrientData.vitaminData.b3,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b5 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b5[language],
            nutrientData.vitaminData.b5,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b6 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b6[language],
            nutrientData.vitaminData.b6,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b9 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b9[language],
            nutrientData.vitaminData.b9,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.b12 != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_b12[language],
            nutrientData.vitaminData.b12,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.c != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_c[language],
            nutrientData.vitaminData.c,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.d != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_d[language],
            nutrientData.vitaminData.d,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.e != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_e[language],
            nutrientData.vitaminData.e,
            portion, "mg")
        );
    }

    if(nutrientData.vitaminData.k != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_vit_k[language],
            nutrientData.vitaminData.k,
            portion, "mg")
        );
    }

    return tableData;
}


export function createMineralTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];

    const firstNutrientData = getNutrientData(foodItem);

    if(firstNutrientData.mineralData.calcium != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_calcium[language],
            firstNutrientData.mineralData.calcium,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.iron != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_iron[language],
            firstNutrientData.mineralData.iron,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.magnesium != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_magnesium[language],
            firstNutrientData.mineralData.magnesium,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.phosphorus != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_phosphorus[language],
            firstNutrientData.mineralData.phosphorus,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.potassium != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_potassimum[language],
            firstNutrientData.mineralData.potassium,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.sodium != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_sodium[language],
            firstNutrientData.mineralData.sodium,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.zinc != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_zinc[language],
            firstNutrientData.mineralData.zinc,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.copper != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_copper[language],
            firstNutrientData.mineralData.copper,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.manganese != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_manganese[language],
            firstNutrientData.mineralData.manganese,
            portion, "mg")
        );
    }

    if(firstNutrientData.mineralData.selenium != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_min_selenium[language],
            firstNutrientData.mineralData.selenium,
            portion, "mg")
        );
    }

    return tableData;
}


export function createLipidsTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];
    const firstNutrientData = getNutrientData(foodItem);

    if(firstNutrientData.lipidData.saturated != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_saturated[language],
            firstNutrientData.lipidData.saturated,
            portion, "g")
        );
    }

    if(firstNutrientData.lipidData.unsaturatedMono != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_unsaturated_mono[language],
            firstNutrientData.lipidData.unsaturatedMono,
            portion, "g")
        );
    }

    if(firstNutrientData.lipidData.unsaturatedPoly != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_unsaturated_poly[language],
            firstNutrientData.lipidData.unsaturatedPoly,
            portion, "g")
        );
    }

    if(firstNutrientData.lipidData.omegaData) {
        if(firstNutrientData.lipidData.omegaData.omega3 != null) {
            tableData.push(createTableObject(
                `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega3[language]}`,
                firstNutrientData.lipidData.omegaData.omega3,
                portion, "g")
            );
        }

        if(firstNutrientData.lipidData.omegaData.omega6 != null) {
            tableData.push(createTableObject(
                `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega6[language]}`,
                firstNutrientData.lipidData.omegaData.omega6,
                portion, "g")
            );
        }
    }

    if(firstNutrientData.lipidData.transFattyAcids != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_transfattyAcids[language],
            firstNutrientData.lipidData.transFattyAcids,
            portion, "g")
        );
    }

    if(firstNutrientData.lipidData.cholesterol != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_cholesterol[language],
            firstNutrientData.lipidData.cholesterol,
            portion, "g")
        );
    }

    return tableData;
}


export function createEnergyTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];

    const nutrientData = getNutrientData(foodItem)
    const energy = nutrientData.baseData.energy !== null ? nutrientData.baseData.energy : 0;

    tableData.push(createTableObject(
        "kcal",
        energy,
        portion, "")
    );

    tableData.push(createTableObject(
        "kJ",
        MathService.round(4.186 * energy, 1),
        portion, "")
    );

    return tableData;
}



export function createCarbsTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];

    const firstNutrientData = getNutrientData(foodItem);

    tableData.push(createTableObject(
        applicationStrings.label_nutrient_carbohydrates[language],
        firstNutrientData.baseData.carbohydrates,
        portion, "g")
    );

    if(firstNutrientData.carbohydrateData.sugar != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_sugar[language],
            firstNutrientData.carbohydrateData.sugar,
            portion, "g")
        );
    }

    if(firstNutrientData.baseData.dietaryFibers != null) {
        tableData.push(createTableObject(
            `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_dietaryFibers[language]}`,
            firstNutrientData.baseData.dietaryFibers,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.glucose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_glucose[language],
            firstNutrientData.carbohydrateData.glucose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.fructose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_fructose[language],
            firstNutrientData.carbohydrateData.fructose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.galactose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_galactose[language],
            firstNutrientData.carbohydrateData.galactose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.sucrose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_sucrose[language],
            firstNutrientData.carbohydrateData.sucrose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.lactose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_lactose[language],
            firstNutrientData.carbohydrateData.lactose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.maltose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_maltose[language],
            firstNutrientData.carbohydrateData.maltose,
            portion, "g")
        );
    }

    if(firstNutrientData.carbohydrateData.starch != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_starch[language],
            firstNutrientData.carbohydrateData.starch,
            portion, "g")
        );
    }

    return tableData;
}



export function createProteinTable(foodItem: SelectedFoodItem, portion: number, language: string, preferredSource: string): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject>  = [];

    const proteinData = getNutrientData(foodItem).proteinData;
    if(!proteinData) {
        return tableData;
    }

    if(proteinData.tryptophan != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_tryptophan[language],
            proteinData.tryptophan,
            portion, "g")
        );
    }

    if(proteinData.threonine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_threonine[language],
            proteinData.threonine,
            portion, "g")
        );
    }

    if(proteinData.isoleucine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_isoleucine[language],
            proteinData.isoleucine,
            portion, "g")
        );
    }

    if(proteinData.leucine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_leucine[language],
            proteinData.leucine,
            portion, "g")
        );
    }

    if(proteinData.lysine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_lysine[language],
            proteinData.lysine,
            portion, "g")
        );
    }

    if(proteinData.methionine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_methionine[language],
            proteinData.methionine,
            portion, "g")
        );
    }

    if(proteinData.cystine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_cystine[language],
            proteinData.cystine,
            portion, "g")
        );
    }

    if(proteinData.phenylalanine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_phenylalanine[language],
            proteinData.phenylalanine,
            portion, "g")
        );
    }

    if(proteinData.tyrosine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_tyrosine[language],
            proteinData.tyrosine,
            portion, "g")
        );
    }

    if(proteinData.valine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_valine[language],
            proteinData.valine,
            portion, "g")
        );
    }

    if(proteinData.arginine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_arginine[language],
            proteinData.arginine,
            portion, "g")
        );
    }

    if(proteinData.histidine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_histidine[language],
            proteinData.histidine,
            portion, "g")
        );
    }

    if(proteinData.alanine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_alanine[language],
            proteinData.alanine,
            portion, "g")
        );
    }

    if(proteinData.asparticAcid != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_asparticAcid[language],
            proteinData.asparticAcid,
            portion, "g")
        );
    }

    if(proteinData.glutamicAcid != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_glutamicAcid[language],
            proteinData.glutamicAcid,
            portion, "g")
        );
    }

    if(proteinData.glycine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_glysine[language],
            proteinData.glycine,
            portion, "g")
        );
    }

    if(proteinData.proline != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_proline[language],
            proteinData.proline,
            portion, "g")
        );
    }

    if(proteinData.serine != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins_serine[language],
            proteinData.serine,
            portion, "g")
        );
    }

    return tableData;
}


function createTableObject(label: string, value_100g: number, portion: number, unit: String): FoodTableDataObject {
    const valuePortion = calculatePortionData(value_100g, portion);
    return {
        label: label,
        value_100g: `${MathService.autoRound(value_100g)} ${unit}`,
        value_portion: `${MathService.autoRound(valuePortion)} ${unit}`
    }
}

function createTableObjectAlcohol(label: string, value_100g: number, portion: number, unit: String): FoodTableDataObject {
    const valuePortion = calculatePortionData(value_100g, portion);
    if(valuePortion === null) {
        return {
            label: label,
            value_100g: "n/a",
            value_portion: "n/a",
        }
    }

    const valueVolumePortion = valuePortion * 1.267
    const valueVolume100gram = value_100g * 1.267

    return {
        label: label,
        value_100g: `${MathService.autoRound(value_100g)} ${unit}   ( = ${MathService.autoRound(valueVolume100gram)} Vol % )`,
        value_portion: `${MathService.autoRound(valuePortion)} ${unit}   ( = ${MathService.autoRound(valueVolume100gram)} Vol % )`
    }
}


function calculatePortionData(value: number | null, portionSize: number): number | null {
    if(value === null || value === undefined) {
        return null;
    } else if(value === 0) {
        return 0;
    }
    return (value / 100) * portionSize;
}