import * as MathService from './calculation/MathService';
import {applicationStrings} from "../static/labels";
import {FoodTableDataObject} from "../types/livedata/SelectedFoodItemData";
import {getNutrientData} from "./nutrientdata/NutrientDataRetriever";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {getTotalAmountOfCarotenoids} from "./calculation/provitaminCalculation/CarotenoidCalculationService";
import {CATEGORY_BEVERAGE} from "../config/Constants";
import {
    getTotalAmountOfExtendedVitaminE,
    hasExtendedData
} from "./calculation/provitaminCalculation/ExtendedVitaminECalculationService";
import DietaryRequirement, {
    MineralRequirementData, ProteinRequirementData, RequirementData,
    VitaminRequirementData
} from "../types/nutrientdata/DietaryRequirement";
import {determineDailyRequirement} from "./calculation/DietaryRequirementService";
import {UserData} from "../types/livedata/UserData";
import {
    EC_FACTOR_TOCOTRIENOL_ALPHA, EC_FACTOR_TOCOTRIENOL_BETA, EC_FACTOR_TOCOTRIENOL_GAMMA,
    EQ_FACTOR_BETA_CAROTENE,
    EQ_FACTOR_OTHER_CAROTENE, EQ_FACTOR_TOCOPHEROL_BETA, EQ_FACTOR_TOCOPHEROL_DELTA, EQ_FACTOR_TOCOPHEROL_GAMMA
} from "./calculation/provitaminCalculation/ProvitaminEquivalentFactors";
import {autoRound} from "./calculation/MathService";

export interface TableCalculationParams {
    selectedFoodItem: SelectedFoodItem
    portion: number
    language: string
    preferredSource: string
    dietaryRequirement?: DietaryRequirement
    userData?: UserData
}

export function createBaseDataTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language} = params

    const {
        water,
        carbohydrates,
        lipids,
        proteins,
        dietaryFibers,
        ash,
        alcohol
    } = getNutrientData(selectedFoodItem).baseData
    const {sugar} = getNutrientData(selectedFoodItem).carbohydrateData

    if (water !== null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_water[language],
            water,
            portion, "g")
        );
    }

    if (carbohydrates !== null) {
        const carbObject = makeCarbsTableObject(carbohydrates, sugar, dietaryFibers, portion, language)
        tableData.push(carbObject)
    }

    if (lipids !== null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids[language],
            lipids,
            portion, "g")
        );
    }

    if (proteins !== null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_proteins[language],
            proteins,
            portion, "g")
        );
    }

    // We display alcohol content only if the food class is beverage or unknown
    if (alcohol !== null && (selectedFoodItem.foodClass?.category === CATEGORY_BEVERAGE || selectedFoodItem.foodClass === null)) {
        tableData.push(createTableObjectAlcohol(
            applicationStrings.label_nutrient_alcohol[language],
            alcohol,
            portion, "g")
        );
    }

    if (ash !== null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_ash[language],
            ash,
            portion, "g")
        );
    }

    return tableData;
}


