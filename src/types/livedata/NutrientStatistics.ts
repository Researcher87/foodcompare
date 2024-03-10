/**
 * Container class to store information of a nutrient in the Food Compare database. It contains:
 * Minimum value, maximum value, average and media, as well as a list of all values being sorted ascending.
 */
export default interface NutrientStatistics {
    minimumAmount: number | null,
    maximumAmount: number | null,
    averageAmount: number | null,
    median: number | null,
    allValuesSorted: Array<number>
}

/**
 * Container class to store information about the available data values of a nutrient data object of a food item (number of nutrients
 * in the nutrient data source that have a value).
 */
export interface FoodItemStatistics {
    baseDataValues: number,
    lipidDataValues: number,
    carbDataValues: number,
    proteinDataValues: number,
    vitaminDataValues: number,
    mineralDataValues: number,
    getTotalNumberOfValues: () => number
}
