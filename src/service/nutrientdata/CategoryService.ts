import ReactSelectOption from "../../types/ReactSelectOption";
import NameType from "../../types/nutrientdata/NameType";
import {getReactSelectOptionsList} from "./NameTypeService";

export function getCategorySelectList(categories: Array<NameType>, language: string): Array<ReactSelectOption> {
    return getReactSelectOptionsList(categories, language)
}

