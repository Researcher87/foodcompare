export interface SelectedFoodItemData {
    data: Array<FoodTableDataObject>
}

export interface FoodTableDataObject {
    label: string
    value_100g: string
    value_portion: string
}