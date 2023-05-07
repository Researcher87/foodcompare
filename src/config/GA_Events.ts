export const GA_CATEGORY_HOME = "Home Menu"
export const GA_CATEGORY_HEADER = "Header"
export const GA_CATEGORY_FOOD_ANALYZER = "Food Analyzer"
export const GA_CATEGORY_DIRECT_COMPARE = "Direct Compare"
export const GA_CATEGORY_RANKING = "Ranking"
export const GA_CATEGORY_USER_SETTINGS = "User Settings Menu"
export const GA_CATEGORY_CONTACT = "Contact"

export const GA_CATEGORY_DATAPANEL = "Data Panel"

/*
 * In the Food Selector, a food item has been selected and added to the Food Analyzer.
 *  label: The name of the food class (English)
 *  value: The Food Item ID of the selected food item
 */
export const GA_ACTION_SELECT_FOOD_ITEM = "FA: Single item selection"

/*
 * In the Direct Compare menu, a new comparison is made, meaning that one or two new food items have been selected.
 *  label: The names of the food classes to be compared (English name), separated by semicolon.
 *  value: The food item ID of the first selection (the second food item is disregarded).
 */
export const GA_ACTION_SELECTION_DIRECT_COMPARE = "DC: New selection"

/*
 * In the Ranking menu, a new category has been selected.
 *  label: The ID of the selected category (0 = all).
 */
export const GA_ACTION_SELECTION_RANKING_CAT = "RA: New category selected"

/*
 * In the Ranking menu, a new element for comparison has been selected.
 *  label: The name of the selected element, such as Vitamin B1, iron (English).
 */
export const GA_ACTION_SELECTION_RANKING_ELEMENT = "RA: New element selected"

/*
 * In the Ranking menu, the configuration for displaying data was changed (radio button / checkbox).
 *  label: The names of the the configuration parameter (portion, show Dietary Req.)
 */
export const GA_ACTION_RANKING_CONFIG = "RA: Change configuration"

/*
 * In the Home menu, one of the start buttons has been clicked (access a specific feature).
 *  label: The name of the feature to be clicked
 */
export const GA_ACTION_HOME_CLICK_START_BUTTON = "HO: Click start button"

/*
 * In the Home menu, one of the menu buttons in the header has been clicked.
 *  label: The path (menu name)
 */
export const GA_ACTION_HOME_ACCESS_MENU = "Header: Access menu"

/*
 * In the Header, the language has been changed (a language radio button was clicked).
 *  label: The name of the language that was clicked (German, English).
 */
export const GA_ACTION_HEADER_CONFIG_LANGUAGE = "Header: Switch language"

/*
 * In the Header, the primary data source has been changed.
 *  label: The name of the source that was clicked (SR Legacy, FNDDS).
 */
export const GA_ACTION_HEADER_CONFIG_DATASOURCE = "Header: Switch prim. data source"

/*
 * In the User menu, new data has been submitted.
 */
export const GA_ACTION_USER_SETTINGS = "SE: Submit new user data"

/*
 * In the Contact menu, a sub-menu has been accessed.
 *  label: The name of the sub menu (such as Contact, Versions etc.)
 */
export const GA_ACTION_CONTACT_SUBMENU = "CO: Access sub-menu"

/*
 * In the Data Panel, the page has been switched (a data page link button was clicked, e.g. Vitamins).
 *  label: The name of the data page (such as Vitamins)
 *  value: 1 if it happened in the Food Analyzer, 2 if it happened in the Direct Compare menu
 */
export const GA_ACTION_DATAPANEL_SWITCH_PAGE = "Panel: Switch page"

/*
 * On the Base Data Page, some configuration has been changed (checkbox / radio button click)
 *  label: The name of the checkbox or radio button
 *  value: 1 if it happened in the Food Analyzer, 2 if it happened in the Direct Compare menu
 */
export const GA_ACTION_DATAPANEL_BASEDATA_CONFIG = "Panel: Base Data Page Config Change"

/*
 * On the Vitamins/Minerals/Proteins Page, some configuration has been changed (checkbox / radio button click)
 *  label: The name of the checkbox or radio button
 *  value: 1 if it happened in the Food Analyzer, 2 if it happened in the Direct Compare menu
 */
export const GA_ACTION_DATAPANEL_VITAMINS_CONFIG = "Panel: Vitamins Page Config Change"
export const GA_ACTION_DATAPANEL_MINERALS_CONFIG = "Panel: Minerals Page Config Change"
export const GA_ACTION_DATAPANEL_PROTEINS_CONFIG = "Panel: Proteins Page Config Change"
export const GA_ACTION_DATAPANEL_LIPIDS_CONFIG = "Panel: Lipids Page Config Change"
export const GA_ACTION_DATAPANEL_CARBS_CONFIG = "Panel: Carbs Page Config Change"

/*
 * In the Food Analyzer data panel a button in the header has been clicked (help, table/chart mode, close)
 *  label: The button / action triggered
 *  value: When the link to Food Data Central data is clicked (external reference), value is the selected food item ID
 */
export const GA_ACTION_DATAPANEL_GENERAL_ACTION = "Panel: General action"
