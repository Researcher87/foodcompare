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
    },
    {
        id: "1.2.1",
        date: "07-20-2021",
        subject: "Applying two data sources",
        features: [
            "The web site allows to add data from two different USDA sources now. Besides the SR Legacy data set, which has been the default source, also data from FNDDS can be added in future. If data from two different sources is available, the user can decide which source should be used. In the direct food compare panel, data of two sources can also be compared with each other.",
            "For the first category (fruit), additional FNDDS data sets have been added."
        ],
        updates: [
            "On the info page there is a link now to the USDA website, i.e., to the data sheet of the selected food data.",
            "ContactContainer address and logo text have been updated.",
            "Reference to USDA has been changed to conform with the official name."
        ],
        bugfixes: [
            "Fixes the display bug in the direct compare menu, that sometimes occurred when the browser window size was changed (chart becoming larger than their container).",
            "The info data page in the food analyzer menu has its original height again.",
            "Some wrong condition names of food elements have been corrected."
        ]
    },
    {
        id: "1.2.2",
        date: "07-30-2021",
        subject: "Combining data sources",
        features: [
            "Two data sources can now be combined with each other. Missing data can be supplemented by another source (if it exists) or the average data can be calculated out of two data sources."
        ],
        updates: [
            "Meta data of the index.html has been changed, a new favicon has been added.",
        ],
        bugfixes: [
            "Some missing (but actually available) information in the nutrient data set have been completed.",
        ]
    },
    {
        id: "1.3",
        date: "08-15-2021",
        subject: "Adding URIs for selected food items",
        features: [
            "In the food data panel, a unique URI identifying the selected resource is now generated. This makes it possible to share a selected item as a link. This also holds for aggregated data.",
            "A URI is generated for items in the direct compare panel accordingly."
        ],
        updates: [
            "When the 'getting started' button in the home menu is clicked, the food selector will now open immediately.",
            "The data page buttons in the food data panel haft a left alignment now."
        ]
    },
    {
        id: "1.3.1",
        date: "08-26-2021",
        subject: "Updated contact form",
        features: [
            "The layout of the contacts page has been updated.",
            "A contact form is provided now."
        ],
        updates: [
            "The display mode (chart or table) is temporarily saved now.",
            "A link has been added to the table data mode to switch directly to chart mode."
        ],
        bugfix: [
            "Redirect bug from home menu to food data panel resulting in a frozen food data selected was solved."
        ]
    },
    {
        id: "1.3.2",
        date: "09-02-2021",
        subject: "General styling improvement",
        features: [
            "Some new food elements were added to the database."
        ],
        updates: [
            "Updates the home page styling and content.",
            "If entered with a mobile device, a confirmation dialog will now suggest to use the app version."
        ],
        bugfix: [
            "In Chrome, the German language has not automatically been detected. This bug is now solved."
        ]
    },
    {
        id: "1.4",
        date: "09-06-2021",
        subject: "Ranking chart and new homepage styling",
        features: [
            "A new menu for ranking foods by specific values has been added.",
            "The home page has been re-styled and extended.",
            "New foods were added."
        ]
    },
    {
        id: "1.4.1",
        date: "09-28-2021",
        subject: "Beverages",
        features: [
            "A new category of common beverages was added to Food Compare. Also, some new foods were added.",
            "Alcohol amount is now included in the food composition chart and table.",
            "Help texts were added to the food selector.",
            "The scientific name of vitamins have been added to the chart tooltips."
        ],
        bugfixes: [
            "Typos have been fixed.",
            "Incorrect Vitamin D values in some food elements have been fixed."
        ]
    }
]