import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext, useEffect} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {PATH_FOODDATA_PANEL, PORTION_KEY_100, QUERYKEY_DATAPANEL_ITEMS, TAB_LIST} from "../../config/Constants";
import {useLocation, useHistory} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import { UriData } from "../../types/livedata/UriData";
import { convertUriDataJsonToCompactString, convertUriStringToObject } from "../../service/UriService";


export default function FoodDataPanelContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const location = useLocation();
	const history = useHistory()

    const buildDataPanelPageFromURI = () => {
        let activePath = location.pathname

		if(!applicationContext) {
			return
		}
		
		const {selectedFoodItemIndex, selectedFoodItems} = applicationContext.applicationData.foodDataPanel
		
		if(selectedFoodItemIndex === null || !selectedFoodItems || selectedFoodItems.length === 0) {
			console.log('Query Block 1')
			
			const queryString = window.location.search.substring(1)
			const equalOperator = queryString.indexOf("=")
            const key = queryString.substring(0, equalOperator)
            const value = queryString.substring(equalOperator+1)

            if(key !== QUERYKEY_DATAPANEL_ITEMS || value.length < 1) {
                return
            }
			
			try {				
				const uriDataObject: UriData = convertUriStringToObject(value)
				const {addItemToFoodDataPanel, setSelectedDataPage} = applicationContext.applicationData.foodDataPanel
				
				console.log('Query Block 1 -- set data page:', uriDataObject.selectedDataPage)
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
	
		} else {
			console.log('Query Block 2', applicationContext.applicationData.foodDataPanel.selectedDataPage)
			
			// set new path
			const selectedFoodItem = selectedFoodItems[selectedFoodItemIndex]
			const uriDataObject: UriData = {
				selectedFoodItem: {...selectedFoodItem, component: undefined},
				selectedDataPage: applicationContext.applicationData.foodDataPanel.selectedDataPage,
				userData: applicationContext.userData
			}
			
			const query = convertUriDataJsonToCompactString(uriDataObject)
			history.push({
				pathName: PATH_FOODDATA_PANEL,
				search: `${QUERYKEY_DATAPANEL_ITEMS}=${query}`
			})
		}
    }


    useEffect(() => {
        buildDataPanelPageFromURI()
    }, [applicationContext?.applicationData.foodDataPanel.selectedFoodItemIndex, 
		applicationContext?.applicationData.foodDataPanel.selectedFoodItems,
		applicationContext?.applicationData.foodDataPanel.selectedDataPage])

    if (!applicationContext || !applicationContext.ready) {
        return <div/>
    }


    const selectedFoodItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems

    const onTabChange = (foodId) => {
		buildDataPanelPageFromURI()
        for (let i = 0; i < selectedFoodItems.length; i++) {
            if (selectedFoodItems[i].id === foodId) {
                applicationContext.applicationData.foodDataPanel.setSelectedFoodTab(i)
            }
        }
    }

    const onNewFoodItemSelected = (): void => {
		buildDataPanelPageFromURI()
        const newTabIndex = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length - 1
        applicationContext.applicationData.foodDataPanel.setSelectedFoodTab(newTabIndex)
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