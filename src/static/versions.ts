export const versions = [
    {
        id: "1.0",
        date: "06-24-2021",
        subject: "Initial release for basic food data analysis and tab-based food comparison.",
    },
    {
        id: "1.0.1",
        date: "06-27-2021",
        subject: "Organizational enhancement, minor style adaptions and bug fixes.",
        updates: [
            "Website Header was made slimmer to allow more space for the data panel on smaller (or slimmer) screens.",
            "Added introduction text for empty data panel.",
            "Added React Snap for Pre-Rendering (SEO).",
            "Added Google Analytics and Google Adsense Configuration."
        ],
        bugfixes: [
            "Solved problem with tool tips on icons not showing after website was first rendered (or menu was changed)."
        ]
    },
    {
        id: "1.0.2",
        date: "01-07-2021",
        subject: "Further style adaptions and bug fixes",
        updates: [
            "Changed Google Analytics to G4 standard."
        ],
        bugfixes: [
            "Solved some typescript errors (null check for chart data)."
        ]
    }
]