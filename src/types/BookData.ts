export interface NamePair {
    de: string,
    en: string
}

export interface BookDataEntry {
    name: NamePair,
    scientificName?: NamePair,
    description: NamePair,
    functionality: NamePair[],
    deficiencies: NamePair[],
    overdose?: NamePair,
    dependencies?: NamePair,
    storage?: NamePair,
    sources?: NamePair
    requirements: NamePair
}