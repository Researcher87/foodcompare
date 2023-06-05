import {JuxtapositionChartProps} from "../../types/livedata/ChartPropsData";
import FoodDataCorpus from "../../types/nutrientdata/FoodDataCorpus";
import {ChartItem, getElementsOfRankingGroup, getValueOfFoodItem, sortChartItems} from "../RankingService";
import {
    COMPARISON_REFERENCE_ALL,
    COMPARISON_REFERENCE_ALL_IN_CATEGORY,
    COMPARISON_REFERENCE_SELECTED_TABS,
    LANGUAGE_DE
} from "../../config/Constants";
import FoodItem from "../../types/nutrientdata/FoodItem";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {getUnit} from "../calculation/NutrientCalculationService";
import {JuxtapositionTableEntry} from "../../types/livedata/JuxtapositionTableEntry";
import {autoRound} from "../calculation/MathService";

export interface JuxtapostionChartData {
    chartItems: Array<ChartItem>
    nutrientName: string
    unit: string
}

/**
 * Creates the chart data for a set of nutrient data. The set comprises the chart data for exactly one
 * group, such as base data, vitamins, lipids etc.
 * @param props The juxtaposition chart props containing settings information for chart data creation.
 * @param foodDataCorpus An instance of the Food Compare food data corpus.
 * @param referenceData The reference data to use.
 * @param language The currently set language.
 * @return A list of juxtaposition chart data objects that are used to create the different juxtaposition charts
 * for each nutrient in the selected group.
 */
export function createChartDataForJuxtapostionChart(props: JuxtapositionChartProps, foodDataCorpus: FoodDataCorpus,
                                                    referenceData: Array<FoodItem>, language: string): Promise<Array<JuxtapostionChartData>> {
    return new Promise((resolve, reject) => {
        const chartData: Array<JuxtapostionChartData> = []
        const valuesInGroup = getElementsOfRankingGroup(props.selectedGroup, language)

        if (!valuesInGroup) {
            reject(new Error("No group values available"))
            return
        }

        valuesInGroup.forEach(valueInGroup => {
            let chartItems: Array<ChartItem> = []
            const nutrientName = valueInGroup.label
            const unit = getUnit(valueInGroup.value)
            referenceData.forEach(foodItem => {
                const value = getValueOfFoodItem(foodItem, valueInGroup.value)
                const nameKey = foodDataCorpus.foodNames.find(foodName => foodName.id === foodItem.nameId)
                const name = language === LANGUAGE_DE ? nameKey?.germanName : nameKey?.englishName
                const fooditemCondition = props.selectedFoodItem.foodItem.conditionId
                const condition = foodDataCorpus.conditions.find(condition => condition.id === fooditemCondition)
                const conditionName = condition !== undefined && condition.id !== 100
                    ? language === LANGUAGE_DE
                        ? condition.germanName
                        : condition.englishName
                    : null
                const fullName = conditionName !== null ? `${name} (${conditionName})` : name
                if (value !== null && value !== undefined) {
                    chartItems.push({
                        name: fullName ?? '',
                        value: value,
                        id: foodItem.id
                    })
                }
            })

            chartItems = sortChartItems(chartItems)
            const atLeastOneValueAboveZero = Math.max(...chartItems.map(item => item.value)) > 0

            if(atLeastOneValueAboveZero) {
                chartData.push({
                    nutrientName: nutrientName,
                    unit: unit,
                    chartItems: chartItems
                })
            }
        })

        resolve(chartData);
    })
}

/**
 * Creates the table data for a set of nutrient data. The set comprises the chart data for exactly one
 * group, such as base data, vitamins, lipids etc.
 * @param props The juxtaposition chart props containing settings information for chart data creation.
 * @param foodDataCorpus An instance of the Food Compare food data corpus.
 * @param referenceData The reference data to use.
 * @param language The currently set language.
 * @return The data table object ready for the table to display (a list of JuxtapositionTableEntry objects, each
 * object representing one row in the table).
 */
export function createJuxtapositionTableData(props: JuxtapositionChartProps, foodDataCorpus: FoodDataCorpus,
                                             referenceData: Array<FoodItem>, language: string): Array<JuxtapositionTableEntry> {
    const tableData: Array<JuxtapositionTableEntry> = []
    const valuesInGroup = getElementsOfRankingGroup(props.selectedGroup, language)

    if (!valuesInGroup) {
        throw new Error("No group values available")
    }

    valuesInGroup.forEach(valueInGroup => {
        const value = getValueOfFoodItem(props.selectedFoodItem.foodItem, valueInGroup.value)
        const allValues: Array<number> = []
        referenceData.forEach(foodItem => {
            const value = getValueOfFoodItem(foodItem, valueInGroup.value)
            if(value !== null) {
                allValues.push(value)
            }
        })

        // Do not show nutrient elements, if the selected food item does not have this value.
        if(allValues.length === 0 || value === null) {
            return
        }

        const minValue = Math.min(...allValues)
        const maxValue = Math.max(...allValues)
        const averageValue = allValues.reduce((a,b) => a + b, 0) / allValues.length

        const sorted = allValues.sort((a, b) => b-a)
        const centerValue = sorted.length / 2
        const medianValue = allValues[Math.floor(centerValue)]

        const rank = sorted.findIndex(num => num === value)

        const label = valueInGroup.label
        const unit = getUnit(valueInGroup.value)

        const tableRow: JuxtapositionTableEntry = {
            label: label,
            value: `${value} ${unit}`,
            rank: `${rank} / ${allValues.length}`,
            min: `${minValue} ${unit}`,
            max: `${maxValue} ${unit}`,
            average: `${autoRound(averageValue)} ${unit}`,
            median: `${medianValue} ${unit}`,
        }

        tableData.push(tableRow)
    })

    return tableData
}

/**
 * Returns a set of food items that serve as database for the juxtaposition chart (comparison base).
 * @param selectedReference The selected reference value, indicating which data reference should be used.
 * @param foodDataCorpus The food data corpus of Food Compare.
 * @param selectedFoodItem The selected food item in the data panel.
 * @param selectedFoodItemsInPanel All food items currently added to the data panel.
 * @return A list of food items that serve as data basis for the juxtaposition charts.
 */
export function getFoodItemsForComparison(selectedReference: number,
                                          foodDataCorpus: FoodDataCorpus,
                                          selectedFoodItem: SelectedFoodItem,
                                          selectedFoodItemsInPanel: Array<SelectedFoodItem>): Array<FoodItem> {
    const allFoodItems = foodDataCorpus.foodItems

    switch (selectedReference) {
        case COMPARISON_REFERENCE_ALL_IN_CATEGORY:
            const selectedFoodClass = foodDataCorpus.foodClasses.find(
                foodClass => foodClass.id === selectedFoodItem.foodItem.foodClass
            )
            if(selectedFoodClass === undefined) {
                return allFoodItems
            }
            const category = selectedFoodClass.category
            return foodDataCorpus.foodItems.filter(foodItem => {
                const foodClass = foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem.foodClass)
                return foodClass !== undefined ? foodClass.category === category : false
            })
        case COMPARISON_REFERENCE_SELECTED_TABS:
            return selectedFoodItemsInPanel.map(selectedFoodItem => selectedFoodItem.foodItem)
        case COMPARISON_REFERENCE_ALL:
        default:
            return allFoodItems
    }
}
