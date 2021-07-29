import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext, useEffect} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {PATH_FOODDATA_PANEL, PORTION_KEY_100, QUERYKEY_DATAPANEL_ITEMS, TAB_LIST} from "../../config/Constants";
import {useLocation} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'
import {makeDefaultSelectedFoodItem, makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";


export default function FoodDataPanelContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const location = useLocation();

    const buildDataPanelPageFromURI = () => {
        let activePath = location.pathname
        if(activePath && activePath.includes(PATH_FOODDATA_PANEL)) {
            const mainPathIndex = activePath.indexOf(PATH_FOODDATA_PANEL)
            const datapage = activePath.substring(mainPathIndex+PATH_FOODDATA_PANEL.length+1)

            if(!applicationContext || !datapage || !TAB_LIST.includes(datapage)) {
                return
            }

            if(window.location.search.length <= 3) {
                NotificationManager.error("Invalid query parameter")
                return
            }

            const query = window.location.search.substring(1)
            const equalOperator = query.indexOf("=")
            const key = query.substring(0, equalOperator)
            const value = query.substring(equalOperator+1)

            if(key !== QUERYKEY_DATAPANEL_ITEMS || value.length < 1) {
                NotificationManager.error("Invalid query key or value")
                return
            }

            const foodItemIds = value.split("+")
            applicationContext.applicationData.foodDataPanel.setSelectedDataPage(datapage)

            foodItemIds.forEach(foodItemId => {
                const foodItem = applicationContext.foodDataCorpus.foodItems.find(foodItem => foodItem.id === Number(foodItemId))
                if(foodItem) {
                    const foodClass = applicationContext.foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem.foodClass)
                    if(foodClass) {
                        const selectedFoodItem = makeDefaultSelectedFoodItem(foodItem, foodClass)
                        const selectedFoodItemWithComponent = makeFoodDataPanelComponent(selectedFoodItem,
                            applicationContext.foodDataCorpus.foodNames, languageContext.language)
                        if(selectedFoodItemWithComponent) {
                            applicationContext.applicationData.foodDataPanel.addItemToFoodDataPanel(selectedFoodItemWithComponent)
                        }
                    }
                }
            })

        }
    }

    useEffect(() => {
        buildDataPanelPageFromURI()
    }, [applicationContext?.foodDataCorpus.foodItems])

    if (!applicationContext || !applicationContext.ready) {
        return <div/>
    }


    const selectedFoodItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems

    const onTabChange = (foodId) => {
        for (let i = 0; i < selectedFoodItems.length; i++) {
            if (selectedFoodItems[i].id === foodId) {
                applicationContext.applicationData.foodDataPanel.setSelectedFoodTab(i)
            }
        }
    }

    const onNewFoodItemSelected = (): void => {
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