import {DirectCompareSelector} from "../foodselector/DirectCompareSelector";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import React, {useContext, useState} from "react";
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanel} from "./DirectCompareDataPanel";
import {applicationStrings} from "../../static/labels";

export default function DirectCompareContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const initialFoodItem1 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        : null

    const initialFoodItem2 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        : null

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(initialFoodItem1)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(initialFoodItem2)


    if (applicationContext === null || !applicationContext.ready) {
        return <div/>
    }

    const updateSelectedFoodItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
        setSelectedFoodItem1(selectedFoodItem1)
        setSelectedFoodItem2(selectedFoodItem2)
        applicationContext.applicationData.directCompareDataPanel.setSelectedDirectCompareItems(selectedFoodItem1, selectedFoodItem2)
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