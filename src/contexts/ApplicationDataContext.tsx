import {Component, createContext, ReactElement} from "react";
import * as NutrientDataImportService from "../service/NutrientDataImportService";
import FoodDataCorpus from "../types/nutrientdata/FoodDataCorpus";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {ApplicationData} from "../types/livedata/ApplicationData";
import {DISPLAYMODE_CHART} from "../config/Constants";
import {UserData} from "../types/livedata/UserData";
import {
    initialChartConfigData,
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
import {ChartConfigData} from "../types/livedata/ChartConfigData";

export interface ApplicationDataContext {
    foodDataCorpus: FoodDataCorpus
    applicationData: ApplicationData
    userData: UserData
    selectedTab: number | null
    debug: boolean
    setSelectedTab: (number) => void
    addItemToFoodDataPanel: (number) => void
    removeItemFromFoodDataPanel: (number) => void
    removeAllItemsFromFoodDataPanel: () => void
    setUserData: (userData: UserData) => void
    updateAllFoodItemNames: (foodNames: Array<NameType>, newLanguage: string) => void
    updateChartConfig: (chartConfig: ChartConfigData) => void
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

    setUserData = (userData: UserData) => {
        this.setState({
            ...this.state,
            userData: userData
        })
    }

    updateAllFoodItemNames = (foodNames: Array<NameType>, newLanguage: string) => {
        const selectedFoodItems = this.state.applicationData.foodDataPanel.selectedFoodItems
        const newFoodItems = selectedFoodItems.map(selectedFoodItem => {
            const foodName = getNameFromFoodNameList(foodNames,
                selectedFoodItem.foodItem.nameId, newLanguage)
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

    updateChartConfig = (chartConfig: ChartConfigData) => {
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
                selectedDataPage: 0,
                displayMode: DISPLAYMODE_CHART,
                selectedFoodItemIndex: 0,
                chartConfigData: initialChartConfigData
            }
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
        selectedTab: null,
        debug: true,
        setSelectedTab: this.setSelectedFoodDataPanelTab,
        addItemToFoodDataPanel: this.addItemToFoodDataPanel,
        removeItemFromFoodDataPanel: this.removeItemFromFoodDataPanel,
        removeAllItemsFromFoodDataPanel: this.removeAllItemsFromFoodDataPanel,
        setUserData: this.setUserData,
        updateAllFoodItemNames: this.updateAllFoodItemNames,
        updateChartConfig: this.updateChartConfig
    }

    componentDidMount() {
        const foodDataCorpus = NutrientDataImportService.loadFoodDataCorpus()
        this.setState({
            foodDataCorpus: foodDataCorpus
        })
    }

    render(): ReactElement {
        return (
            <ApplicationDataContextStore.Provider value={{...this.state}}>
                {this.props.children}
            </ApplicationDataContextStore.Provider>
        )
    }

}
