import combineFoodItems from "../service/calculation/FoodDataAggregationService";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import FoodItem, { BaseData } from "../types/nutrientdata/FoodItem";
import {
    makeDefaultBaseData,
    makeDefaultCarbsData,
    makeDefaultLipidsData,
    makeDefaultMineralData,
	makeDefaultVitaminData,
    makeDefaultProteinData, makeDefaultSource
} from "./TestHelper";


describe('The composite nutrient data service should calculate the correct amount of data for the same food of different portion sizes.', () => {

	const portion1 = 150
	const portion2 = 250

	const nutrientDataObject1 = {
        source: makeDefaultSource(),
        sourceItemId: "123",
        baseData: makeDefaultBaseData(),
        carbohydrateData: makeDefaultCarbsData(),
        lipidData: makeDefaultLipidsData(false),
        proteinData: makeDefaultProteinData(),
        mineralData: makeDefaultMineralData(),
        vitaminData: makeDefaultVitaminData()
    }

    const nutrientDataObject2 = {
        ...nutrientDataObject1
    }

    it('should calculate the correct amount of data for two identical objects', () => {		
		const foodItem1 = {
			id: 1,
			nutrientDataList: [nutrientDataObject1]
		}
		
		const foodItem2 = {
			id: 2,
			nutrientDataList: [nutrientDataObject2]
		}
		
		const selectedFoodItem1 = makeSelectedFoodItem(foodItem1, portion1)
		const selectedFoodItem2 = makeSelectedFoodItem(foodItem2, portion2)
		
		const selectedFoodItems: Array<SelectedFoodItem> = [selectedFoodItem1, selectedFoodItem2]
        const finalObject = combineFoodItems(selectedFoodItems, 0)

		// Final portion must be the sum of the two aggreaged objects:
		expect(finalObject.portion.amount).toBe(portion1+portion2)
		
		const finalBaseData = finalObject.foodItem.nutrientDataList[0].baseData
		const finalVitaminData = finalObject.foodItem.nutrientDataList[0].vitaminData
		
		const baseData1 = nutrientDataObject1.baseData
		const vitaminData1 = nutrientDataObject1.vitaminData
		
		// Data must be identical between aggregated data and one of the inital data objects:
		expect(finalBaseData.water).toBe(baseData1.water)
		expect(finalBaseData.energy).toBe(baseData1.energy)
		expect(finalBaseData.lipids).toBe(baseData1.lipids)
		
		expect(finalVitaminData.a).toBe(vitaminData1.a)
		expect(finalVitaminData.b1).toBe(vitaminData1.b1)
		expect(finalVitaminData.c).toBe(vitaminData1.c)
    })


	it('should calculate the correct ratio between items of different portion amounts', () => {
		const portion1 = 500
		const portion2 = 300
		
		const baseData1: BaseData = {
			water: 10,
			energy: 10,
			lipids: 10,
			carbohydrates: 10,
			proteins: 10,
			ash: 10,
			dietaryFibers: 10,
			alcohol: 10
		}
		
		const baseData2: BaseData = {
			water: 15,
			energy: 15,
			lipids: 15,
			carbohydrates: 15,
			proteins: 15,
			ash: 15,
			dietaryFibers: 15,
			alcohol: 15
		}
		
		const foodItem1: FoodItem = {
			id: 1,
			nutrientDataList: [{...nutrientDataObject1, baseData: baseData1}]
		}
		
		const foodItem2: FoodItem = {
			id: 2,
			nutrientDataList: [{...nutrientDataObject2, baseData: baseData2}]
		}
		
		const selectedFoodItem1 = makeSelectedFoodItem(foodItem1, portion1)
		const selectedFoodItem2 = makeSelectedFoodItem(foodItem2, portion2)
		
		const selectedFoodItems: Array<SelectedFoodItem> = [selectedFoodItem1, selectedFoodItem2]
        const finalObject = combineFoodItems(selectedFoodItems, 0)		
		const finalBaseData = finalObject.foodItem.nutrientDataList[0].baseData
		
		// Portion: 500 g * 10 g + 300 g * 15 g = 95 g for 800 g --> 95 g / 800 g = 11,875 g pro 100 g
		expect(finalBaseData.water).toBe(11.875)
		
	})

    it('should ignore null values in one of the food items', () => {		
		const vitaminData1 = {
			a: 10,
			b1: 10,
			b2: 10,
			b3: 10,
			b5: 10,
			b6: 10,
			b7: 10,
			b9: 10,
			b12: 10,
			c: 10,
			d: null,
			e: 10,
			k: null
		}
		
		const vitaminData2 = {
			a: 10,
			b1: 10,
			b2: 10,
			b3: 10,
			b5: 10,
			b6: 10,
			b7: 10,
			b9: 10,
			b12: 10,
			c: 10,
			d: 10,
			e: null,
			k: null
		}
	
		const foodItem1: FoodItem = {
			id: 1,
			nutrientDataList: [{...nutrientDataObject1, vitaminData: vitaminData1}]
		}
		
		const foodItem2: FoodItem = {
			id: 2,
			nutrientDataList: [{...nutrientDataObject2, vitaminData: vitaminData2}]
		}
		
		const selectedFoodItem1 = makeSelectedFoodItem(foodItem1, portion1)
		const selectedFoodItem2 = makeSelectedFoodItem(foodItem2, portion2)
		
		const selectedFoodItems: Array<SelectedFoodItem> = [selectedFoodItem1, selectedFoodItem2]
        const finalObject = combineFoodItems(selectedFoodItems, 0)		
		const finalVitaminData = finalObject.foodItem.nutrientDataList[0].vitaminData
		
		expect(finalVitaminData.a).toBe(vitaminData1.a)
		expect(finalVitaminData.d).toBe(null)
		expect(finalVitaminData.e).toBe(null)
		expect(finalVitaminData.k).toBe(null)
    })



	const makeSelectedFoodItem = (foodItem: FoodItem, portionAmount: number): SelectedFoodItem => {
		return {
			foodItem: foodItem,
			portion: {
				portionType: 0,
				amount: portionAmount,
			},
			selectedSource: 0,
    		supplementData: false,
    		combineData: false
		}
	}
	
})