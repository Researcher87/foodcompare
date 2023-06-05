import * as Constants from "../config/Constants";
import {applicationStrings} from "../static/labels";
import {autoRound} from "./calculation/MathService";
import FoodItem from "../types/nutrientdata/FoodItem";
import FoodClass from "../types/nutrientdata/FoodClass";
import {getNameFromFoodNameList} from "./nutrientdata/NameTypeService";
import NameType from "../types/nutrientdata/NameType";
import {getNutrientDataForFoodItem} from "./nutrientdata/NutrientDataRetriever";
import getName from "./LanguageService";
import {
    RANKING_BASE_DATA_INDEX,
    RANKING_CARBS_INDEX,
    RANKING_LIPIDS_INDEX,
    RANKING_MINERAL_INDEX,
    RANKING_PROTEIN_INDEX,
    RANKING_VITAMIN_INDEX
} from "../config/Constants";
import ReactSelectOption from "../types/ReactSelectOption";


export interface ChartItem {
    name: string
    value: number
    id?: number   // Possibly, the food item ID to which the bar refers to (juxtaposition chart)
}

/**
 * Returns a list of all ranking categories.
 */
export function getRankingGroups(language: string) {
    return [
        {value: RANKING_BASE_DATA_INDEX, label: applicationStrings.label_chart_nutrientComposition[language]},
        {value: RANKING_VITAMIN_INDEX, label: applicationStrings.label_nutrient_vit[language]},
        {value: RANKING_MINERAL_INDEX, label: applicationStrings.label_nutrient_min[language]},
        {value: RANKING_LIPIDS_INDEX, label: applicationStrings.label_nutrient_lipids_long[language]},
        {value: RANKING_CARBS_INDEX, label: applicationStrings.label_nutrient_carbohydrates[language]},
        {value: RANKING_PROTEIN_INDEX, label: applicationStrings.label_chart_proteins[language]},
    ];
}


/**
 * Returns the list of all selectable vitamins.
 */
export function getBaseCategoryValues(language: string) {
    return [
        {value: Constants.DATA_ENERGY, label: applicationStrings.label_nutrient_energy[language]},
        {value: Constants.DATA_WATER, label: applicationStrings.label_nutrient_water[language]},
        {value: Constants.DATA_CARBS, label: applicationStrings.label_nutrient_carbohydrates[language]},
        {value: Constants.DATA_LIPIDS, label: applicationStrings.label_nutrient_lipids_long[language]},
        {value: Constants.DATA_PROTEINS, label: applicationStrings.label_nutrient_proteins[language]},
        {value: Constants.DATA_ASH, label: applicationStrings.label_nutrient_ash[language]},
    ];
}


/**
 * Returns the list of all selectable vitamin values.
 */
export function getVitaminCategoryValues(language: string) {
    return [
        {value: Constants.DATA_VITAMINS_A, label: applicationStrings.label_nutrient_vit_a[language]},
        {value: Constants.DATA_VITAMINS_B1, label: applicationStrings.label_nutrient_vit_b1[language]},
        {value: Constants.DATA_VITAMINS_B2, label: applicationStrings.label_nutrient_vit_b2[language]},
        {value: Constants.DATA_VITAMINS_B3, label: applicationStrings.label_nutrient_vit_b3[language]},
        {value: Constants.DATA_VITAMINS_B5, label: applicationStrings.label_nutrient_vit_b5[language]},
        {value: Constants.DATA_VITAMINS_B6, label: applicationStrings.label_nutrient_vit_b6[language]},
        {value: Constants.DATA_VITAMINS_B9, label: applicationStrings.label_nutrient_vit_b9[language]},
        {value: Constants.DATA_VITAMINS_B12, label: applicationStrings.label_nutrient_vit_b12[language]},
        {value: Constants.DATA_VITAMINS_C, label: applicationStrings.label_nutrient_vit_c[language]},
        {value: Constants.DATA_VITAMINS_D, label: applicationStrings.label_nutrient_vit_d[language]},
        {value: Constants.DATA_VITAMINS_E, label: applicationStrings.label_nutrient_vit_e[language]},
        {value: Constants.DATA_VITAMINS_K, label: applicationStrings.label_nutrient_vit_k[language]},
    ];
}


