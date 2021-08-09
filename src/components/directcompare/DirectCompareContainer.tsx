import {DirectCompareSelector} from "../foodselector/DirectCompareSelector";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import React, {useContext, useEffect, useState} from "react";
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanel} from "./DirectCompareDataPanel";
import {applicationStrings} from "../../static/labels";
import {PATH_DIRECT_COMPARE, QUERYKEY_DATAPANEL_AGGREGATED, QUERYKEY_DATAPANEL_ITEM, TAB_LIST} from "../../config/Constants";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import { AggregatedFoodItemUriData } from "../../types/livedata/UriData";

export default function DirectCompareContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const history = useHistory()

    const initialFoodItem1 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        : null

    const initialFoodItem2 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        : null

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(initialFoodItem1)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(initialFoodItem2)

	useEffect(() => {
        buildDataObjectsFromURI()
    }, [applicationContext?.applicationData.directCompareDataPanel])

	
    if (applicationContext === null || !applicationContext.ready) {
        return <div/>
    }

	const buildDataObjectsFromURI = () => {
		if(!applicationContext) {
			return
		}
		
		if(!selectedFoodItem1 || !selectedFoodItem2) {			
			createDataFromUriQuery()		
		} else {   // Set new URI Query		
			updateUriQuery()
		}
    }

	const chartConfigData = applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart

	const updateUriQuery = () => {
		const userData = applicationContext.userData
		const selectedDataPage = applicationContext.applicationData.directCompareDataPanel.selectedDataPage

		/* if(selectedFoodItem1 && selectedFoodItem2) {
			const {portion, selectedSource, supplementData, combineData} = selectedFoodItem1
			const query = makeFoodDataPanelDefaultUri(selectedFoodItem.foodItem.id, selectedSource, portion, 
				userData, supplementData, combineData, selectedDataPage, chartConfigData)
		}
					
		history.push({
			pathName: PATH_DIRECT_COMPARE,
			search: `${QUERYKEY_DATAPANEL_ITEM}=${query}`
		}) */
	}
	
	const createDataFromUriQuery = () => {
			const queryString = window.location.search.substring(1)
			const equalOperator = queryString.indexOf("=")
            const key = queryString.substring(0, equalOperator)
            const value = queryString.substring(equalOperator+1)

			const {addItemToFoodDataPanel, setSelectedDataPage} = applicationContext.setFoodDataPanelData

			// Set data from an aggregated food item query
            if(key === QUERYKEY_DATAPANEL_AGGREGATED && value.length > 1) {
            	try {				
					/* const uriDataObject: AggregatedFoodItemUriData | null = convertAggregatedUriStringToObject(chartConfigData, value)
					if(!uriDataObject) {
						return
					}
					
					applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(uriDataObject.chartConfigData)
					setSelectedDataPage(uriDataObject.selectedDataPage)
					applicationContext.setUserData(uriDataObject.userData)
					
					const selectedFoodItemWithComponent = makeFoodDataPanelComponent(uriDataObject.selectedFoodItem, 
					applicationContext.foodDataCorpus.foodNames, languageContext.language, uriDataObject.selectedDataPage)
							
					if(selectedFoodItemWithComponent) {
						addItemToFoodDataPanel(selectedFoodItemWithComponent)
					} */
				} catch(e) {
					console.error(e)
				}
            }

			// Set data from a simple food item (create data from query parameters)
			if(key === QUERYKEY_DATAPANEL_ITEM && value.length > 1) {
				/* const uriDataObject = parseFoodDataPanelDefaultUri(value, chartConfigData)
				if(uriDataObject) {
					const foodItem = applicationContext.foodDataCorpus.foodItems.find(foodItem => foodItem.id === uriDataObject.foodItemId)
					if(!foodItem) {
						return
					}
					
					applicationContext.setUserData(uriDataObject.userData)	
					const foodClass = applicationContext.foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem.foodClass)
					
					const selectedFoodItem: SelectedFoodItem = {
						id: 1,
						foodItem: foodItem,
						foodClass: foodClass,
						portion: uriDataObject.portionData,
						selectedSource: uriDataObject.source,
						combineData: uriDataObject.combineData,
						supplementData: uriDataObject.supplementData
					}
					
					setSelectedDataPage(uriDataObject.selectedDataPage)
					
					const selectedFoodItemWithComponent = makeFoodDataPanelComponent(selectedFoodItem, 
						applicationContext.foodDataCorpus.foodNames, languageContext.language, uriDataObject.selectedDataPage)
					
					if(selectedFoodItemWithComponent) {
						addItemToFoodDataPanel(selectedFoodItemWithComponent)
					}
					
					applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(uriDataObject.chartConfigData) 
				}*/
			}
	}

	

    const updateSelectedFoodItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
        setSelectedFoodItem1(selectedFoodItem1)
        setSelectedFoodItem2(selectedFoodItem2)
        applicationContext.setDirectCompareData.setSelectedDirectCompareItems(selectedFoodItem1, selectedFoodItem2)
    }

    return (
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-4"}>
                    <DirectCompareSelector updateSelectedFoodItems={updateSelectedFoodItems}/>
                </div>
                <div className={"col-8"} style={{padding: "32px"}}>
                    {selectedFoodItem1 !== null && selectedFoodItem2 !== null ?
                    <DirectCompareDataPanel selectedFoodItem1={selectedFoodItem1}
                                            selectedFoodItem2={selectedFoodItem2}/>
                        : <div className={"app"}><i>{applicationStrings.direct_compare_text[languageContext.language]}</i></div>
                    }
                </div>
            </div>
        </div>
    )

}