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
            "Solved problem with tool tips on icons not showing after website was first rendered (or menu was changed).",
        ]
    },
    {
        id: "1.0.2",
        date: "02-07-2021",
        subject: "Further style adaptions and bug fixes",
        updates: [
            "The food data panel has a unique height for all data menus now.",
            "Changed Google Analytics to G4 standard.",
            "Changed table data layout.",
            "Extended the food name displayed in the data panel (now also displays condition and portion amount).",
            "Solved other minor styling issues.",
            "German language is detected and set automatically now.",
            "Food tab names also change now when the language is changed."
        ],
        bugfixes: [
            "Solved some typescript errors (null check for chart data).",
            "Wrong condition names on the information page and in the food list selector have been corrected.",
            "If no detailed carb data is available, no chart will be generated instead of a 100 % remainder chart."
        ]
    },
    {
        id: "1.1",
        date: "07-07-2021",
        subject: "Home menu and aggregated food data.",
        features: [
            "Home menu was added to website.",
            "Mobile app menu was added to website.",
            "Major Feature: Composite food list: Users can now combine different food elements to so-called composite food lists to show aggregated nutrient data.",
            "The configuration of the charts in the food data panel is now temporarily saved so that they won't have to be set anew after a tab or menu was changed."
        ],
        updates: [
            "React router was added to the application.",
            "Text sizes and layouts have been slightly adapted to different screen sizes.",
            "The energy chart now also displays the BMR and energy expenditure annotations."
        ],
        bugfixes: [
            "Different style issues were solved.",
            "The info page shows the correct portion type now.",
            "The display error related to the 'expand to 100 %' checkbox was solved. The application checks whether the maximum value in the display is below 100 per cent.",
            "The bug that the food selector icon sometimes had to be clicked twice until the modal opens was resolved."
        ]
    },
    {
        id: "1.2",
        date: "07-17-2021",
        subject: "Direct comparison of food elements",
        features: [
            "Major Feature: Foods can now be directly compared with each other in the direct compare panel.",
            ],
        updates: [
            "Portion size validation check was added to the aggregated food list selector.",
            "Domain configuration was completed on Github (frameset redirect was abolished).",
            "Forms and link buttons and some texts adapt to smaller screen sizes now.",
            "The Home menu was extended."
        ],
        bugfixes: [
            "A couple of display and chart configuration bugs have been solved."
        ]
    }
]