export function createVitaminTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language, dietaryRequirement, userData} = params
    const vitRequirementData = dietaryRequirement?.vitaminRequirementData ?? null

    const nutrientData = getNutrientData(selectedFoodItem)

    if (nutrientData.vitaminData.a != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.a, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_a[language],
                nutrientData.vitaminData.a,
                portion,
                "mg",
                requirement
            )
        );
    }

    const {carotenoidData} = nutrientData.vitaminData

    if (carotenoidData != null) {
        const totalCarotenoid = getTotalAmountOfCarotenoids(carotenoidData)

        if (totalCarotenoid !== null) {
            let reqString = ""
            if (vitRequirementData && userData) {
                const requirementVitaminA = determineDailyRequirement(vitRequirementData.a, userData)
                reqString = `${requirementVitaminA} mg Vit. A ≙`
            }

            let carotenoidTableObject = createTableObject(
                applicationStrings.label_nutrient_vit_carotenoid[language],
                totalCarotenoid,
                portion, "mg", reqString
            )

            if (carotenoidData.caroteneAlpha !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const requirementVitaminA = determineDailyRequirement(vitRequirementData.a, userData)
                    const equivalentVitA = autoRound(requirementVitaminA / EQ_FACTOR_OTHER_CAROTENE)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} mg`
                }

                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_carotenoid_alpha[language]}`

                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    carotenoidData.caroteneAlpha,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (carotenoidData.caroteneBeta !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const requirementVitaminA = determineDailyRequirement(vitRequirementData.a, userData)
                    const equivalentVitA = autoRound(requirementVitaminA / EQ_FACTOR_BETA_CAROTENE)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} mg`
                }

                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_carotenoid_beta[language]}`
                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    carotenoidData.caroteneBeta,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (carotenoidData.cryptoxanthin !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const requirementVitaminA = determineDailyRequirement(vitRequirementData.a, userData)
                    const equivalentVitA = autoRound(requirementVitaminA / EQ_FACTOR_OTHER_CAROTENE)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_cryptoxanthin[language]}`
                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    carotenoidData.cryptoxanthin,
                    portion,
                    "mg",
                    reqString
                )
            }

            tableData.push(carotenoidTableObject)
        }
    }

    if (nutrientData.vitaminData.b1 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b1, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b1[language],
                nutrientData.vitaminData.b1,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b2 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b2, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b2[language],
                nutrientData.vitaminData.b2,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b3 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b3, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b3[language],
                nutrientData.vitaminData.b3,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b5 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b5, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b5[language],
                nutrientData.vitaminData.b5,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b6 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b6, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b6[language],
                nutrientData.vitaminData.b6,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b9 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b9, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b9[language],
                nutrientData.vitaminData.b9,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b12 != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.b12, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b12[language],
                nutrientData.vitaminData.b12,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.c != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.c, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_c[language],
                nutrientData.vitaminData.c,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.d != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.d, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_d[language],
                nutrientData.vitaminData.d,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.e != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.e, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_e[language],
                nutrientData.vitaminData.e,
                portion,
                "mg",
                requirement
            )
        );
    }

    const {extendedVitaminE} = nutrientData.vitaminData

    if (nutrientData.vitaminData.e !== null && extendedVitaminE !== null && hasExtendedData(extendedVitaminE)) {
        const totalExtensions = getTotalAmountOfExtendedVitaminE(extendedVitaminE)

        if (totalExtensions !== null) {
            let reqString = ""
            if (vitRequirementData && userData) {
                const requirementVitaminA = determineDailyRequirement(vitRequirementData.e, userData)
                reqString = `${requirementVitaminA} mg Vit. E ≙`
            }

            let extendedVitaminETable = createTableObject(
                applicationStrings.label_nutrient_vit_e_ext[language],
                totalExtensions,
                portion,
                "mg",
                reqString
            )

            if (extendedVitaminE.tocopherolBeta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EQ_FACTOR_TOCOPHEROL_BETA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolBeta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocopherolBeta,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (extendedVitaminE.tocopherolGamma !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EQ_FACTOR_TOCOPHEROL_GAMMA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolGamma[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocopherolGamma,
                    portion,
                    "mg",
                    reqString)
            }

            if (extendedVitaminE.tocopherolDelta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EQ_FACTOR_TOCOPHEROL_DELTA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolDelta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocopherolDelta,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolAlpha !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EC_FACTOR_TOCOTRIENOL_ALPHA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolAlpha[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocotrienolAlpha,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolBeta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EC_FACTOR_TOCOTRIENOL_BETA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolBeta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocotrienolBeta,
                    portion,
                    "mg",
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolGamma !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                    const equivalentVitE = autoRound(requirementVitaminE / EC_FACTOR_TOCOTRIENOL_GAMMA)
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} mg`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolGamma[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    extendedVitaminE.tocotrienolGamma,
                    portion,
                    "mg",
                    reqString
                )
            }

            tableData.push(extendedVitaminETable)
        }
    }

    if (nutrientData.vitaminData.k != null) {
        const requirement = vitRequirementData && userData ? makeDietaryRequirementString(vitRequirementData.k, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_k[language],
                nutrientData.vitaminData.k,
                portion,
                "mg",
                requirement
            )
        );
    }

    return tableData;
}


