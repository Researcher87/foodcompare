import NameType from '../types/nutrientdata/NameType'
import Source from '../types/nutrientdata/Source'
import FoodItem from '../types/nutrientdata/FoodItem'
import DietaryRequirement from '../types/nutrientdata/DietaryRequirement'

import nutrientData from "../static/data/nutrientdata_foodcompare.json";

import FoodDataCorpus from "../types/nutrientdata/FoodDataCorpus"
import FoodClass from "../types/nutrientdata/FoodClass";
import {decompressNutrientData} from "./NutrientDataDecompressor";

const nutrientDataDecompressed = decompressNutrientData(nutrientData)

export function loadFoodDataCorpus(): FoodDataCorpus {
	const categories = loadCategories()
	const conditions = loadConditions()
	const portionTypes = loadPortionTypes()
	const sources = loadSources()
	const foodNames = loadFoodNames()
	const foodClasses = loadFoodClasses()
	const foodItems = loadFoodItems()
	const dietaryRequirements = loadDietaryRequirements()

	return {
		categories: categories,
		conditions: conditions,
		portionTypes: portionTypes,
		sources: sources,
		foodNames: foodNames,
		foodClasses: foodClasses,
		foodItems: foodItems,
		dietaryRequirements: dietaryRequirements
	}
}

export function loadConditions(): Array<NameType> {
	return nutrientDataDecompressed.conditions;
}

export function loadPortionTypes(): Array<NameType> {
	return nutrientDataDecompressed.portionTypes;
}

export function loadFoodNames(): Array<NameType> {
	return nutrientDataDecompressed.foodNames;
}

export function loadSources(): Array<Source> {
	return nutrientDataDecompressed.sources;
}

export function loadCategories(): Array<NameType> {
	return nutrientDataDecompressed.categories;
}

export function loadFoodClasses(): Array<FoodClass> {
	return nutrientDataDecompressed.foodClasses;
}

export function loadFoodItems(): Array<FoodItem> {
	return nutrientDataDecompressed.foodItems;
}

export function loadDietaryRequirements(): DietaryRequirement {
	return nutrientDataDecompressed.dietaryRequirements;
}