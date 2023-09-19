import FoodItem, {PortionData} from "../nutrientdata/FoodItem";
import FoodClass from "../nutrientdata/FoodClass";

export default interface SelectedFoodItem {
    foodItem: FoodItem
    foodClass?: FoodClass
    portion: PortionData
    tab?: string
    component?: JSX.Element
    id?: number
    compositeSubElements?: Array<SelectedFoodItem>
    resolvedName?: string | null
    selectedSource: number
    supplementData: boolean
    combineData: boolean
	aggregated?: boolean
    title?: string
}