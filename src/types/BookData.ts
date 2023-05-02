export interface NamePair {
    de: string,
    en: string
}

export interface BookDataEntry {
    name: NamePair,
    scientificName?: NamePair | undefined,
    description: NamePair,
    functionality: NamePair[],
    deficiencies: NamePair[],
    overdose: NamePair,
    dependencies: NamePair,
    sources: NamePair
    requirements: NamePair
}