/**
 * Returns the list of all selectable mineral values.
 */
export function getMineralCategoryValues(language: string) {
    return [
        {value: Constants.DATA_MINERAL_CALCIUM, label: applicationStrings.label_nutrient_min_calcium[language]},
        {value: Constants.DATA_MINERAL_IRON, label: applicationStrings.label_nutrient_min_iron[language]},
        {value: Constants.DATA_MINERAL_MAGNESIUM, label: applicationStrings.label_nutrient_min_magnesium[language]},
        {value: Constants.DATA_MINERAL_PHOSPHORUS, label: applicationStrings.label_nutrient_min_phosphorus[language]},
        {value: Constants.DATA_MINERAL_POTASSIUM, label: applicationStrings.label_nutrient_min_potassimum[language]},
        {value: Constants.DATA_MINERAL_SODIUM, label: applicationStrings.label_nutrient_min_sodium[language]},
        {value: Constants.DATA_MINERAL_ZINC, label: applicationStrings.label_nutrient_min_zinc[language]},
        {value: Constants.DATA_MINERAL_SELENIUM, label: applicationStrings.label_nutrient_min_selenium[language]},
        {value: Constants.DATA_MINERAL_MANGANESE, label: applicationStrings.label_nutrient_min_manganese[language]},
        {value: Constants.DATA_MINERAL_COPPER, label: applicationStrings.label_nutrient_min_copper[language]},
    ];
}


/**
 * Returns the list of all selectable mineral values.
 */
export function getLipidCategoryValues(language: string) {
    return [
        {value: Constants.DATA_LIPIDS_SATURATED, label: applicationStrings.label_nutrient_lipids_saturated[language]},
        {
            value: Constants.DATA_LIPIDS_MONO_UNSATURATED,
            label: applicationStrings.label_nutrient_lipids_unsaturated_mono[language]
        },
        {
            value: Constants.DATA_LIPIDS_POLY_UNSATURATED,
            label: applicationStrings.label_nutrient_lipids_unsaturated_poly[language]
        },
        {
            value: Constants.DATA_LIPIDS_TRANSFATTY_ACIDS,
            label: applicationStrings.label_nutrient_lipids_unsaturated[language]
        },
    ];
}


/**
 * Returns the list of all selectable carbohydrate values.
 */
export function getCarbohydrateCategoryValues(language: string) {
    return [
        {value: Constants.DATA_CARBS_DIETARY_FIBERS, label: applicationStrings.label_nutrient_dietaryFibers[language]},
        {value: Constants.DATA_CARBS_SUGAR, label: applicationStrings.label_nutrient_sugar[language]},
        {value: Constants.DATA_CARBS_GLUCOSE, label: applicationStrings.label_nutrient_carbohydrates_glucose[language]},
        {
            value: Constants.DATA_CARBS_FRUCTOSE,
            label: applicationStrings.label_nutrient_carbohydrates_fructose[language]
        },
        {
            value: Constants.DATA_CARBS_GALACTOSE,
            label: applicationStrings.label_nutrient_carbohydrates_galactose[language]
        },
        {value: Constants.DATA_CARBS_SUCROSE, label: applicationStrings.label_nutrient_carbohydrates_sucrose[language]},
        {value: Constants.DATA_CARBS_LACTOSE, label: applicationStrings.label_nutrient_carbohydrates_lactose[language]},
        {value: Constants.DATA_CARBS_MALTOSE, label: applicationStrings.label_nutrient_carbohydrates_maltose[language]},
        {value: Constants.DATA_CARBS_STARCH, label: applicationStrings.label_nutrient_carbohydrates_starch[language]},
    ];
}


/**
 * Returns the list of all protein values.
 */
