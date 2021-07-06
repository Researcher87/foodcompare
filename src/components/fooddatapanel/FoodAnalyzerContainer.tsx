import React, {useContext, useState} from 'react'
import {Button} from 'react-bootstrap'

import FoodSelectorModal from '../foodselector/FoodSelectorModal'
import {FaLayerGroup, FaPlusSquare, FaTrash} from "react-icons/all";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import FoodDataPage from "./FoodDataPage";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {confirmAction} from "../ConfirmationDialog";
import ReactTooltip from "react-tooltip";

interface FoodAnalyzerContainerProps {
    onNewFoodItemSelected: () => void
}

export default function FoodAnalyzerContainer(props: FoodAnalyzerContainerProps) {
    const applicationData = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const [showFoodSelector, setShowFoodSelector] = useState<Boolean>(false)
    const [showFoodAggregatedFoodSelector, setShowAggregatedFoodSelector] = useState<Boolean>(false)

    const onHide = (): void => {
        setShowFoodSelector(false)
        setShowAggregatedFoodSelector(false)
    }

    const onSelectFoodItemSubmit = (selectedFoodItem: SelectedFoodItem): void => {
        if (applicationData === null) {
            return
        }

        let foodName
        if(selectedFoodItem.foodItem.nameId) {
            foodName = getNameFromFoodNameList(applicationData.foodDataCorpus.foodNames,
                selectedFoodItem.foodItem.nameId, languageContext.language)
        } else {
            foodName = 'Individual'
        }

        if (foodName === null) {
            console.error('No food name available.')
            return
        }

        selectedFoodItem.component = <FoodDataPage selectedFoodItem={selectedFoodItem}/>
        selectedFoodItem.tab = foodName
        selectedFoodItem.id = selectedFoodItem.foodItem.id
        applicationData?.addItemToFoodDataPanel(selectedFoodItem)

        if (applicationData?.debug) {
            console.log('FoodAnalyzerContainer: Set new selected item and execute callback. Selected item = ', selectedFoodItem)
        }

        props.onNewFoodItemSelected()
    }

    const onCloseAllTabs = async () => {
        if (await confirmAction(
            applicationStrings.confirm_close_all_tabs[languageContext.language],
            applicationStrings.button_yes[languageContext.language],
            applicationStrings.button_no[languageContext.language],
            {}
        )) {
            applicationData?.removeAllItemsFromFoodDataPanel()
        }
    }

    if (applicationData?.debug) {
        console.log('FoodAnalyzerContainer: Render')
    }

    const selectedFoodItems = applicationData?.applicationData.foodDataPanel.selectedFoodItems
    const deleteIconEnabled = selectedFoodItems && selectedFoodItems.length > 0

    ReactTooltip.rebuild()

    return (
        <div>
            <div>
                {showFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit} compositeSelector={false}/>
                }
                { showFoodAggregatedFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit} compositeSelector={true}/>
                }
                <div className={"text-center"} style={{paddingTop: "16px"}}>
                    <Button onClick={() => setShowFoodSelector(!showFoodSelector)}
                            className={"btn"}
                            style={{marginRight: "12px"}}
                            data-tip={applicationStrings.tooltip_icon_newFoodItem[languageContext.language]}>
                        <FaPlusSquare/>
                    </Button>
                    <Button onClick={() => setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)}
                            className={"btn"}
                            style={{marginRight: "12px"}}
                            data-tip={applicationStrings.tooltip_icon_newFoodItemStack[languageContext.language]}>
                        <FaLayerGroup/>
                    </Button>
                    <Button onClick={() => onCloseAllTabs()}
                            disabled={deleteIconEnabled === false}
                            data-tip={applicationStrings.tooltip_icon_removeAll[languageContext.language]}>
                        <FaTrash/>
                    </Button>
                </div>
            </div>
        </div>
    )

}