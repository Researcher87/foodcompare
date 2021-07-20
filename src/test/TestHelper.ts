import {
    BaseData,
    CarbohydrateData,
    LipidData,
    MineralData, OmegaData,
    ProteinData,
    VitaminData
} from "../types/nutrientdata/FoodItem";
import Source from "../types/nutrientdata/Source";

export function makeDefaultBaseData(): BaseData {
    return {
        water: 50,
        lipids: 10,
        carbohydrates: 15,
        proteins: 15,
        ash: 10,
        energy: 67.5,
        dietaryFibers: 16,
        alcohol: 0
    }
}


export function makeDefaultVitaminData(): VitaminData {
    return {
        a: 5,
        b1: 2,
        b2: 20,
        b3: 1,
        b5: 0.5,
        b6: null,
        b7: 0,
        b9: null,
        b12: null,
        c: 50,
        d: 0.002,
        e: null,
        k: 0
    }

}

export function makeDefaultMineralData(): MineralData {
    return {
        calcium: 15,
        iron: 12,
        magnesium: 60,
        phosphorus: 0.001,
        potassium: 23,
        sodium: 0,
        zinc: 0.008,
        selenium: null,
        manganese: null,
        copper: 0.0002
    }
}

export function makeDefaultProteinData(): ProteinData {
    return {
        tryptophan: 0.001,
        threonine: 0.045,
        isoleucine: 0.001,
        leucine: null,
        lysine: null,
        methionine: 54,
        cystine: 0.003,
        phenylalanine: 0.12,
        tyrosine: 12.5,
        valine: null,
        arginine: null,
        histidine: 12,
        alanine: 14,
        asparticAcid: null,
        glutamicAcid: null,
        glycine: 45,
        proline: 0.67,
        serine: null
    }
}

export function makeDefaultCarbsData(): CarbohydrateData {
    return {
        sugar: 14,
        sucrose: 2.5,
        glucose: 0.001,
        lactose: 0,
        fructose: 5.7,
        galactose: 0.09,
        maltose: 1.2,
        starch: null
    }
}

export function makeDefaultLipidsData(withOmegaData: boolean): LipidData {
    let lipidData: LipidData = {
        unsaturatedMono: 12,
        unsaturatedPoly: 24,
        transFattyAcids: 0.6,
        cholesterol: 1.45,
        saturated: 6.78,
        omegaData: null
    }

    if(withOmegaData) {
        lipidData = {...lipidData, omegaData: makeDefaultOmegaData()}
    }

    return lipidData
}

export function makeDefaultOmegaData(): OmegaData {
    return {
        omega3: 1.3,
        omega6: 4.5,
        uncertain: 1.6,
        uncertainRatio: 0.7972
    }
}



export function makeDefaultSource(): Source {
    return {
        id: 0,
        name: "abc",
        url: "http://abc.de"
    }
}