export function getProteinCategoryValues(language: string) {
    return [
        {value: Constants.DATA_PROTEIN_ALANINE, label: applicationStrings.label_nutrient_proteins_alanine[language]},
        {value: Constants.DATA_PROTEIN_ARGININE, label: applicationStrings.label_nutrient_proteins_arginine[language]},
        {
            value: Constants.DATA_PROTEIN_ASPARTIC_ACID,
            label: applicationStrings.label_nutrient_proteins_asparticAcid[language]
        },
        {value: Constants.DATA_PROTEIN_CYSTINE, label: applicationStrings.label_nutrient_proteins_cystine[language]},
        {
            value: Constants.DATA_PROTEIN_GLUTAMIC_ACID,
            label: applicationStrings.label_nutrient_proteins_glutamicAcid[language]
        },
        {value: Constants.DATA_PROTEIN_GLYCINE, label: applicationStrings.label_nutrient_proteins_glysine[language]},
        {
            value: Constants.DATA_PROTEIN_HISTIDINE,
            label: applicationStrings.label_nutrient_proteins_histidine[language]
        },
        {
            value: Constants.DATA_PROTEIN_ISOLEUCINE,
            label: applicationStrings.label_nutrient_proteins_isoleucine[language]
        },
        {value: Constants.DATA_PROTEIN_LEUCINE, label: applicationStrings.label_nutrient_proteins_leucine[language]},
        {value: Constants.DATA_PROTEIN_LYSINE, label: applicationStrings.label_nutrient_proteins_lysine[language]},
        {
            value: Constants.DATA_PROTEIN_METHIONINE,
            label: applicationStrings.label_nutrient_proteins_methionine[language]
        },
        {
            value: Constants.DATA_PROTEIN_PHENYLALANINE,
            label: applicationStrings.label_nutrient_proteins_phenylalanine[language]
        },
        {value: Constants.DATA_PROTEIN_PROLINE, label: applicationStrings.label_nutrient_proteins_proline[language]},
        {value: Constants.DATA_PROTEIN_SERINE, label: applicationStrings.label_nutrient_proteins_serine[language]},
        {
            value: Constants.DATA_PROTEIN_THREONINE,
            label: applicationStrings.label_nutrient_proteins_threonine[language]
        },
        {
            value: Constants.DATA_PROTEIN_TRYPTOPHAN,
            label: applicationStrings.label_nutrient_proteins_tryptophan[language]
        },
        {value: Constants.DATA_PROTEIN_TYROSINE, label: applicationStrings.label_nutrient_proteins_tyrosine[language]},
        {value: Constants.DATA_PROTEIN_VALINE, label: applicationStrings.label_nutrient_proteins_valine[language]},
    ];
}


export function getElementsOfRankingGroup(rankingGroup: number, language: string) {
    switch (rankingGroup) {
        case RANKING_BASE_DATA_INDEX:
            return getBaseCategoryValues(language)
        case RANKING_VITAMIN_INDEX:
            return getVitaminCategoryValues(language)
        case RANKING_MINERAL_INDEX:
            return getMineralCategoryValues(language)
        case RANKING_LIPIDS_INDEX:
            return getLipidCategoryValues(language)
        case RANKING_CARBS_INDEX:
            return getCarbohydrateCategoryValues(language)
        case RANKING_PROTEIN_INDEX:
            return getProteinCategoryValues(language)
    }
}


