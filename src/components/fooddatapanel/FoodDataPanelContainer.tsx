import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import React, {useContext, useEffect} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {
    PATH_FOODDATA_PANEL,
    QUERYKEY_DATAPANEL_ADD, QUERYKEY_DATAPANEL_ADD_COMPOSITE,
    QUERYKEY_DATAPANEL_AGGREGATED,
    QUERYKEY_DATAPANEL_ITEM
} from "../../config/Constants";
import {useHistory} from 'react-router-dom';
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import {AggregatedFoodItemUriData, FoodItemUriData} from "../../types/livedata/UriData";
import {makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri} from "../../service/uri/FoodDataPanelUriService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {
    convertAggregatedDataJsonToUriString,
    convertAggregatedUriStringToObject
} from "../../service/uri/FoodDataPanelAggregatedUriService";
import {checkUserDataValidity, USERDATA_OK} from "../../service/UserDataService";
import {isMobileDevice} from "../../service/WindowDimension";
import {FaExclamationTriangle} from "react-icons/fa";

export default function FoodDataPanelContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const history = useHistory()

    const queryString = window.location.search.substring(1)
    const equalOperator = queryString.indexOf("=")
    const key = queryString.substring(0, equalOperator)
    const value = queryString.substring(equalOperator + 1)

    const openSelectorModal = key === QUERYKEY_DATAPANEL_ADD && value === "1"
    const openCompositeSelectorModal = key === QUERYKEY_DATAPANEL_ADD_COMPOSITE && value === "1"

    useEffect(() => {
        buildDataPanelPageFromURI()
    }, [applicationContext?.applicationData.foodDataPanel.selectedFoodItemIndex,
        applicationContext?.applicationData.foodDataPanel.selectedFoodItems,
        applicationContext?.applicationData.foodDataPanel.selectedDataPage,
        applicationContext?.applicationData.foodDataPanel.displayMode,
        applicationContext?.applicationData.foodDataPanel.chartConfigData,
        applicationContext?.userData])

    const buildDataPanelPageFromURI = () => {
        if (!applicationContext) {
            return
        }

        const {selectedFoodItemIndex, selectedFoodItems} = applicationContext.applicationData.foodDataPanel

        if (selectedFoodItemIndex === null || !selectedFoodItems || selectedFoodItems.length === 0) {
            createDataFromUriQuery()
        } else {   // Set new URI Query
            updateUriQuery(selectedFoodItemIndex)
        }
    }

    if (!applicationContext || !applicationContext.ready) {
        return <div/>
    }

    const chartConfigData = applicationContext.applicationData.foodDataPanel.chartConfigData

    const updateUriQuery = (selectedFoodItemIndex: number) => {
        const selectedFoodItem = selectedFoodItems[selectedFoodItemIndex]
        const userData = applicationContext.userData
        const {
            selectedDataPage,
            displayMode,
            chartConfigData
        } = applicationContext.applicationData.foodDataPanel

        // New query for aggregated food item
        if (selectedFoodItem.aggregated) {
            const uriDataObject: AggregatedFoodItemUriData = {
                selectedFoodItem: {...selectedFoodItem, component: undefined},
                selectedDataPage: selectedDataPage,
                userData: userData,
                chartConfigData: chartConfigData
            }

            const query = convertAggregatedDataJsonToUriString(uriDataObject)

            history.push({
                pathName: PATH_FOODDATA_PANEL,
                search: `${QUERYKEY_DATAPANEL_AGGREGATED}=${query}`
            })
        } else {   // New query for a default food item
            const {portion, selectedSource, supplementData, combineData} = selectedFoodItem
            const foodItemData: FoodItemUriData = {
                foodItemId: selectedFoodItem.foodItem.id,
                portionData: portion,
                source: selectedSource,
                supplementData: supplementData,
                combineData: combineData
            }
            let query = makeFoodDataPanelDefaultUri(foodItemData, userData, selectedDataPage, displayMode,
                chartConfigData)

            const currentQuery = window.location.search
            if (currentQuery.includes("&group=")) {
                const groupFragment = currentQuery.substring(currentQuery.indexOf("&group="));
                query += groupFragment;
            }

            history.push({
                pathName: PATH_FOODDATA_PANEL,
                search: `${QUERYKEY_DATAPANEL_ITEM}=${query}`
            })
        }
    }

    const createDataFromUriQuery = () => {
        const {
            addItemToFoodDataPanel,
            setSelectedDataPage,
            setSelectedDisplayMode
        } = applicationContext.setFoodDataPanelData

        // Set data from an aggregated food item query
        if (key === QUERYKEY_DATAPANEL_AGGREGATED && value.length > 1) {
            try {
                const uriDataObject: AggregatedFoodItemUriData | null = convertAggregatedUriStringToObject(chartConfigData, value)
                if (!uriDataObject) {
                    return
                }

                if (checkUserDataValidity(uriDataObject.userData) !== USERDATA_OK) {
                    return
                }

                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(uriDataObject.chartConfigData)
                setSelectedDataPage(uriDataObject.selectedDataPage)
                applicationContext.setUserData(uriDataObject.userData)

                const selectedFoodItemWithComponent = makeFoodDataPanelComponent(uriDataObject.selectedFoodItem,
                    applicationContext.foodDataCorpus.foodNames, languageContext.language)

                if (selectedFoodItemWithComponent) {
                    selectedFoodItemWithComponent.aggregated = true
                    addItemToFoodDataPanel(selectedFoodItemWithComponent)
                }
            } catch (e) {
                if (applicationContext.debug) {
                    console.log(e)
                }
            }
        }

        // Set data from a simple food item (create data from query parameters)
        if (key === QUERYKEY_DATAPANEL_ITEM && value.length > 1) {
            const uriDataObject = parseFoodDataPanelDefaultUri(value, chartConfigData)
            if (uriDataObject) {
                const foodItem = applicationContext.foodDataCorpus.foodItems.find(
                    foodItem => foodItem.id === uriDataObject.selectedFoodItem.foodItemId
                )

                if (!foodItem) {
                    return
                }

                if (checkUserDataValidity(uriDataObject.userData) !== USERDATA_OK) {
                    return
                }

                applicationContext.setUserData(uriDataObject.userData)
                const foodClass = applicationContext.foodDataCorpus.foodClasses.find(
                    foodClass => foodClass.id === foodItem.foodClass
                )

                const selectedFoodItem: SelectedFoodItem = {
                    id: 1,
                    foodItem: foodItem,
                    foodClass: foodClass,
                    portion: uriDataObject.selectedFoodItem.portionData,
                    selectedSource: uriDataObject.selectedFoodItem.source,
                    combineData: uriDataObject.selectedFoodItem.combineData,
                    supplementData: uriDataObject.selectedFoodItem.supplementData
                }

                setSelectedDataPage(uriDataObject.selectedDataPage)
                setSelectedDisplayMode(uriDataObject.displayMode)

                const selectedFoodItemWithComponent = makeFoodDataPanelComponent(selectedFoodItem,
                    applicationContext.foodDataCorpus.foodNames, languageContext.language)

                if (selectedFoodItemWithComponent) {
                    addItemToFoodDataPanel(selectedFoodItemWithComponent)
                }

                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(uriDataObject.chartConfigData)
            }
        }
    }


    const selectedFoodItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems

    const onTabChange = (foodId) => {
        buildDataPanelPageFromURI()
        for (let i = 0; i < selectedFoodItems.length; i++) {
            if (selectedFoodItems[i].id === foodId) {
                applicationContext.setFoodDataPanelData.setSelectedFoodTab(i)
            }
        }
    }

    const onNewFoodItemSelected = (): void => {
        buildDataPanelPageFromURI()
        const newTabIndex = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length - 1
        applicationContext.setFoodDataPanelData.setSelectedFoodTab(newTabIndex)
    }

    const selectedTabIndex = applicationContext.applicationData.foodDataPanel.selectedFoodItemIndex

    if (!(selectedTabIndex >= 0)) {
        return <div/>
    }

    const selectedFoodItem = applicationContext.applicationData.foodDataPanel.selectedFoodItems[selectedTabIndex]

    if (applicationContext.debug) {
        console.log('FoodDataPanelContainer: Render, selected food item = ', selectedFoodItem)
    }

    const containerDivClass = isMobileDevice() ? "" : "d-flex flex-row justify-content-center"
    const basepanelClass = selectedFoodItems && selectedFoodItems.length
        ? "d-flex flex-row foodanalyzer-basepanel"
        : "d-flex flex-row foodanalyzer-basepanel-empty";

    return <div className={"container-scroll container-fluid"}>
        {selectedFoodItem !== null &&
            <div style={{paddingTop: "4vh"}}>
                <div className={containerDivClass} >
                    <div className={basepanelClass}>
                        <div>
                            <FoodAnalyzerContainer onNewFoodItemSelected={onNewFoodItemSelected}
                                                   openSelectorModal={openSelectorModal}
                                                   openCompositeSelectorModal={openCompositeSelectorModal}
                            />
                        </div>
                        <div className={"d-flex flex-row"}>
                            <div className="col foodanalyzer-inner-container">
                                {selectedFoodItems && selectedFoodItems.length > 0 ?
                                    <div>
                                        <TabContainer indexToSet={selectedTabIndex} onTabChange={onTabChange}/>
                                    </div>
                                    :
                                    <div className={"form-text"} style={{margin: "1.2vw"}}>
                                        <p>
                                            <i>
                                                {applicationStrings.text_empty_fooddatapanel[languageContext.language]}
                                            </i>
                                        </p>
                                        {isMobileDevice() &&
                                        <p>
                                            <FaExclamationTriangle/> {applicationStrings.text_empty_fooddatapanel_mobileInfo[languageContext.language]}
                                        </p>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>


}