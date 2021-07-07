import {DirectCompareSelector} from "../foodselector/DirectCompareSelector";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanel} from "./DirectCompareDataPanel";

export function DirectCompareContainer() {
    const applicationData = useContext(ApplicationDataContextStore)
    const {language, userLanguageChange} = useContext(LanguageContext)

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(null)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(null)

    if (applicationData === null) {
        return <div/>
    }

    const updateSelectedFoodItems = (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => {
        setSelectedFoodItem1(selectedFoodItem1)
        setSelectedFoodItem2(selectedFoodItem2)
    }

    return (
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-4"}>
                    <DirectCompareSelector updateSelectedFoodItems={updateSelectedFoodItems}/>
                </div>
                <div className={"col-8"}>
                    {selectedFoodItem1 !== null && selectedFoodItem2 !== null &&
                        <DirectCompareDataPanel selectedFoodItem1={selectedFoodItem1} selectedFoodItem2={selectedFoodItem2}/>
                    }
                </div>
            </div>
        </div>
    )

}