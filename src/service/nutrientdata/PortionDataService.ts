import NameType from "../../types/nutrientdata/NameType";
import {ReactSelectPortionOption} from "../../types/ReactSelectOption";
import FoodItem, {PortionData} from "../../types/nutrientdata/FoodItem";
import getName from "../LanguageService";
import {applicationStrings} from "../../static/labels";
import {PORTION_KEY_100, PORTION_KEY_INDIVIDUAL} from "../../config/Constants";


export function getPortionReactSelectList(portionData: Array<PortionData>, portionTypes: Array<NameType>, language: string): Array<ReactSelectPortionOption> {
    const reactSelectOptions: Array<ReactSelectPortionOption> = []
    portionData.forEach(portionElement => {
        const portionTypeIndex = portionTypes.findIndex(portionType => {
             return portionType.id === portionElement.portionType
        })

        const portionType = portionTypes[portionTypeIndex]
        const portionName = getName(portionType, language)
        reactSelectOptions.push({
            value: portionElement,
            label: portionName
        })
    })

    reactSelectOptions.push({
        value: {amount: 100, portionType: PORTION_KEY_100},
        label: applicationStrings.portion_100g[language]
    })

    reactSelectOptions.push({
        value: {amount: 0, portionType: PORTION_KEY_INDIVIDUAL},
        label: applicationStrings.portion_individual[language]
    })

    return reactSelectOptions
}


export function getDefaultPortionData(foodItem: FoodItem, portionDataList: Array<ReactSelectPortionOption>): ReactSelectPortionOption {
    let defaultPortionIndex = portionDataList.findIndex(portionData => {
        return portionData.value.portionType === foodItem.defaultPortionId
    })

    if (defaultPortionIndex < 0 || defaultPortionIndex >= portionDataList.length) {
        defaultPortionIndex = 0;
    }

    return portionDataList[defaultPortionIndex]
}