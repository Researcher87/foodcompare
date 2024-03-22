import {RankingPanelData} from "../../types/livedata/ApplicationData";
import {getCategorySelectList} from "../nutrientdata/CategoryService";
import FoodDataCorpus from "../../types/nutrientdata/FoodDataCorpus";
import {getElementsOfRankingGroup, getNutrientGroups} from "../RankingService";
import {prepareUriForParsing} from "./BaseUriService";

export function makeRankingPanelDataUri(rankingPanelData: RankingPanelData) {
    const selectedCategory = rankingPanelData.selectedFoodCategory?.value
    const selectedGroup = rankingPanelData.selectedGroup?.value
    const selectedElement = rankingPanelData.selectedElement?.value

    const use100gram = rankingPanelData.use100gram ? "1" : "0"
    const showDailyRequirements = rankingPanelData.showDietaryRequirements ? "1" : "0"

    return `${selectedCategory};${selectedGroup};${selectedElement};${use100gram}${showDailyRequirements}`
}

export function parseRankingPanelDataUri(uri: string, foodDataCorpus: FoodDataCorpus, language: string): RankingPanelData | null {
    const fragments = prepareUriForParsing(uri).split(";")
    if(fragments.length !== 4) {
        return null
    }

    if(fragments[3].length !== 2) {
        return null
    }

    const selectedCategory = parseInt(fragments[0])
    const selectedGroup = parseInt(fragments[1])
    const selectedElement = fragments[2]

    const foodCategories = getCategorySelectList(foodDataCorpus.categories, language)
    const groups = getNutrientGroups(language)
    const elements = getElementsOfRankingGroup(selectedGroup, language)

    const selectedFoodCategoryOption = foodCategories.find(foodCategory => foodCategory.value === selectedCategory)
    const selectedGroupOption = groups.find(group => group.value === selectedGroup)
    const selectedElementOption: any = elements ? elements.find(element => element.value === selectedElement) : null

    const use100g = fragments[3].substring(0, 1) !== "0"
    const showDietaryRequirements = fragments[3].substring(1, 2) !== "0"

    if(selectedFoodCategoryOption && selectedGroupOption && selectedElementOption) {
        return {
            selectedFoodCategory: selectedFoodCategoryOption,
            selectedGroup: selectedGroupOption,
            selectedElement: selectedElementOption,
            use100gram: use100g,
            showDietaryRequirements: showDietaryRequirements
        }
    } else {
        return null
    }
}