import NameType from "../../types/nutrientdata/NameType";
import ReactSelectOption from "../../types/ReactSelectOption";
import getName from "../LanguageService";

export function getReactSelectOptionsList(nameTypeList: Array<NameType>, language: string, sort?: boolean): Array<ReactSelectOption> {
    const names: Array<string> = []

    if(nameTypeList && nameTypeList.length > 0) {
        nameTypeList.forEach(nameType => names.push(getName(nameType, language)))
    }

    if(sort) {
        names.sort()
    }

    const reactSelectOptions: Array<ReactSelectOption> = []
    names.forEach((name, index) => {
        reactSelectOptions.push({
            value: index,
            label: name
        })
    })

    return reactSelectOptions
}


export function getNameFromFoodNameList(foodNameList: Array<NameType>, id: number, language: string, verbose = false): string | null {
    const nameType = foodNameList.find(nameType => nameType.id === id)

    if(nameType) {
        return getName(nameType, language, verbose)
    } else {
        console.error('Could not resolve name for food with name id = ', id)
        return null
    }
}

/*
 * General method to shorten the name of long food name.
 * name: The food name, e.g. "Linen oil (at least 60 % lineul acid)"
 * maxLength: The maximum length of the food name.
 */
export function shortenName(name, maxLength) {
    if(name.length <= maxLength) {
        return name;
    }

    if(name.includes("(")) {
        const indexOfBrace = name.indexOf("(");
        if(indexOfBrace >= maxLength-6) {
            return name.substring(0, indexOfBrace-1).trim() + "...";
        }
    }

    return name.substring(0, maxLength-3).trim() + "...";
}