import NameType from "../types/nutrientdata/NameType";

export default function getName(nameType: NameType, language: string): string {
    if(language === 'de') {
        return nameType.germanName
    } else {
        return nameType.englishName
    }
}


