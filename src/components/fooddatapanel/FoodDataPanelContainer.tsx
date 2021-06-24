import FoodAnalyzerContainer from "./FoodAnalyzerContainer";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import TabContainer from "./TabContainer";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";


export default function FoodDataPanelContainer() {
    const applicationData = useContext(ApplicationDataContextStore)

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
        const newTabIndex = applicationData.applicationData.foodDataPanel.selectedFoodItems.length -1
        applicationData.setSelectedTab(newTabIndex)
    }

    const selectedTabIndex =  applicationData.applicationData.foodDataPanel.selectedFoodItemIndex

    if(!(selectedTabIndex >= 0)) {
        return <div/>
    }

    const selectedFoodItem = applicationData.applicationData.foodDataPanel.selectedFoodItems[selectedTabIndex]

    if(applicationData.debug) {
        console.log('FoodDataPanelContainer: Render, selected food item = ', selectedFoodItem)
    }


    return <div>
        {selectedFoodItem !== null &&
        <div className="container-fluid" style={{paddingTop: "20px"}}>
            <div className="row">
                <div className={"col-2"}>
                    <FoodAnalyzerContainer onNewFoodItemSelected={onNewFoodItemSelected}/>
                    <div>Platzhalter</div>
                </div>
                <div className="col-10" style={{maxWidth: "1100px", marginTop: "-10px"}}>
                    {selectedFoodItems && selectedFoodItems.length > 0 &&
                    <div>
                        <TabContainer indexToSet={selectedTabIndex} onTabChange={onTabChange}/>
                    </div>
                    }
                </div>
            </div>
        </div>
        }
    </div>


}