import {Component, createContext, ReactElement} from "react";
import * as NutrientDataImportService from "../service/NutrientDataImportService";
import FoodDataCorpus from "../types/nutrientdata/FoodDataCorpus";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {ApplicationData} from "../types/livedata/ApplicationData";
import {DISPLAYMODE_CHART, SOURCE_SRLEGACY, TAB_BASE_DATA} from "../config/Constants";
import {UserData} from "../types/livedata/UserData";
import {
    initialChartConfigData,
    initialDirectCompareConfigData,
    initialUserDataAge,
    initialUserDataBreastfeeding,
    initialUserDataLeisureSports,
    initialUserDataPalValue,
    initialUserDataPregnant,
    initialUserDataSex,
    initialUserDataSize,
    initialUserDataWeight
} from "../config/ApplicationSetting";
import {getNameFromFoodNameList} from "../service/nutrientdata/NameTypeService";
import NameType from "../types/nutrientdata/NameType";
import {ChartConfigData, DirectCompareChartConfigData} from "../types/livedata/ChartConfigData";
import ReactSelectOption from "../types/ReactSelectOption";

export interface ApplicationDataContext {
    foodDataCorpus: FoodDataCorpus
    applicationData: ApplicationData
    userData: UserData
    debug: boolean
    setUserData: (userData: UserData) => void
    ready: boolean
}

export const ApplicationDataContextStore = createContext<ApplicationDataContext | null>(null)

export default class ApplicationDataContextProvider extends Component<any, ApplicationDataContext> {

