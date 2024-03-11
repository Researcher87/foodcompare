import {SEX_MALE} from '../../config/Constants';
import {applicationStrings} from "../../static/labels";
import * as EnergyConstants from '../../config/EnergyConstants'
import {PalCategory} from "../../types/livedata/PalCategory";


/**
 * Creates a list of PAL categories with name and value for the user settings form.
 */
export function getPalCategories(language: string): Array<PalCategory> {
    return [
        {label: createPalCategoryName(language, 1), value: EnergyConstants.PAL_CATEGORY_1},
        {label: createPalCategoryName(language, 2), value: EnergyConstants.PAL_CATEGORY_2},
        {label: createPalCategoryName(language, 3), value: EnergyConstants.PAL_CATEGORY_3},
        {label: createPalCategoryName(language, 4), value: EnergyConstants.PAL_CATEGORY_4},
        {label: createPalCategoryName(language, 5), value: EnergyConstants.PAL_CATEGORY_5},
        {label: createPalCategoryName(language, 6), value: EnergyConstants.PAL_CATEGORY_6},
        {label: createPalCategoryName(language, 7), value: EnergyConstants.PAL_CATEGORY_7},
    ];
}

/**
 * Returns the PAL category number of a PAL value.
 *
 * value: The PAL value, e.g. 1.4 or 1.6.
 */
export function getPalCategory(value: number): number {
    switch(value) {
        case EnergyConstants.PAL_CATEGORY_1:
            return 1
        case EnergyConstants.PAL_CATEGORY_2:
            return 2
        case EnergyConstants.PAL_CATEGORY_3:
            return 3
        case EnergyConstants.PAL_CATEGORY_4:
            return 4
        case EnergyConstants.PAL_CATEGORY_5:
            return 5
        case EnergyConstants.PAL_CATEGORY_6:
            return 6
        case EnergyConstants.PAL_CATEGORY_7:
            return 7
        default:
            return 1
    }
}


export function getPalValue(palCategory: number): number {
	switch(palCategory) {
        case 1:
            return EnergyConstants.PAL_CATEGORY_1
        case 2:
            return EnergyConstants.PAL_CATEGORY_2
        case 3:
            return EnergyConstants.PAL_CATEGORY_3
        case 4:
            return EnergyConstants.PAL_CATEGORY_4
        case 5:
            return EnergyConstants.PAL_CATEGORY_5
        case 6:
            return EnergyConstants.PAL_CATEGORY_6
        case 7:
            return EnergyConstants.PAL_CATEGORY_7
        default:
            return EnergyConstants.PAL_CATEGORY_1
    }
}


function createPalCategoryName(language, category): string {
    const languageLabel = `palcat_name_${category}`;
    const name = applicationStrings[languageLabel][language]

    const energyLabel = `PAL_CATEGORY_${category}`;
    const value = EnergyConstants[energyLabel];
    return `${name} (${value})`;
}


/**
 * Calculates the Basal Metabolic Rate (BMR) of a person.
 */
export function calculateBMR(age: number, size: number, weight: number, sex: string): number {
    if(sex === SEX_MALE) {
        const bmr = 3.4 * weight + 15.3 * size - 6.8 * age - 961;
        return Math.round(bmr);
    } else {
        const bmr = 2.4 * weight + 9.0 * size - 4.7 * age - 65;
        return Math.round(bmr);
    }
}

/**
 * Calculates the total energy consumption of a person in one day.
 *
 * bmr: The bmr value.
 * palValue: The pal value
 * leisureSports: Specifies whether leisure sports is performed or not (+0.3 PAL).
 */
export function calculateTotalEnergyConsumption(bmr: number, palValue: number, leisureSports: boolean): number {
    if(leisureSports) {
        palValue += 0.3;
    }

    return bmr * palValue;
}