export function createMineralTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language, dietaryRequirement, userData} = params
    const minRequirementData = dietaryRequirement?.mineralRequirementData ?? null

    const firstNutrientData = getNutrientData(selectedFoodItem);

    if (firstNutrientData.mineralData.calcium != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.calcium, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_calcium[language],
                firstNutrientData.mineralData.calcium,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.iron != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.iron, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_iron[language],
                firstNutrientData.mineralData.iron,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.magnesium != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.magnesium, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_magnesium[language],
                firstNutrientData.mineralData.magnesium,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.phosphorus != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.phosphorus, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_phosphorus[language],
                firstNutrientData.mineralData.phosphorus,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.potassium != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.potassium, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_potassimum[language],
                firstNutrientData.mineralData.potassium,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.sodium != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.sodium, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_sodium[language],
                firstNutrientData.mineralData.sodium,
                portion, "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.zinc != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.zinc, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_zinc[language],
                firstNutrientData.mineralData.zinc,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.copper != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.copper, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_copper[language],
                firstNutrientData.mineralData.copper,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.manganese != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.manganese, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_manganese[language],
                firstNutrientData.mineralData.manganese,
                portion,
                "mg",
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.selenium != null) {
        const requirement = minRequirementData && userData ? makeDietaryRequirementString(minRequirementData.selenium, userData) : ""
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_selenium[language],
                firstNutrientData.mineralData.selenium,
                portion,
                "mg",
                requirement
            )
        );
    }

    return tableData;
}


export function createLipidsTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language} = params
    const firstNutrientData = getNutrientData(selectedFoodItem);

    if (firstNutrientData.lipidData.saturated != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_saturated[language],
            firstNutrientData.lipidData.saturated,
            portion, "g")
        );
    }

    if (firstNutrientData.lipidData.unsaturatedMono != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_unsaturated_mono[language],
            firstNutrientData.lipidData.unsaturatedMono,
            portion, "g")
        );
    }

    if (firstNutrientData.lipidData.unsaturatedPoly != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_unsaturated_poly[language],
            firstNutrientData.lipidData.unsaturatedPoly,
            portion, "g")
        );
    }

    if (firstNutrientData.lipidData.omegaData) {
        if (firstNutrientData.lipidData.omegaData.omega3 != null) {
            tableData.push(createTableObject(
                `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega3[language]}`,
                firstNutrientData.lipidData.omegaData.omega3,
                portion, "g")
            );
        }

        if (firstNutrientData.lipidData.omegaData.omega6 != null) {
            tableData.push(createTableObject(
                `${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega6[language]}`,
                firstNutrientData.lipidData.omegaData.omega6,
                portion, "g")
            );
        }
    }

    if (firstNutrientData.lipidData.transFattyAcids != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_transfattyAcids[language],
            firstNutrientData.lipidData.transFattyAcids,
            portion, "g")
        );
    }

    if (firstNutrientData.lipidData.cholesterol != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_lipids_cholesterol[language],
            firstNutrientData.lipidData.cholesterol,
            portion, "g")
        );
    }

    return tableData;
}


export function createEnergyTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language} = params

    const nutrientData = getNutrientData(selectedFoodItem)
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


export function createCarbsTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language} = params

    const firstNutrientData = getNutrientData(selectedFoodItem);
    const {carbohydrates, dietaryFibers} = firstNutrientData.baseData
    const {sugar} = firstNutrientData.carbohydrateData

    if (carbohydrates) {
        const carbObject = makeCarbsTableObject(carbohydrates, sugar, dietaryFibers, portion, language)
        tableData.push(carbObject)
    }

    if (firstNutrientData.carbohydrateData.glucose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_glucose[language],
            firstNutrientData.carbohydrateData.glucose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.fructose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_fructose[language],
            firstNutrientData.carbohydrateData.fructose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.galactose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_galactose[language],
            firstNutrientData.carbohydrateData.galactose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.sucrose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_sucrose[language],
            firstNutrientData.carbohydrateData.sucrose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.lactose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_lactose[language],
            firstNutrientData.carbohydrateData.lactose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.maltose != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_maltose[language],
            firstNutrientData.carbohydrateData.maltose,
            portion, "g")
        );
    }

    if (firstNutrientData.carbohydrateData.starch != null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_carbohydrates_starch[language],
            firstNutrientData.carbohydrateData.starch,
            portion, "g")
        );
    }

    return tableData;
}