export function getOrderedFoodList(foodList: Array<FoodItem>, foodClassesList: Array<FoodClass>, selectedCategory: number,
                                   selectedValue: any, use100gram: number, language: string, foodNamesList: Array<NameType>,
                                   conditions: Array<NameType>) {
    let chartItems: Array<ChartItem> = [];

    for (let i = 0; i < foodList.length; i++) {
        let foodItem: FoodItem = foodList[i];
        const foodClassId = foodClassesList.find(foodClass => foodClass.id === foodItem.foodClass)
        const category = foodClassId ? foodClassId.category : foodClassId

        if (selectedCategory !== 0 && (category !== selectedCategory)) {
            continue;  // Skip this food item, as it does not belong to the selected category
        }

        let value = getValueOfFoodItem(foodItem, selectedValue);
        if (value === null || value === 0) {
            continue;  // Skip all food items, which do not have the specified value
        }

        let portionAmount

        if (!use100gram) {
            const defaultPortion = foodItem.defaultPortionId
            const portionObject = foodItem.portionData?.find(portionObject => portionObject.portionType === defaultPortion)
            portionAmount = portionObject ? portionObject.amount : 100
            value = getPortionValue(value, portionAmount);
        } else {
            value = autoRound(value)
        }

        let name = getNameFromFoodNameList(foodNamesList, foodItem.nameId!!, language)

        if(foodItem.conditionId !== 100) {
            const condition = conditions.find(condition => condition.id === foodItem.conditionId)
            if(condition) {
                const conditionName = getName(condition, language)
                name = name + ", " + conditionName
            }
        }

        if(!use100gram) {
            name = name + " (" + portionAmount + "g )"
        }

        const chartItem: ChartItem = {
            name: name ? name : "",
            value: value
        };

        chartItems.push(chartItem);
    }

    return sortChartItems(chartItems);
}


export function sortChartItems(chartItems: Array<ChartItem>) {
    return chartItems.sort((obj1, obj2) => {
        if (obj1.value > obj2.value) {
            return -1;
        } else if (obj1.value < obj2.value) {
            return 1;
        } else {
            return 0;
        }
    });
}


