import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";


export default function FoodDataPanelContainer() {
    const applicationData = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    if (!applicationData) {
        return <div/>
    }

    const selectedFoodItems = applicationData.applicationData.foodDataPanel.selectedFoodItems

    const onTabChange = (foodId) => {
        for (let i = 0; i < selectedFoodItems.length; i++) {
            if (selectedFoodItems[i].id === foodId) {
                applicationData.setSelectedTab(i)
            }
        }
    }

    const onNewFoodItemSelected = (): void => {
        const newTabIndex = applicationData.applicationData.foodDataPanel.selectedFoodItems.length - 1
        applicationData.setSelectedTab(newTabIndex)
    }

    const selectedTabIndex = applicationData.applicationData.foodDataPanel.selectedFoodItemIndex

    if (!(selectedTabIndex >= 0)) {
        return <div/>
    }

    const selectedFoodItem = applicationData.applicationData.foodDataPanel.selectedFoodItems[selectedTabIndex]

    if (applicationData.debug) {
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