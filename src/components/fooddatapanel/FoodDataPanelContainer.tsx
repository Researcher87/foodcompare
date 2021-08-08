import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext, useEffect} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {PATH_FOODDATA_PANEL, PORTION_KEY_100, QUERYKEY_DATAPANEL_ITEM, QUERYKEY_DATAPANEL_AGGREGATED, TAB_LIST} from "../../config/Constants";
import {useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import { UriData } from "../../types/livedata/UriData";
import { convertUriDataJsonToCompactString, convertUriStringToObject, makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri } from "../../service/UriService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";


export default function FoodDataPanelContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
	const history = useHistory()

    const buildDataPanelPageFromURI = () => {
		if(!applicationContext) {
			return
		}
		
		const {selectedFoodItemIndex, selectedFoodItems} = applicationContext.applicationData.foodDataPanel
		
		if(selectedFoodItemIndex === null || !selectedFoodItems || selectedFoodItems.length === 0) {			
			const queryString = window.location.search.substring(1)
			const equalOperator = queryString.indexOf("=")
            const key = queryString.substring(0, equalOperator)
            const value = queryString.substring(equalOperator+1)

			const {addItemToFoodDataPanel, setSelectedDataPage} = applicationContext.setFoodDataPanelData

			// Set data from an aggregated food item query
            if(key === QUERYKEY_DATAPANEL_AGGREGATED && value.length > 1) {
            	try {				
					const uriDataObject: UriData = convertUriStringToObject(value)
					setSelectedDataPage(uriDataObject.selectedDataPage)
					applicationContext.setUserData(uriDataObject.userData)	
					
					const selectedFoodItemWithComponent = makeFoodDataPanelComponent(uriDataObject.selectedFoodItem, 
					applicationContext.foodDataCorpus.foodNames, languageContext.language, uriDataObject.selectedDataPage)
					
					if(selectedFoodItemWithComponent) {
						addItemToFoodDataPanel(selectedFoodItemWithComponent)
					}
				} catch(e) {
					console.error(e)
				}
            }

			// Set data from a simple food item (create data from query parameters)
			if(key === QUERYKEY_DATAPANEL_ITEM && value.length > 1) {
				const uriDataObject = parseFoodDataPanelDefaultUri(value)
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
				}
			}
			
		} else {   // Set new URI Query		
			const selectedFoodItem = selectedFoodItems[selectedFoodItemIndex]
			const userData = applicationContext.userData
			const selectedDataPage = applicationContext.applicationData.foodDataPanel.selectedDataPage
			
			// New query for aggregated food item
			if(selectedFoodItem.compositeSubElements && selectedFoodItem.compositeSubElements.length > 0) {
				const uriDataObject: UriData = {
					selectedFoodItem: {...selectedFoodItem, component: undefined},
					selectedDataPage: selectedDataPage,
					userData: userData
				}
			
				const query = convertUriDataJsonToCompactString(uriDataObject)
			
				history.push({
					pathName: PATH_FOODDATA_PANEL,
					search: `${QUERYKEY_DATAPANEL_AGGREGATED}=${query}`
				})
			} else {   // New query for a default food item
				const {portion, selectedSource, supplementData, combineData} = selectedFoodItem
				const query = makeFoodDataPanelDefaultUri(selectedFoodItem.foodItem.id, selectedSource, portion, 
					userData, supplementData, combineData, selectedDataPage)
					
				history.push({
					pathName: PATH_FOODDATA_PANEL,
					search: `${QUERYKEY_DATAPANEL_ITEM}=${query}`
				})
			}
		}
    }


    useEffect(() => {
        buildDataPanelPageFromURI()
    }, [applicationContext?.applicationData.foodDataPanel.selectedFoodItemIndex, 
		applicationContext?.applicationData.foodDataPanel.selectedFoodItems,
		applicationContext?.applicationData.foodDataPanel.selectedDataPage,
		applicationContext?.userData])

    if (!applicationContext || !applicationContext.ready) {
        return <div/>
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

    return <div>
        {selectedFoodItem !== null &&
        <div className="container-fluid" style={{paddingTop: "20px"}}>
            <div className="row">
                <div className={"col-2"}>
                    <FoodAnalyzerContainer onNewFoodItemSelected={onNewFoodItemSelected}/>
                </div>
                <div className="col-10 media app" style={{maxWidth: "1100px", marginTop: "-10px"}}>
                    {selectedFoodItems && selectedFoodItems.length > 0 ?
                        <div>
                            <TabContainer indexToSet={selectedTabIndex} onTabChange={onTabChange}/>
                        </div>
                        :
                        <div style={{padding: "24px"}}>
                            <i>
                                {applicationStrings.text_empty_fooddatapanel[languageContext.language]}
                            </i>
                        </div>
                    }
                </div>
            </div>
        </div>
        }
    </div>


}