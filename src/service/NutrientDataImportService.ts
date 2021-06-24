import NameType from '../types/nutrientdata/NameType'
import Source from '../types/nutrientdata/Source'
import FoodItem from '../types/nutrientdata/FoodItem'
import DietaryRequirement from '../types/nutrientdata/DietaryRequirement'

import nutrientdata from "./../static/data/nutrientdata_foodcompare.json";
import FoodDataCorpus from "../types/nutrientdata/FoodDataCorpus"
import FoodClass from "../types/nutrientdata/FoodClass";

export function loadFoodDataCorpus(): FoodDataCorpus {
	const categories = loadCategories()
	const conditions = loadConditions()
	const portionTypes = loadPortionTypes()
	const sources = loadSources()
	const foodNames = loadFoodNames()
	const foodClasses = loadFoodClasses()
	const nutrientData = loadNutrientData()
	const dietaryRequirements = loadDietaryRequirements()
	
	return {
		categories: categories,
		conditions: conditions,
		portionTypes: portionTypes,
		sources: sources,
		foodNames: foodNames,
		foodClasses: foodClasses,
		foodItems: nutrientData,
		dietaryRequirements: dietaryRequirements
	}
}

export function loadConditions(): Array<NameType> {
	return nutrientdata.conditions;
}

export function loadPortionTypes(): Array<NameType> {
	return nutrientdata.portionTypes;
}

export function loadFoodNames(): Array<NameType> {
	return nutrientdata.foodNames;
}

export function loadSources(): Array<Source> {
	return nutrientdata.sources;
}

export function loadCategories(): Array<NameType> {
	return nutrientdata.categories;
}

export function loadFoodClasses(): Array<FoodClass> {
	return nutrientdata.foodClasses;
}

export function loadNutrientData(): Array<FoodItem> {
	return nutrientdata.foodItems;
}

export function loadDietaryRequirements(): DietaryRequirement {
	return nutrientdata.dietaryRequirements;
}