export function createProteinTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language, dietaryRequirement, userData} = params
    const protRequirementData = dietaryRequirement?.proteinRequirementData ?? null

    const proteinData = getNutrientData(selectedFoodItem).proteinData;
    if (!proteinData) {
        return tableData;
    }

    if (proteinData.tryptophan != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_tryptophan[language],
                convertToMg(proteinData.tryptophan),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.tryptophan, userData)} mg` : ""
            )
        );
    }

    if (proteinData.threonine != null) {
        tableData.push(
                createTableObject(
                applicationStrings.label_nutrient_proteins_threonine[language],
                convertToMg(proteinData.threonine),
                portion,
                    "mg",
                    protRequirementData ? `${calculateProteinRequirement(protRequirementData.threonine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.isoleucine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_isoleucine[language],
                convertToMg(proteinData.isoleucine),
                portion, "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.isoleucine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.leucine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_leucine[language],
                convertToMg(proteinData.leucine),
                portion, "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.leucine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.lysine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_lysine[language],
                convertToMg(proteinData.lysine),
                portion, "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.lysine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.methionine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_methionine[language],
                convertToMg(proteinData.methionine),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.methionine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.cystine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_cystine[language],
                convertToMg(proteinData.cystine),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.cystine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.phenylalanine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_phenylalanine[language],
                convertToMg(proteinData.phenylalanine),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.phenylalanine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.tyrosine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_tyrosine[language],
                convertToMg(proteinData.tyrosine),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.valine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_valine[language],
                convertToMg(proteinData.valine),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.valine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.arginine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_arginine[language],
                convertToMg(proteinData.arginine),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.histidine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_histidine[language],
                convertToMg(proteinData.histidine),
                portion,
                "mg",
                protRequirementData ? `${calculateProteinRequirement(protRequirementData.histidine, userData)} mg` : ""
            )
        );
    }

    if (proteinData.alanine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_alanine[language],
                convertToMg(proteinData.alanine),
                portion, "mg",
                ""
            )
        );
    }

    if (proteinData.asparticAcid != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_asparticAcid[language],
                convertToMg(proteinData.asparticAcid),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.glutamicAcid != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_glutamicAcid[language],
                convertToMg(proteinData.glutamicAcid),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.glycine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_glysine[language],
                convertToMg(proteinData.glycine),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.proline != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_proline[language],
                convertToMg(proteinData.proline),
                portion,
                "mg",
                ""
            )
        );
    }

    if (proteinData.serine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_serine[language],
                convertToMg(proteinData.serine),
                portion,
                "mg",
                ""
            )
        );
    }

    return tableData;
}


function createTableObject(label: string, value_100g: number, portion: number, unit: String, requirement?: string): FoodTableDataObject {
    const valuePortion = calculatePortionData(value_100g, portion);
    return {
        label: label,
        value_100g: `${MathService.autoRound(value_100g)} ${unit}`,
        value_portion: `${MathService.autoRound(valuePortion)} ${unit}`,
        dailyRequirement: requirement ?? ""
    }
}

function createTableObjectAlcohol(label: string, value_100g: number, portion: number, unit: String): FoodTableDataObject {
    const valuePortion = calculatePortionData(value_100g, portion);
    if (valuePortion === null) {
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
    if (value === null || value === undefined) {
        return null;
    } else if (value === 0) {
        return 0;
    }
    return (value / 100) * portionSize;
}


function makeCarbsTableObject(carbohydrates: number, sugar: number | null, dietaryFibers: number | null,
                              portion: number, language: string): FoodTableDataObject {
    let carbObject = createTableObject(
        applicationStrings.label_nutrient_carbohydrates[language],
        carbohydrates,
        portion, "g")

    if (sugar !== null) {
        const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_sugar[language]}`
        carbObject = appendTableDataObject(carbObject, language, label, sugar, portion, "g")
    }

    if (dietaryFibers !== null) {
        const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_dietaryFibers[language]}`
        carbObject = appendTableDataObject(carbObject, language, label, dietaryFibers, portion, "g")
    }

    return carbObject
}


function appendTableDataObject(object: FoodTableDataObject, language: string, label: string, value: number,
                               portion: number, unit: string, reqString?: string): FoodTableDataObject {
    const appendedObject = {...object}
    const extension = createTableObject(label, value, portion, unit, reqString)

    appendedObject.label = appendedObject.label + '&&' + extension.label
    appendedObject.value_100g = appendedObject.value_100g + '&&' + extension.value_100g
    appendedObject.value_portion = appendedObject.value_portion + '&&' + extension.value_portion

    if (reqString) {
        appendedObject.dailyRequirement = appendedObject.dailyRequirement + '&&' + extension.dailyRequirement
    }

    return appendedObject
}

function makeDietaryRequirementString(requirementData: RequirementData, userData: UserData | undefined): string {
    if(userData === undefined) {
        return ""
    }
    const requirement = determineDailyRequirement(requirementData, userData)
    return `${requirement} mg`
}

function convertToMg(amountInGram: number) {
    return amountInGram * 1000;
}

function calculateProteinRequirement(requirementMg: number, userData: UserData | undefined) {
    if(userData === undefined) {
        return 0
    }
    return (requirementMg * userData.weight)
}