import {DirectCompareSelector} from "../foodselector/DirectCompareSelector";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import React, {useContext, useEffect, useState} from "react";
import ApplicationDataContextProvider, {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanel} from "./DirectCompareDataPanel";
import {applicationStrings} from "../../static/labels";
import {PATH_DIRECT_COMPARE, QUERYKEY_DATAPANEL_ITEMS, TAB_LIST} from "../../config/Constants";
import {makeDefaultSelectedFoodItem} from "../../service/FoodDataPanelService";
import {useLocation} from 'react-router-dom';
import {NotificationManager} from 'react-notifications'

export default function DirectCompareContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const location = useLocation();

    const initialFoodItem1 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem1
        : null

    const initialFoodItem2 = applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        ? applicationContext?.applicationData.directCompareDataPanel.selectedFoodItem2
        : null

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(initialFoodItem1)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(initialFoodItem2)

    const buildDataPanelPageFromURI = () => {
        let activePath = location.pathname
        if (activePath && activePath.includes(PATH_DIRECT_COMPARE)) {
            const mainPathIndex = activePath.indexOf(PATH_DIRECT_COMPARE)
            const datapage = activePath.substring(mainPathIndex + PATH_DIRECT_COMPARE.length + 1)

            if (!applicationContext || !datapage || !TAB_LIST.includes(datapage)) {
                return
            }

            if (window.location.search.length <= 3) {
                NotificationManager.error("Invalid query parameter")
                return
            }

            const query = window.location.search.substring(1)
            const equalOperator = query.indexOf("=")
            const key = query.substring(0, equalOperator)
            const value = query.substring(equalOperator + 1)

            if (key !== QUERYKEY_DATAPANEL_ITEMS || value.length < 1) {
                NotificationManager.error("Invalid query key or value")
                return
            }

            const foodItemIds = value.split("+")
            if (foodItemIds.length !== 2) {
                NotificationManager.error("Invalid value (expected 2 items)")
                return

            }

            applicationContext.applicationData.directCompareDataPanel.setSelectedDirectCompareDataPage(datapage)
            const foodItem1 = applicationContext.foodDataCorpus.foodItems.find(foodItem => foodItem.id === Number(foodItemIds[0]))
            const foodItem2 = applicationContext.foodDataCorpus.foodItems.find(foodItem => foodItem.id === Number(foodItemIds[1]))

            if (foodItem1 && foodItem2) {
                const foodClass1 = applicationContext.foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem1.foodClass)
                const foodClass2 = applicationContext.foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem1.foodClass)
                if (foodClass1 && foodClass2) {
                    const selectedFoodItem1 = makeDefaultSelectedFoodItem(foodItem1, foodClass1)
                    const selectedFoodItem2 = makeDefaultSelectedFoodItem(foodItem2, foodClass2)
                    if (selectedFoodItem1 && selectedFoodItem2) {
                        //applicationContext.applicationData.directCompareDataPanel.setSelectedDirectCompareItems(selectedFoodItem1, selectedFoodItem2)
                        setSelectedFoodItem1(selectedFoodItem1)
                        setSelectedFoodItem2(selectedFoodItem2)
                    }
                }
            }
        }
    }

    useEffect(() => {
        buildDataPanelPageFromURI()
    }, [])


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