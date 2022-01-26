const fontsize = "1.75vh"
const selectHeight = "3.75vh"

export const customSelectStyles = {
    control: base => ({
        ...base,
        height: selectHeight,
        minHeight: selectHeight,
        fontSize: fontsize
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: selectHeight,
        minHeight: selectHeight,
        padding: '0 2px'
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


export const correspondingSelectElementStyle = {
    height: selectHeight,
    fontSize: fontsize
}