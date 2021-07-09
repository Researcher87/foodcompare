import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";


export default function FoodDataPanelContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

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