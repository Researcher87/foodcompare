import {DirectCompareSelector} from "../foodselector/DirectCompareSelector";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import React, {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanel} from "./DirectCompareDataPanel";
import {applicationStrings} from "../../static/labels";
import {PATH_DIRECT_COMPARE, QUERYKEY_DATAPANEL_ITEM} from "../../config/Constants";
import {useHistory} from 'react-router-dom';
import {makeDirectCompareDataUri, parseDirectComparetUri} from "../../service/uri/DirectCompareUriService";
import {checkUserDataValidity, USERDATA_OK} from "../../service/UserDataService";

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

		if(selectedFoodItem1 && selectedFoodItem2) {
			const query = makeDirectCompareDataUri(selectedFoodItem1, selectedFoodItem2, userData, selectedDataPage, 
				chartConfigData)
				
			history.push({
				pathName: PATH_DIRECT_COMPARE,
				search: `${QUERYKEY_DATAPANEL_ITEM}=${query}`
			})
		}
	}
	
	const createDataFromUriQuery = () => {
			const queryString = window.location.search.substring(1)
			const equalOperator = queryString.indexOf("=")
            const key = queryString.substring(0, equalOperator)
            const value = queryString.substring(equalOperator+1)

			// Set data from a simple food item (create data from query parameters)
			if(key === QUERYKEY_DATAPANEL_ITEM && value.length > 1) {
				const uriDataObject = parseDirectComparetUri(value, chartConfigData)
								
				if(uriDataObject) {
					const foodItem1 = applicationContext.foodDataCorpus.foodItems.find(
						foodItem => foodItem.id === uriDataObject.selectedFoodItem1.foodItemId
						)
						
					const foodItem2 = applicationContext.foodDataCorpus.foodItems.find(
						foodItem => foodItem.id === uriDataObject.selectedFoodItem2.foodItemId
						)
						
					if(!foodItem1 || !foodItem2) {
						return
					}
					
					if(checkUserDataValidity(uriDataObject.userData) !== USERDATA_OK) {
						return
					}

					applicationContext.setUserData(uriDataObject.userData)	
					applicationContext.setDirectCompareData.updateDirectCompareChartConfig(uriDataObject.chartConfigData)
					applicationContext.setDirectCompareData.setSelectedDirectCompareDataPage(uriDataObject.selectedDataPage)
					
					const foodClass1 = applicationContext.foodDataCorpus.foodClasses.find(
						foodClass => foodClass.id === foodItem1.foodClass)
						
					const foodClass2 = applicationContext.foodDataCorpus.foodClasses.find(
						foodClass => foodClass.id === foodItem2.foodClass)
					
					const selectedFoodItem1: SelectedFoodItem = {
						id: 1000,
						foodItem: foodItem1,
						foodClass: foodClass1,
						portion: uriDataObject.selectedFoodItem1.portionData,
						selectedSource: uriDataObject.selectedFoodItem1.source,
						combineData: uriDataObject.selectedFoodItem1.combineData,
						supplementData: uriDataObject.selectedFoodItem1.supplementData
					}
					
					const selectedFoodItem2: SelectedFoodItem = {
						id: 1001,
						foodItem: foodItem2,
						foodClass: foodClass2,
						portion: uriDataObject.selectedFoodItem2.portionData,
						selectedSource: uriDataObject.selectedFoodItem2.source,
						combineData: uriDataObject.selectedFoodItem2.combineData,
						supplementData: uriDataObject.selectedFoodItem2.supplementData
					}
						
					updateSelectedFoodItems(selectedFoodItem1, selectedFoodItem2)
				}
			}
	}

	

    const updateSelectedFoodItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
    	const foodClassNameKey1 = selectedFoodItem1.foodClass?.nameKey
		applicationContext.foodDataCorpus.foodNames.find(entry => entry.id === foodClassNameKey1);
		const foodClassNameKey2 = selectedFoodItem2.foodClass?.nameKey
		applicationContext.foodDataCorpus.foodNames.find(entry => entry.id === foodClassNameKey2);
		setSelectedFoodItem1(selectedFoodItem1)
        setSelectedFoodItem2(selectedFoodItem2)
        applicationContext.setDirectCompareData.setSelectedDirectCompareItems(selectedFoodItem1, selectedFoodItem2)
    }

    return (
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-4"} style={{paddingBottom: "2vh"}}>
                    <DirectCompareSelector updateSelectedFoodItems={updateSelectedFoodItems}/>
                </div>
                <div className={"col-8"} style={{paddingTop: "1vh", paddingLeft: "3vw", paddingRight: "3vw"}}>
                    {selectedFoodItem1 !== null && selectedFoodItem2 !== null ?
                    <DirectCompareDataPanel selectedFoodItem1={selectedFoodItem1}
                                            selectedFoodItem2={selectedFoodItem2}/>
                        : <div className={"form-text"}><i>{applicationStrings.direct_compare_text[languageContext.language]}</i></div>
                    }
                </div>
            </div>
        </div>
    )

}