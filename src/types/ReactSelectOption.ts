import FoodItem, {PortionData} from "./nutrientdata/FoodItem";
import FoodClass from "./nutrientdata/FoodClass";

export default interface ReactSelectOption {
    label: string
    value: number
}

export interface ReactSelectStringValueOption {
    label: string
    value: string
}

export interface ReactSelectFoodItemOption {
    label: string
    value: FoodItem
}

export interface ReactSelectFoodClassOption {
    label: string
    value: FoodClass
}

export interface ReactSelectPortionOption {
    label: string
    value: PortionData
}

