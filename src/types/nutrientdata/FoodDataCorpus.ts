import NameType from './NameType'
import Source from './Source'
import FoodItem from './FoodItem'
import DietaryRequirement from './DietaryRequirement'
import FoodClass from "./FoodClass";

export default interface FoodDataCorpus {
	categories: Array<NameType>
	conditions: Array<NameType>
	portionTypes: Array<NameType>
	sources: Array<Source>
	foodNames: Array<NameType>
	foodClasses: Array<FoodClass>
	foodItems: Array<FoodItem>
	dietaryRequirements: DietaryRequirement | null
}