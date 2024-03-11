const fontsize = "calc(0.5rem + 0.3vw)"
const selectHeight = "calc(0.5rem + 0.3vw)*2.2"

export const customSelectStyles = {
    control: base => ({
        ...base,
        height: selectHeight,
        minHeight: selectHeight,
        fontSize: fontsize,
    }),
    valueContainer: (provided) => ({
        ...provided,
        height: selectHeight,
        minHeight: selectHeight,
        padding: '0 2px',
        fontsize: fontsize
    }),
    dropdownIndicator: (styles) => ({
        ...styles,
        paddingTop: "2px",
        paddingBottom: "2px",
    }),
    clearIndicator: (styles) => ({
        ...styles,
        height: selectHeight,
        minHeight: selectHeight,
        paddingTop: "2px",
        paddingBottom: "2px",
    }),
};


export function getCustomSelectStyle(backgroundColor: string): any {
    return {
        ...customSelectStyles,
        control: base => ({
            ...base,
            height: selectHeight,
            minHeight: selectHeight,
            fontSize: fontsize,
            backgroundColor: backgroundColor
        }),
    }
}


export const correspondingSelectElementStyle = {
    height: selectHeight,
    fontSize: fontsize
}

export const COLOR_SELECTOR_CATEGORY = " #fdebd0"
export const COLOR_SELECTOR_FOODCLASS = " #85c1e9"
export const COLOR_SELECTOR_FOODITEM = "#ebf5fb"