    setSelectedFoodDataPanelTab = (selectedTab: number) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {...this.state.applicationData.foodDataPanel, selectedFoodItemIndex: selectedTab}
            }
        })
    }

    setSelectedFoodDataPanelPage = (selectedPage: string) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {...this.state.applicationData.foodDataPanel, selectedDataPage: selectedPage}
            }
        })
    }

    addItemToFoodDataPanel = (foodItem: SelectedFoodItem) => {
        const newItems = this.state.applicationData.foodDataPanel.selectedFoodItems
        newItems.push(foodItem)
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {...this.state.applicationData.foodDataPanel, selectedFoodItems: newItems}
            }
        })
    }

    removeItemFromFoodDataPanel = (foodItemId: number) => {
        const newItems = this.state.applicationData.foodDataPanel.selectedFoodItems.filter(
            selectedFoodItem => selectedFoodItem.foodItem.id !== foodItemId
        )

        let newIndex = 0
        let currentIndex = this.state.applicationData.foodDataPanel.selectedFoodItemIndex

        if (newItems.length > 0) {
            if (currentIndex < newItems.length) {
                newIndex = currentIndex
            } else {
                newIndex = newItems.length - 1
            }
        }

        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {
                    ...this.state.applicationData.foodDataPanel,
                    selectedFoodItems: newItems,
                    selectedFoodItemIndex: newIndex
                }
            }
        })
    }

    removeAllItemsFromFoodDataPanel = () => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {
                    ...this.state.applicationData.foodDataPanel,
                    selectedFoodItems: [],
                    selectedFoodItemIndex: 0
                }
            }
        })
    }

    updateAllFoodItemNames = (foodNames: Array<NameType>, newLanguage: string) => {
        const selectedFoodItems = this.state.applicationData.foodDataPanel.selectedFoodItems
        const newFoodItems = selectedFoodItems.map(selectedFoodItem => {
            const foodName = selectedFoodItem.foodItem.nameId
                ? getNameFromFoodNameList(foodNames, selectedFoodItem.foodItem.nameId, newLanguage)
                : "Individual"
            if (foodName) {
                selectedFoodItem = {...selectedFoodItem, tab: foodName}
            }
            return selectedFoodItem
        })

        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {
                    ...this.state.applicationData.foodDataPanel,
                    selectedFoodItems: newFoodItems,
                }
            }
        })
    }

    updateFoodDataPanelChartConfig = (chartConfig: ChartConfigData) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                foodDataPanel: {
                    ...this.state.applicationData.foodDataPanel,
                    chartConfigData: chartConfig
                }
            }
        })
    }


    setSelectedDirectCompareItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                directCompareDataPanel: {
                    ...this.state.applicationData.directCompareDataPanel,
                    selectedFoodItem1: selectedFoodItem1,
                    selectedFoodItem2: selectedFoodItem2
                }
            }
        })
    }

    setSelectedDirectCompareDataPage = (selectedPage: string) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                directCompareDataPanel: {
                    ...this.state.applicationData.directCompareDataPanel,
                    selectedDataPage: selectedPage
                }
            }
        })
    }

    updateDirectCompareChartConfig = (chartConfig: DirectCompareChartConfigData) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData,
                directCompareDataPanel: {
                    ...this.state.applicationData.directCompareDataPanel,
                    directCompareConfigChart: chartConfig
                }
            }
        })
    }

    setUserData = (userData: UserData) => {
        this.setState({
            ...this.state,
            userData: userData
        })
    }


    setPreferredSource = (source: string) => {
        this.setState({
            ...this.state,
            applicationData: {
                ...this.state.applicationData, preferredSource: source
            }
        })
    }


    setFoodSelectorConfig = (selectedCategory: ReactSelectOption | null, sourceSupplement: boolean, sourceCombine: boolean) => {
        this.setState({
                ...this.state,
                applicationData: {
                    ...this.state.applicationData, foodSelector: {
                        ...this.state.applicationData.foodSelector,
                        selectedCategory: selectedCategory,
                        sourceSupplement: sourceSupplement,
                        sourceCombine: sourceCombine
                    }
                }
            }
        )
    }

    state: ApplicationDataContext = {
        foodDataCorpus: {
            categories: [],
            conditions: [],
            portionTypes: [],
            sources: [],
            foodNames: [],
            foodClasses: [],
            foodItems: [],
            dietaryRequirements: null,
        },
        applicationData: {
            foodDataPanel: {
                selectedFoodItems: [],
                selectedDataPage: TAB_BASE_DATA,
                displayMode: DISPLAYMODE_CHART,
                selectedFoodItemIndex: 0,
                chartConfigData: initialChartConfigData,
                setSelectedFoodTab: this.setSelectedFoodDataPanelTab,
                setSelectedDataPage: this.setSelectedFoodDataPanelPage,
                addItemToFoodDataPanel: this.addItemToFoodDataPanel,
                removeItemFromFoodDataPanel: this.removeItemFromFoodDataPanel,
                removeAllItemsFromFoodDataPanel: this.removeAllItemsFromFoodDataPanel,
                updateAllFoodItemNames: this.updateAllFoodItemNames,
                updateFoodDataPanelChartConfig: this.updateFoodDataPanelChartConfig
            },
            directCompareDataPanel: {
                selectedFoodItem1: null,
                selectedFoodItem2: null,
                selectedDataPage: TAB_BASE_DATA,
                directCompareConfigChart: initialDirectCompareConfigData,
                updateDirectCompareChartConfig: this.updateDirectCompareChartConfig,
                setSelectedDirectCompareDataPage: this.setSelectedDirectCompareDataPage,
                setSelectedDirectCompareItems: this.setSelectedDirectCompareItems
            },
            foodSelector: {
                selectedCategory: null,
                sourceSupplement: true,
                sourceCombine: false,
                setFoodSelectorConfig: this.setFoodSelectorConfig
            },
            preferredSource: SOURCE_SRLEGACY,
            setPreferredSource: this.setPreferredSource
        },
        userData: {
            age: initialUserDataAge,
            size: initialUserDataSize,
            weight: initialUserDataWeight,
            sex: initialUserDataSex,
            pregnant: initialUserDataPregnant,
            breastFeeding: initialUserDataBreastfeeding,
            palValue: initialUserDataPalValue,
            leisureSports: initialUserDataLeisureSports,
            initialValues: true
        },
        debug: true,
        setUserData: this.setUserData,
        ready: false
    }

    componentDidMount() {
        const foodDataCorpus = NutrientDataImportService.loadFoodDataCorpus()
        this.setState({
            foodDataCorpus: foodDataCorpus,
            ready: true
        })
    }

    render()
        :
        ReactElement {
        return (
            <ApplicationDataContextStore.Provider value={{...this.state}}>
                {this.props.children}
            </ApplicationDataContextStore.Provider>
        )
    }

}
