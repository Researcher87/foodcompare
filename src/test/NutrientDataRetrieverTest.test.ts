import {combineNutrientData, supplementNutrientData} from "../service/nutrientdata/NutrientDataRetriever";
import {
    makeDefaultBaseData,
    makeDefaultCarbsData,
    makeDefaultLipidsData,
    makeDefaultMineralData,
    makeDefaultProteinData, makeDefaultSource
} from "./TestHelper";

describe('The nutrient data retriever should calculated missing data or combined data correctly.', () => {

    const nutrientDataObject1 = {
        source: makeDefaultSource(),
        sourceItemId: "123",
        baseData: makeDefaultBaseData(),
        carbohydrateData: makeDefaultCarbsData(),
        lipidData: makeDefaultLipidsData(false),
        proteinData: makeDefaultProteinData(),
        mineralData: makeDefaultMineralData(),
        vitaminData: {
            a: 10,
            b1: 5,
            b2: 0,
            b3: null,
            b5: null,
            b6: null,
            b7: null,
            b9: null,
            b12: null,
            c: 50,
            d: 10,
            e: 20,
            k: null,
            carotenoidData: null
        }
    }

    const nutrientDataObject2 = {
        ...nutrientDataObject1, vitaminData: {
            a: 10,
            b1: 5,
            b2: 5,
            b3: 0.01,
            b5: 7,
            b6: null,
            b7: 15,
            b9: null,
            b12: 0,
            c: null,
            d: 0,
            e: 0,
            k: null,
            carotenoidData: null
        }
    }

    it('should add missing values to nutrient data object', () => {
        const b=1
        const finalObject = supplementNutrientData(nutrientDataObject1, nutrientDataObject2).vitaminData

        expect(finalObject.a).toBe(10)
        expect(finalObject.b2).toBe(0)
        expect(finalObject.b3).toBe(0.01)
        expect(finalObject.b7).toBe(15)
        expect(finalObject.b12).toBe(0)
        expect(finalObject.k).toBe(null)
    })

    it('should combine two nutrient data elements', () => {
        const b=1
        const finalObject = combineNutrientData(nutrientDataObject1, nutrientDataObject2).vitaminData

        expect(finalObject.a).toBe(10)
        expect(finalObject.b1).toBe(5)
        expect(finalObject.b2).toBe(2.5)
        expect(finalObject.b3).toBe(0.01)
        expect(finalObject.b5).toBe(7)
        expect(finalObject.k).toBe(null)
    })

})

export default {}