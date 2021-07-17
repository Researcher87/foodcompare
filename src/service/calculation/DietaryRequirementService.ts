import * as Constants from '../../config/Constants';
import DietaryRequirement, {
    RequirementAgeGroupData,
    RequirementData
} from "../../types/nutrientdata/DietaryRequirement";
import {UserData} from "../../types/livedata/UserData";
import {SEX_MALE} from "../../config/Constants";

/*
 * Determines the daily requirements of a vitamin or mineral for a specific user.
 *
 * dailyRequirementObject: A vitamin or mineral requirement object (e.g. for Vitamin C or Iron).
 * userData: The user data object containing the user data.
 */
export function determineDailyRequirement(dailyRequirementObject: RequirementData, userData: UserData) {
    let ageGroupRequirements

    if (userData.age >= 65) {
        ageGroupRequirements = dailyRequirementObject.senior;
    } else if (userData.age >= 51) {
        ageGroupRequirements = dailyRequirementObject.preSenior;
    } else if (userData.age >= 26) {
        ageGroupRequirements = dailyRequirementObject.midLifeAdult;
    } else if (userData.age >= 19) {
        ageGroupRequirements = dailyRequirementObject.youngAdult;
    } else if (userData.age >= 15) {
        ageGroupRequirements = dailyRequirementObject.youth;
    } else {
        ageGroupRequirements = dailyRequirementObject.youth;   // Default case (should not occur!)
    }

    let value
    if (userData.sex === SEX_MALE) {
        value = ageGroupRequirements.male;
    } else {
        if (userData.pregnant) {
            value = ageGroupRequirements.femalePregnant!!;
        } else if (userData.breastFeeding) {
            value = ageGroupRequirements.femaleBreastFeeding!!;
        } else {
            value = ageGroupRequirements.female;
        }
    }

    return value;
}


/*
 * Determines the ratio (percentage) of vitamins/minerals in food compared to the daily requirements of the user.
 * Example: The daily requirements of Vitamin C is 120 mg for the user. The food contains 24 mg C. The ratio is 0.2 (20 %).
 *
 * dailyRequirementObject: A vitamin or mineral requirement object (e.g. for Vitamin C or Iron).
 * userData: The user data object containing the user data.
 * portionSize: The portion size in gram (100 = default value, i.e., 100 gram).
 * amountInFood: The amount of the vitamin or mineral in the food (which is always 100 gram).
 */
export function determineFoodRequirementRatio(dailyRequirementObject: RequirementData, amountInFood: number, portionSize: number, userData: UserData): number {
    const dailyRequirement = determineDailyRequirement(dailyRequirementObject, userData);
    if (portionSize == 100) {
        return Math.round(amountInFood / dailyRequirement * 1000) / 10;
    } else {   // Calculate ration for a special amount (portion):
        return Math.round(amountInFood / dailyRequirement * (portionSize * 10)) / 10;
    }
}


/*
 * Determines the ratio (percentage) of proteins in food compared to the daily requirements of the user.
 * Example: The daily requirements of Lysine is 30 mg per kg. The user weights 80 kg. His dietary requirement
 * is thus 30 * 80 = 2400 mg per day. The food contains 240 mg C. The ratio is 0.1 (10 %).
 *
 * dailyRequirementObject: A protein requirement object for a specific protein (e.g. for Lycin).
 * userData: The user data object containing the user data.
 * portionSize: The portion size in gram (100 = default value, i.e., 100 gram).
 * amountInFood: The amount of the vitamin or mineral in the food (which is always 100 gram).
 */
export function determineProteinRequirementRatio(requirement: number, amountInFood: number, portionSize: number, userData: UserData) {
    const dailyRequirement = (requirement * userData.weight) / 1000;

    if (portionSize == 100) {
        return Math.round(amountInFood / dailyRequirement * 1000) / 10;
    } else {   // Calculate ration for a special amount (portion):
        return Math.round(amountInFood / dailyRequirement * (portionSize * 10)) / 10;
    }
}


export function convertAbsoluteValueToDailyRequirement(dailyRequirements: DietaryRequirement, item: string, amount: number, userData: UserData) {
    let dailyRequirementObject

    if (item === Constants.DATA_VITAMINS_A) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.a;
    }

    if (item === Constants.DATA_VITAMINS_B1) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b1;
    }

    if (item === Constants.DATA_VITAMINS_B2) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b2;
    }

    if (item === Constants.DATA_VITAMINS_B3) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b3;
    }

    if (item === Constants.DATA_VITAMINS_B5) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b5;
    }

    if (item === Constants.DATA_VITAMINS_B6) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b6;
    }

    if (item === Constants.DATA_VITAMINS_B9) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b9;
    }

    if (item === Constants.DATA_VITAMINS_B12) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.b12;
    }

    if (item === Constants.DATA_VITAMINS_C) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.c;
    }

    if (item === Constants.DATA_VITAMINS_D) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.d;
    }

    if (item === Constants.DATA_VITAMINS_E) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.e;
    }

    if (item === Constants.DATA_VITAMINS_K) {
        dailyRequirementObject = dailyRequirements.vitaminRequirementData.k;
    }

    if (item === Constants.DATA_MINERAL_CALCIUM) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.calcium;
    }

    if (item === Constants.DATA_MINERAL_COPPER) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.copper;
    }

    if (item === Constants.DATA_MINERAL_IRON) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.iron;
    }

    if (item === Constants.DATA_MINERAL_MAGNESIUM) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.magnesium;
    }

    if (item === Constants.DATA_MINERAL_MANGANESE) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.manganese;
    }

    if (item === Constants.DATA_MINERAL_PHOSPHORUS) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.phosphorus;
    }

    if (item === Constants.DATA_MINERAL_POTASSIUM) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.potassium;
    }

    if (item === Constants.DATA_MINERAL_SELENIUM) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.selenium;
    }

    if (item === Constants.DATA_MINERAL_SODIUM) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.sodium;
    }

    if (item === Constants.DATA_MINERAL_ZINC) {
        dailyRequirementObject = dailyRequirements.mineralRequirementData.zinc;
    }

    if (!dailyRequirementObject) {
        console.error('No requirement data object generated.')
        return 0
    }

    const dailyRequirement = determineDailyRequirement(dailyRequirementObject, userData);
    return Math.round(amount / dailyRequirement * 1000) / 10;
}