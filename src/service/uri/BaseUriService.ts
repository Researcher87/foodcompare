export function parseFoodCompareUri(): string | null {
    const queryString = window.location.search.substring(1)

    const equalOperator = queryString.indexOf("=")
    if(equalOperator === -1) {
        return null
    }
    const key = queryString.substring(0, equalOperator)
    const value = queryString.substring(equalOperator + 1)

    if(key === "mode") {
        return value
    }

    return null
}