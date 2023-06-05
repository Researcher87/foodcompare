import {Component, createContext, ReactElement} from "react";
import * as NutrientDataImportService from "../service/NutrientDataImportService";
import FoodDataCorpus from "../types/nutrientdata/FoodDataCorpus";
import SelectedFoodItem from "../types/livedata/SelectedFoodItem";
import {ApplicationData, RankingPanelData} from "../types/livedata/ApplicationData";
import {
    DISPLAYMODE_CHART, OPTION_YES,
    SOURCE_SRLEGACY,
    TAB_BASE_DATA, UNIT_GRAM,
    UNIT_MILLIGRAM
} from "../config/Constants";
import {UserData} from "../types/livedata/UserData";
import {
    initialChartConfigData,
    initialDirectCompareConfigData, initialJuxtapositionConfigData,
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
import {ChartConfigData, DirectCompareChartConfigData, JuxtapositionConfig} from "../types/livedata/ChartConfigData";
import ReactSelectOption from "../types/ReactSelectOption";
import {parseFoodCompareUri} from "../service/uri/BaseUriService";
import {DataSettings} from "../types/livedata/DataSettings";

export interface ApplicationDataContext {
    foodDataCorpus: FoodDataCorpus
    applicationData: ApplicationData
    userData: UserData
    dataSettings: DataSettings,
    debug: boolean
    ready: boolean
    useAsMobile: Boolean | null
}

export interface ApplicationContext extends ApplicationDataContext {
    setUserData: (userData: UserData) => void
    setDataSettings: (dataSettings: DataSettings) => void
    setPreferredSource: (string) => void
    setMobileUsage: (boolean) => void
    setFoodSelectorConfig: (selectedCategory: ReactSelectOption | null, sourceSupplement: boolean, sourceCombine: boolean) => void
    setDirectCompareFoodSelector1: (sourceSupplement: boolean, sourceCombine: boolean) => void
    setDirectCompareFoodSelector2: (sourceSupplement: boolean, sourceCombine: boolean) => void
    setFoodDataPanelData: {
        setSelectedFoodTab: (number) => void
        setSelectedDataPage: (string) => void
        setSelectedDisplayMode: (string) => void
        addItemToFoodDataPanel: (selectedFoodItem: SelectedFoodItem) => void
        removeItemFromFoodDataPanel: (number) => void
        removeAllItemsFromFoodDataPanel: () => void
        updateAllFoodItemNames: (foodNames: Array<NameType>, newLanguage: string) => void
        updateFoodDataPanelChartConfig: (chartConfig: ChartConfigData) => void
        updateJuxtapositionConfig: (juxtapositionConfig: JuxtapositionConfig) => void
    }
    setDirectCompareData: {
        updateDirectCompareChartConfig: (chartConfig: DirectCompareChartConfigData) => void
        setSelectedDirectCompareItems: (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => void
        setSelectedDirectCompareDataPage: (selectedPage: string) => void
    }
    setRankingPanelData: (RankingPanelData) => void
}

export const ApplicationDataContextStore = createContext<ApplicationContext | null>(null)

export default class ApplicationDataContextProvider extends Component<any, ApplicationDataContext> {
    setDebugState = (debug: boolean) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                    debug: debug
            }
        }))
    }

    setSelectedFoodDataPanelTab = (selectedTab: number) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {...prevState.applicationData.foodDataPanel, selectedFoodItemIndex: selectedTab}
            }
        }))
    }

    setSelectedDisplayMode = (displayMode: string) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {...prevState.applicationData.foodDataPanel, displayMode: displayMode}
            }
        }))
    }

    setSelectedFoodDataPanelPage = (selectedPage: string) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {...prevState.applicationData.foodDataPanel, selectedDataPage: selectedPage}
            }
        }))
    }

    addItemToFoodDataPanel = (foodItem: SelectedFoodItem) => {
        const newItems = Object.assign(this.state.applicationData.foodDataPanel.selectedFoodItems)
        newItems.push(foodItem)
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {...prevState.applicationData.foodDataPanel, selectedFoodItems: newItems}
            }
        }))
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

        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {
                    ...prevState.applicationData.foodDataPanel,
                    selectedFoodItems: newItems,
                    selectedFoodItemIndex: newIndex
                }
            }
        }))
    }

    removeAllItemsFromFoodDataPanel = () => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {
                    ...prevState.applicationData.foodDataPanel,
                    selectedFoodItems: [],
                    selectedFoodItemIndex: 0
                }
            }
        }))
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

        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {
                    ...prevState.applicationData.foodDataPanel,
                    selectedFoodItems: newFoodItems,
                }
            }
        }))
    }

    updateFoodDataPanelChartConfig = (chartConfig: ChartConfigData) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {
                    ...prevState.applicationData.foodDataPanel,
                    chartConfigData: chartConfig
                }
            }
        }))
    }

    updateJuxtaPositionConfig = (juxtapositionConfigData: JuxtapositionConfig) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                foodDataPanel: {
                    ...prevState.applicationData.foodDataPanel,
                    juxtapositionConfigData: juxtapositionConfigData
                }
            }
        }))
    }


    setSelectedDirectCompareItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                directCompareDataPanel: {
                    ...prevState.applicationData.directCompareDataPanel,
                    selectedFoodItem1: selectedFoodItem1,
                    selectedFoodItem2: selectedFoodItem2
                }
            }
        }))
    }

    setSelectedDirectCompareDataPage = (selectedPage: string) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                directCompareDataPanel: {
                    ...prevState.applicationData.directCompareDataPanel,
                    selectedDataPage: selectedPage
                }
            }
        }))
    }

    updateDirectCompareChartConfig = (chartConfig: DirectCompareChartConfigData) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData,
                directCompareDataPanel: {
                    ...this.state.applicationData.directCompareDataPanel,
                    directCompareConfigChart: chartConfig
                }
            }
        }))
    }

    setUserData = (userData: UserData) => {
        this.setState(() => ({
            userData: {
                ...userData
            }
        }))
    }

    setDataSettings = (dataSettings: DataSettings) => {
        this.setState(() => ({
            dataSettings: {
                ...dataSettings
            }
        }))
    }

    setPreferredSource = (source: string) => {
        this.setState(prevState => ({
            applicationData: {
                ...prevState.applicationData, preferredSource: source
            }
        }))
    }

    setFoodSelectorConfig = (selectedCategory: ReactSelectOption | null, sourceSupplement: boolean, sourceCombine: boolean) => {
        this.setState(prevState => ({
                applicationData: {
                    ...prevState.applicationData, foodSelector: {
                        ...prevState.applicationData.foodSelector,
                        selectedCategory: selectedCategory,
                        sourceSupplement: sourceSupplement,
                        sourceCombine: sourceCombine
                    }
                }
            }
        ))
    }

    setDirectCompareFoodSelectorConfig1 = (sourceSupplement: boolean, sourceCombine: boolean) => {
        this.setState(prevState => ({
                applicationData: {
                    ...prevState.applicationData, directCompareDataPanel: {
                        ...prevState.applicationData.directCompareDataPanel,
                        foodSelector1: {
                            sourceSupplement: sourceSupplement,
                            sourceCombine: sourceCombine
                        }
                    }
                }
            }
        ))
    }

    setDirectCompareFoodSelectorConfig2 = (sourceSupplement: boolean, sourceCombine: boolean) => {
        this.setState(prevState => ({
                applicationData: {
                    ...prevState.applicationData, directCompareDataPanel: {
                        ...prevState.applicationData.directCompareDataPanel,
                        foodSelector2: {
                            sourceSupplement: sourceSupplement,
                            sourceCombine: sourceCombine
                        }
                    }
                }
            }
        ))
    }

    setRankingPanelData = (rankingPanelData: RankingPanelData): void => {
        this.setState(prevState => ({
                applicationData: {
                    ...prevState.applicationData, rankingPanelData: rankingPanelData
                }
            })
        )
    }

    isDebugMode(): boolean {
        const uriData: string | null = parseFoodCompareUri()
        return uriData !== "test" && uriData !== "debug" ? false : true
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
                juxtapositionConfigData: initialJuxtapositionConfigData
            },
            directCompareDataPanel: {
                selectedFoodItem1: null,
                selectedFoodItem2: null,
                selectedDataPage: TAB_BASE_DATA,
                directCompareConfigChart: initialDirectCompareConfigData,
                foodSelector1: {
                    sourceSupplement: true,
                    sourceCombine: false
                },
                foodSelector2: {
                    sourceSupplement: true,
                    sourceCombine: false
                }
            },
            rankingPanelData: {
                selectedFoodCategory: null,
                selectedGroup: null,
                selectedElement: null,
                use100gram: true,
                showDietaryRequirements: false
            },
            foodSelector: {
                selectedCategory: null,
                sourceSupplement: true,
                sourceCombine: false,
            },
            preferredSource: SOURCE_SRLEGACY,
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
        dataSettings: {
          unitVitamins: UNIT_MILLIGRAM,
          unitProteins: UNIT_GRAM,
          includeProvitamins: OPTION_YES
        },
        debug: this.isDebugMode(),
        ready: false,
        useAsMobile: null
    }

    UNSAFE_componentWillMount() {
        const foodDataCorpus = NutrientDataImportService.loadFoodDataCorpus()
        this.setState({
            foodDataCorpus: foodDataCorpus,
            ready: true
        })
    }

    render(): ReactElement {
        const value = {
            applicationData: this.state.applicationData,
            foodDataCorpus: this.state.foodDataCorpus,
            userData: this.state.userData,
            dataSettings: this.state.dataSettings,
            debug: this.state.debug,
            ready: this.state.ready,
            useAsMobile: this.state.useAsMobile,
            setUserData: this.setUserData,
            setDataSettings: this.setDataSettings,
            setPreferredSource: this.setPreferredSource,
            setMobileUsage: (usage: boolean) => {
                this.setState({...this.state, useAsMobile: usage})
            },
            setFoodDataPanelData: {
                setSelectedFoodTab: this.setSelectedFoodDataPanelTab,
                setSelectedDataPage: this.setSelectedFoodDataPanelPage,
                setSelectedDisplayMode: this.setSelectedDisplayMode,
                addItemToFoodDataPanel: this.addItemToFoodDataPanel,
                removeItemFromFoodDataPanel: this.removeItemFromFoodDataPanel,
                removeAllItemsFromFoodDataPanel: this.removeAllItemsFromFoodDataPanel,
                updateAllFoodItemNames: this.updateAllFoodItemNames,
                updateFoodDataPanelChartConfig: this.updateFoodDataPanelChartConfig,
                updateJuxtapositionConfig: this.updateJuxtaPositionConfig
            },
            setDirectCompareData: {
                updateDirectCompareChartConfig: this.updateDirectCompareChartConfig,
                setSelectedDirectCompareDataPage: this.setSelectedDirectCompareDataPage,
                setSelectedDirectCompareItems: this.setSelectedDirectCompareItems
            },
            setFoodSelectorConfig: this.setFoodSelectorConfig,
            setRankingPanelData: this.setRankingPanelData,
            setDirectCompareFoodSelector1: this.setDirectCompareFoodSelectorConfig1,
            setDirectCompareFoodSelector2: this.setDirectCompareFoodSelectorConfig2
        }

        return (
            <ApplicationDataContextStore.Provider value={value}>
                {this.props.children}
            </ApplicationDataContextStore.Provider>
        )
    }

}
