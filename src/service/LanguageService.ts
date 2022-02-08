import NameType from "../types/nutrientdata/NameType";

/**
 * Retrieves the name of a name type object in the given language
 * @param nameType The name type object
 * @param language The given language
 * @param verbose Optionally set this value to true to obtain the full name (including auxiliary information set in brackets)
 */
export default function getName(nameType: NameType, language: string, verbose = false): string {
    const name = language === 'de' ?  nameType.germanName : nameType.englishName
    if(!verbose) {
        return removeAuxiliaryInformationFromFoodName(name)
    } else {
        return name
    }
}

/**
 * Strips of auxiliary information of the food item, which is set in brackets and may not be intended to display
 * @param name The full food name as set in the nutrient json file.
 */
export function removeAuxiliaryInformationFromFoodName(name: string): string {
    if(name.includes("[")) {
        const index = name.indexOf("[")
        return name.substring(0, index).trim()
    } else {
        return name
    }
}

