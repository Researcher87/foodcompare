import ReactGA from "react-ga4";

export function callEvent(debugMode, action: string, category: string, label?: string, value?: number) {
    if(debugMode) {
        console.log(`[Event Call] ${action} | ${category} | label=${label}, value=${value}`)
    } else {
        // ReactGA.event({
        //     action: action,
        //     category: category,
        //     label: label,
        //     value: value
        // })
    }
}