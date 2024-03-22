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

export function prepareUriForParsing(uri: string): string {
    // Some websites like youtube transform the semicolons in the URL to %3B, which later need to be translated back to semicolons
    if (uri.includes("/%3B")) {
        return uri.replace(/%3B/g, ";")
    }

    // Some websites transform the semicolon to an ampersand
    if (uri.includes("&")) {
        return uri.replace(/&/g, ";")
    }

    return uri
}