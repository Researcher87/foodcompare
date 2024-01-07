import * as MathService from './calculation/MathService';
import {applicationStrings} from "../static/labels";
import {FoodTableDataObject} from "../types/livedata/SelectedFoodItemData";
import {getNutrientData} from "./nutrientdata/NutrientDataRetriever";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {getTotalAmountOfCarotenoids} from "./calculation/provitaminCalculation/CarotenoidCalculationService";
import {CATEGORY_BEVERAGE, OPTION_YES, UNIT_GRAM, UNIT_MICROGRAM, UNIT_MILLIGRAM} from "../config/Constants";
import {
    getTotalAmountOfExtendedVitaminE,
    hasExtendedData
} from "./calculation/provitaminCalculation/ExtendedVitaminECalculationService";
import DietaryRequirement, {RequirementData} from "../types/nutrientdata/DietaryRequirement";
import {determineDailyRequirement} from "./calculation/DietaryRequirementService";
import {UserData} from "../types/livedata/UserData";
import {
    EC_FACTOR_TOCOTRIENOL_ALPHA, EC_FACTOR_TOCOTRIENOL_BETA, EC_FACTOR_TOCOTRIENOL_GAMMA,
    EQ_FACTOR_BETA_CAROTENE,
    EQ_FACTOR_OTHER_CAROTENE, EQ_FACTOR_TOCOPHEROL_BETA, EQ_FACTOR_TOCOPHEROL_DELTA, EQ_FACTOR_TOCOPHEROL_GAMMA
} from "./calculation/provitaminCalculation/ProvitaminEquivalentFactors";
import {autoRound} from "./calculation/MathService";
import {DataSettings} from "../types/livedata/DataSettings";

export interface TableCalculationParams {
    selectedFoodItem: SelectedFoodItem
    portion: number
    language: string
    preferredSource: string
    dietaryRequirement?: DietaryRequirement
    userData?: UserData
    dataSettings: DataSettings
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
        alcohol,
        caffeine
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

