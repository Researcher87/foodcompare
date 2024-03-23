import foodCompareCompressing from "../static/data/foodCompareCompressing.json";

/**
 * Decompresses the nutrient data json file.
 * @param nutrientDataObj The nutrient data json file as compressed by the USDA parser.
 * @return The nutrient data object generated from the decompressed version of the file.
 */
export function decompressNutrientData(nutrientDataObj: any) {
    const compressedNutrientData = JSON.stringify(nutrientDataObj)
    let decompressedString = compressedNutrientData
    foodCompareCompressing.forEach(entry => {
        const regExp = new RegExp('"' + entry.target + '"', 'g');
        decompressedString = decompressedString.replaceAll(regExp,  "\"" + entry.source + "\"")
    })
    return JSON.parse(decompressedString);
}