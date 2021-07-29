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
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";

interface FoodAnalyzerContainerProps {
    onNewFoodItemSelected: () => void
}

export default function FoodAnalyzerContainer(props: FoodAnalyzerContainerProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const [showFoodSelector, setShowFoodSelector] = useState<Boolean>(false)
    const [showFoodAggregatedFoodSelector, setShowAggregatedFoodSelector] = useState<Boolean>(false)

    if(!applicationContext) {
        return <div/>
    }

    const onHide = (): void => {
        setShowFoodSelector(false)
        setShowAggregatedFoodSelector(false)
    }

    const onSelectFoodItemSubmit = (selectedFoodItem: SelectedFoodItem): void => {
        if (applicationContext === null) {
            return
        }

        const selectedFoodItemWithComponent = makeFoodDataPanelComponent(
            selectedFoodItem, applicationContext.foodDataCorpus.foodNames, languageContext.language)

        if(selectedFoodItemWithComponent !== null) {
            applicationContext.applicationData.foodDataPanel.addItemToFoodDataPanel(selectedFoodItemWithComponent)
        }

        if (applicationContext?.debug) {
            console.log('FoodAnalyzerContainer: Set new selected item and execute callback. Selected item = ', selectedFoodItemWithComponent)
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
            applicationContext?.applicationData.foodDataPanel.removeAllItemsFromFoodDataPanel()
        }
    }

    if (applicationContext?.debug) {
        console.log('FoodAnalyzerContainer: Render')
    }

    const selectedFoodItems = applicationContext?.applicationData.foodDataPanel.selectedFoodItems
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