    if (caffeine !== null) {
        tableData.push(createTableObject(
            applicationStrings.label_nutrient_caffeine[language],
            caffeine / 1000,
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
    const {selectedFoodItem, portion, language, dietaryRequirement, userData, dataSettings} = params
    const vitRequirementData = dietaryRequirement?.vitaminRequirementData ?? null

    const nutrientData = getNutrientData(selectedFoodItem)
    const unit = params.dataSettings.unitVitamins === UNIT_MILLIGRAM ? "mg" : "µg"

    if(!vitRequirementData || !userData) {
        throw new Error("Vitamin Requirement Data or User Data is not available")
    }

    if (nutrientData.vitaminData.a != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.a, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_a[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.a, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    const {carotenoidData} = nutrientData.vitaminData

    if (carotenoidData != null && dataSettings.includeProvitamins === OPTION_YES) {
        let totalCarotenoid = getTotalAmountOfCarotenoids(carotenoidData)

        if (totalCarotenoid !== null) {
            if(dataSettings.unitVitamins === UNIT_MICROGRAM) {
                totalCarotenoid *= 1000
            }

            let reqString
            let requirementVitaminA = determineDailyRequirement(vitRequirementData.a, userData)
            if(dataSettings.unitVitamins === UNIT_MICROGRAM) {
                requirementVitaminA *= 1000
            }

            reqString = `${requirementVitaminA} ${unit} Vit. A ≙`

            let carotenoidTableObject = createTableObject(
                applicationStrings.label_nutrient_vit_carotenoid[language],
                totalCarotenoid,
                portion, unit, reqString
            )

            if (carotenoidData.caroteneAlpha !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const equivalentVitA = calculateProvitaminEquivalent(
                        vitRequirementData.a,
                        EQ_FACTOR_OTHER_CAROTENE,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} ${unit}`
                }

                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_carotenoid_alpha[language]}`

                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    getVitaminOrMineralAmount(carotenoidData.caroteneAlpha, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (carotenoidData.caroteneBeta !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const equivalentVitA = calculateProvitaminEquivalent(
                        vitRequirementData.a,
                        EQ_FACTOR_BETA_CAROTENE,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} ${unit}`
                }

                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_carotenoid_beta[language]}`
                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    getVitaminOrMineralAmount(carotenoidData.caroteneBeta, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (carotenoidData.cryptoxanthin !== null) {
                let reqString = ""
                if (vitRequirementData && userData) {
                    const equivalentVitA = calculateProvitaminEquivalent(
                        vitRequirementData.a,
                        EQ_FACTOR_OTHER_CAROTENE,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitA} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_cryptoxanthin[language]}`
                carotenoidTableObject = appendTableDataObject(
                    carotenoidTableObject,
                    language,
                    label,
                    getVitaminOrMineralAmount(carotenoidData.cryptoxanthin, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            tableData.push(carotenoidTableObject)
        }
    }

    if (nutrientData.vitaminData.b1 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b1, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b1[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b1, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b2 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b2, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b2[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b2, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b3 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b3, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b3[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b3, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b5 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b5, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b5[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b5, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b6 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b6, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b6[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b6, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b9 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b9, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b9[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b9, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.b12 != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.b12, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_b12[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.b12, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.c != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.c, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_c[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.c, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.d != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.d, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_d[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.d, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (nutrientData.vitaminData.e != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.e, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_e[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.e, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    const {extendedVitaminE} = nutrientData.vitaminData

    if (nutrientData.vitaminData.e !== null && extendedVitaminE !== null && hasExtendedData(extendedVitaminE)
            && dataSettings.includeProvitamins === OPTION_YES) {
        let totalExtensions = getTotalAmountOfExtendedVitaminE(extendedVitaminE)

        if (totalExtensions !== null) {
            if(dataSettings.unitVitamins === UNIT_MICROGRAM) {
                totalExtensions *= 1000
            }

            let reqString = ""
            if (vitRequirementData && userData) {
                const requirementVitaminE = determineDailyRequirement(vitRequirementData.e, userData)
                reqString = `${requirementVitaminE} mg Vit. E ≙`
            }

            let extendedVitaminETable = createTableObject(
                applicationStrings.label_nutrient_vit_e_ext[language],
                totalExtensions,
                portion,
                unit,
                reqString
            )

            if (extendedVitaminE.tocopherolBeta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EQ_FACTOR_TOCOPHEROL_BETA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolBeta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocopherolBeta, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (extendedVitaminE.tocopherolGamma !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EQ_FACTOR_TOCOPHEROL_GAMMA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolGamma[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocopherolGamma, dataSettings),
                    portion,
                    unit,
                    reqString)
            }

            if (extendedVitaminE.tocopherolDelta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EQ_FACTOR_TOCOPHEROL_DELTA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocopherolDelta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocopherolDelta, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolAlpha !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EC_FACTOR_TOCOTRIENOL_ALPHA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolAlpha[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocotrienolAlpha, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolBeta !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EC_FACTOR_TOCOTRIENOL_BETA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolBeta[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocotrienolBeta, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            if (extendedVitaminE.tocotrienolGamma !== null) {
                let reqString = ""
                if (vitRequirementData?.e && userData) {
                    const equivalentVitE = calculateProvitaminEquivalent(
                        vitRequirementData.e,
                        EC_FACTOR_TOCOTRIENOL_GAMMA,
                        userData,
                        dataSettings
                    )
                    reqString = `... ${applicationStrings.label_prefix_hereof[language]} ${equivalentVitE} ${unit}`
                }
                const label = ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_vit_e_ext_tocotrienolGamma[language]}`
                extendedVitaminETable = appendTableDataObject(
                    extendedVitaminETable,
                    language,
                    label,
                    getVitaminOrMineralAmount(extendedVitaminE.tocotrienolGamma, dataSettings),
                    portion,
                    unit,
                    reqString
                )
            }

            tableData.push(extendedVitaminETable)
        }
    }

    if (nutrientData.vitaminData.k != null) {
        const requirement = makeDietaryRequirementString(vitRequirementData.k, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_vit_k[language],
                getVitaminOrMineralAmount(nutrientData.vitaminData.k, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    return tableData;
}


export function createMineralTable(params: TableCalculationParams): Array<FoodTableDataObject> {
    let tableData: Array<FoodTableDataObject> = [];
    const {selectedFoodItem, portion, language, dietaryRequirement, userData, dataSettings} = params
    const minRequirementData = dietaryRequirement?.mineralRequirementData

    if(!minRequirementData || !userData) {
        throw new Error("Mineral Requirement Data or User Data is not available")
    }

    const unit = params.dataSettings.unitVitamins === UNIT_MILLIGRAM ? "mg" : "µg"

    const firstNutrientData = getNutrientData(selectedFoodItem);

    if (firstNutrientData.mineralData.calcium != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.calcium, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_calcium[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.calcium, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.iron != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.iron, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_iron[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.iron, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.magnesium != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.magnesium, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_magnesium[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.magnesium, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.phosphorus != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.phosphorus, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_phosphorus[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.phosphorus, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.potassium != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.potassium, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_potassium[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.potassium, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.sodium != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.sodium, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_sodium[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.sodium, dataSettings),
                portion, unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.zinc != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.zinc, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_zinc[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.zinc, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.copper != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.copper, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_copper[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.copper, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.manganese != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.manganese, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_manganese[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.manganese, dataSettings),
                portion,
                unit,
                requirement
            )
        );
    }

    if (firstNutrientData.mineralData.selenium != null) {
        const requirement = makeDietaryRequirementString(minRequirementData.selenium, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_min_selenium[language],
                getVitaminOrMineralAmount(firstNutrientData.mineralData.selenium, dataSettings),
                portion,
                unit,
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
                ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega3[language]}`,
                firstNutrientData.lipidData.omegaData.omega3,
                portion, "g")
            );
        }

        if (firstNutrientData.lipidData.omegaData.omega6 != null) {
            tableData.push(createTableObject(
                ` ... ${applicationStrings.label_prefix_hereof[language]} ${applicationStrings.label_nutrient_lipids_omega6[language]}`,
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
    const {selectedFoodItem, portion} = params

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
    const {selectedFoodItem, portion, language, dietaryRequirement, userData, dataSettings} = params
    const protRequirementData = dietaryRequirement?.proteinRequirementData ?? null

    const unit = params.dataSettings.unitProteins === UNIT_MILLIGRAM ? "mg" : "g"

    const proteinData = getNutrientData(selectedFoodItem).proteinData;
    if (!proteinData) {
        return tableData;
    }

    if(!protRequirementData || !userData) {
        throw new Error("Protein Requirement Data or User Data is not available")
    }

    if (proteinData.tryptophan != null) {
        const requirement = calculateProteinRequirement(protRequirementData.tryptophan, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_tryptophan[language],
                getProteinAmount(proteinData.tryptophan, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.threonine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.threonine, userData, dataSettings)
        tableData.push(
                createTableObject(
                applicationStrings.label_nutrient_proteins_threonine[language],
                getProteinAmount(proteinData.threonine, dataSettings),
                portion,
                    unit,
                    protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.isoleucine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.isoleucine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_isoleucine[language],
                getProteinAmount(proteinData.isoleucine, dataSettings),
                portion, unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.leucine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.leucine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_leucine[language],
                getProteinAmount(proteinData.leucine, dataSettings),
                portion, unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.lysine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.lysine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_lysine[language],
                getProteinAmount(proteinData.lysine, dataSettings),
                portion, unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.methionine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.methionine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_methionine[language],
                getProteinAmount(proteinData.methionine, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.cystine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.cystine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_cystine[language],
                getProteinAmount(proteinData.cystine, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.phenylalanine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.phenylalanine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_phenylalanine[language],
                getProteinAmount(proteinData.phenylalanine, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.tyrosine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_tyrosine[language],
                getProteinAmount(proteinData.tyrosine, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.valine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.valine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_valine[language],
                getProteinAmount(proteinData.valine, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.arginine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_arginine[language],
                getProteinAmount(proteinData.arginine, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.histidine != null) {
        const requirement = calculateProteinRequirement(protRequirementData.histidine, userData, dataSettings)
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_histidine[language],
                getProteinAmount(proteinData.histidine, dataSettings),
                portion,
                unit,
                protRequirementData ? `${requirement} ${unit}` : ""
            )
        );
    }

    if (proteinData.alanine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_alanine[language],
                getProteinAmount(proteinData.alanine, dataSettings),
                portion, unit,
                ""
            )
        );
    }

    if (proteinData.asparticAcid != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_asparticAcid[language],
                getProteinAmount(proteinData.asparticAcid, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.glutamicAcid != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_glutamicAcid[language],
                getProteinAmount(proteinData.glutamicAcid, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.glycine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_glysine[language],
                getProteinAmount(proteinData.glycine, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.proline != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_proline[language],
                getProteinAmount(proteinData.proline, dataSettings),
                portion,
                unit,
                ""
            )
        );
    }

    if (proteinData.serine != null) {
        tableData.push(
            createTableObject(
                applicationStrings.label_nutrient_proteins_serine[language],
                getProteinAmount(proteinData.serine, dataSettings),
                portion,
                unit,
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

    // NOTE: Sometimes the sugar or dietary fibers value is above the carbs value, which is impossible (> 100 %)
    if(sugar && (sugar > carbohydrates)) {
        sugar = carbohydrates
    }
    if(dietaryFibers && (dietaryFibers > carbohydrates)) {
        dietaryFibers = carbohydrates
    }
    if(sugar && dietaryFibers && (sugar + dietaryFibers > carbohydrates)) {  // Special case, where sug + fibers are above the 100 %
        sugar = (sugar / (sugar+dietaryFibers)) * carbohydrates
        dietaryFibers = (dietaryFibers / (sugar+dietaryFibers)) * carbohydrates
    }

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

function getVitaminOrMineralAmount(amountInMg: number, dataSettings: DataSettings) {
    return dataSettings.unitVitamins === UNIT_MILLIGRAM ? amountInMg : amountInMg * 1000;
}

function getProteinAmount(amountInGram: number, dataSettings: DataSettings) {
    return dataSettings.unitProteins === UNIT_GRAM ? amountInGram : amountInGram * 1000;
}

function makeDietaryRequirementString(requirementData: RequirementData, userData: UserData, dataSettings: DataSettings): string {
    let requirement = determineDailyRequirement(requirementData, userData)
    const unit = dataSettings.unitVitamins === UNIT_MILLIGRAM ? "mg" : "µg";
    if(dataSettings.unitVitamins === UNIT_MICROGRAM) {
        requirement *= 1000
    }

    return `${requirement} ${unit}`
}

function calculateProteinRequirement(requirementMg: number, userData: UserData | undefined, dataSettings: DataSettings) {
    if(userData === undefined) {
        return 0
    }
    const requirement = (requirementMg * userData.weight)
    return dataSettings.unitProteins === UNIT_MILLIGRAM ? requirement : autoRound(requirement / 1000)
}

function calculateProvitaminEquivalent(referenceVitaminRequriemtnAmount: RequirementData, equivalenceFactor: number,
                                       userData: UserData, dataSettings: DataSettings): number {
    const requirementVitaminA = determineDailyRequirement(referenceVitaminRequriemtnAmount, userData)
    let equivalentVitA = autoRound(requirementVitaminA / equivalenceFactor)
    if(dataSettings.unitVitamins === UNIT_MICROGRAM) {
        equivalentVitA *= 1000;
    }
    return equivalentVitA
}