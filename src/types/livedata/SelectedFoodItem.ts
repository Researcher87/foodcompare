import FoodItem, {PortionData} from "../nutrientdata/FoodItem";
import FoodClass from "../nutrientdata/FoodClass";
import NameType from "../nutrientdata/NameType";
import {Component} from "react";

export default interface SelectedFoodItem {
    foodItem: FoodItem
    foodClass: FoodClass
    portion: PortionData
    tab?: string
    component?: JSX.Element
    id?: number
}