export function getValueOfFoodItem(foodItem, selectedValue): number | null {
    let value

    const nutrientData = getNutrientDataForFoodItem(foodItem, 0, true)

    const baseData = nutrientData.baseData;
    const vitaminData = nutrientData.vitaminData;
    const mineralData = nutrientData.mineralData;
    const lipidData = nutrientData.lipidData;
    const carbsData = nutrientData.carbohydrateData;
    const proteinData = nutrientData.proteinData;

    if (proteinData === null) {
        return 0;
    }

    // Base Data

    if (selectedValue === Constants.DATA_ENERGY) {
        value = baseData.energy;
    }

    if (selectedValue === Constants.DATA_WATER) {
        value = baseData.water;
    }

    if (selectedValue === Constants.DATA_CARBS) {
        value = baseData.carbohydrates;
    }

    if (selectedValue === Constants.DATA_LIPIDS) {
        value = baseData.lipids;
    }

    if (selectedValue === Constants.DATA_PROTEINS) {
        value = baseData.proteins;
    }

    if (selectedValue === Constants.DATA_ASH) {
        value = baseData.ash;
    }


    // Vitamins

    if (selectedValue === Constants.DATA_VITAMINS_A) {
        value = vitaminData.a;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B1) {
        value = vitaminData.b1;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B2) {
        value = vitaminData.b2;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B3) {
        value = vitaminData.b3;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B5) {
        value = vitaminData.b5;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B6) {
        value = vitaminData.b6;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B9) {
        value = vitaminData.b9;
    }

    if (selectedValue === Constants.DATA_VITAMINS_B12) {
        value = vitaminData.b12;
    }

    if (selectedValue === Constants.DATA_VITAMINS_C) {
        value = vitaminData.c;
    }

    if (selectedValue === Constants.DATA_VITAMINS_D) {
        value = vitaminData.d;
    }

    if (selectedValue === Constants.DATA_VITAMINS_E) {
        value = vitaminData.e;
    }

    if (selectedValue === Constants.DATA_VITAMINS_K) {
        value = vitaminData.k;
    }


    // Minerals

    if (selectedValue === Constants.DATA_MINERAL_CALCIUM) {
        value = mineralData.calcium;
    }

    if (selectedValue === Constants.DATA_MINERAL_IRON) {
        value = mineralData.iron;
    }

    if (selectedValue === Constants.DATA_MINERAL_MAGNESIUM) {
        value = mineralData.magnesium;
    }

    if (selectedValue === Constants.DATA_MINERAL_PHOSPHORUS) {
        value = mineralData.phosphorus;
    }

    if (selectedValue === Constants.DATA_MINERAL_POTASSIUM) {
        value = mineralData.potassium;
    }

    if (selectedValue === Constants.DATA_MINERAL_SODIUM) {
        value = mineralData.sodium;
    }

    if (selectedValue === Constants.DATA_MINERAL_ZINC) {
        value = mineralData.zinc;
    }

    if (selectedValue === Constants.DATA_MINERAL_SELENIUM) {
        value = mineralData.selenium;
    }

    if (selectedValue === Constants.DATA_MINERAL_COPPER) {
        value = mineralData.copper;
    }

    if (selectedValue === Constants.DATA_MINERAL_MANGANESE) {
        value = mineralData.manganese;
    }

    if (selectedValue === Constants.DATA_LIPIDS_SATURATED) {
        value = lipidData.saturated;
    }

    if (selectedValue === Constants.DATA_LIPIDS_MONO_UNSATURATED) {
        value = lipidData.unsaturatedMono;
    }

    if (selectedValue === Constants.DATA_LIPIDS_POLY_UNSATURATED) {
        value = lipidData.unsaturatedPoly;
    }

    if (selectedValue === Constants.DATA_LIPIDS_TRANSFATTY_ACIDS) {
        value = lipidData.transFattyAcids;
    }


    // Carbohydrates

    if (selectedValue === Constants.DATA_CARBS_DIETARY_FIBERS) {
        value = baseData.dietaryFibers;
    }

    if (selectedValue === Constants.DATA_CARBS_SUGAR) {
        value = carbsData.sugar;
    }

    if (selectedValue === Constants.DATA_CARBS_GLUCOSE) {
        value = carbsData.glucose;
    }

    if (selectedValue === Constants.DATA_CARBS_FRUCTOSE) {
        value = carbsData.fructose;
    }

    if (selectedValue === Constants.DATA_CARBS_GALACTOSE) {
        value = carbsData.galactose;
    }

    if (selectedValue === Constants.DATA_CARBS_SUCROSE) {
        value = carbsData.sucrose;
    }

    if (selectedValue === Constants.DATA_CARBS_LACTOSE) {
        value = carbsData.lactose;
    }

    if (selectedValue === Constants.DATA_CARBS_MALTOSE) {
        value = carbsData.maltose;
    }

    if (selectedValue === Constants.DATA_CARBS_STARCH) {
        value = carbsData.starch;
    }


    // Proteins

    if (selectedValue === Constants.DATA_PROTEIN_ALANINE) {
        value = proteinData.alanine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_ARGININE) {
        value = proteinData.arginine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_ASPARTIC_ACID) {
        value = proteinData.asparticAcid;
    }

    if (selectedValue === Constants.DATA_PROTEIN_CYSTINE) {
        value = proteinData.cystine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_GLUTAMIC_ACID) {
        value = proteinData.glutamicAcid;
    }

    if (selectedValue === Constants.DATA_PROTEIN_GLYCINE) {
        value = proteinData.glycine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_HISTIDINE) {
        value = proteinData.histidine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_ISOLEUCINE) {
        value = proteinData.isoleucine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_LEUCINE) {
        value = proteinData.leucine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_LYSINE) {
        value = proteinData.lysine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_METHIONINE) {
        value = proteinData.methionine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_PHENYLALANINE) {
        value = proteinData.phenylalanine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_PROLINE) {
        value = proteinData.proline;
    }

    if (selectedValue === Constants.DATA_PROTEIN_SERINE) {
        value = proteinData.serine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_THREONINE) {
        value = proteinData.threonine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_TRYPTOPHAN) {
        value = proteinData.tryptophan;
    }

    if (selectedValue === Constants.DATA_PROTEIN_TYROSINE) {
        value = proteinData.tyrosine;
    }

    if (selectedValue === Constants.DATA_PROTEIN_VALINE) {
        value = proteinData.valine;
    }

    return value;
}


function getPortionValue(value, portionSize) {
    const portionValue = value / 100 * portionSize;
    return autoRound(portionValue);
}