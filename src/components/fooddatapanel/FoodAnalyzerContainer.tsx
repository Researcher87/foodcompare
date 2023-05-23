import React, {useContext, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

import FoodSelectorModal from '../foodselector/FoodSelectorModal'
import {FaLayerGroup, FaPlusSquare, FaTrash} from "react-icons/fa";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {confirmAction} from "../ConfirmationDialog";
import ReactTooltip from "react-tooltip";
import {useHistory} from 'react-router-dom';
import {PATH_FOODDATA_PANEL} from '../../config/Constants';
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import {isMobileDevice} from "../../service/WindowDimension";

interface FoodAnalyzerContainerProps {
    openSelectorModal?: boolean
    openCompositeSelectorModal?: boolean
    onNewFoodItemSelected: () => void
}

export default function FoodAnalyzerContainer(props: FoodAnalyzerContainerProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const history = useHistory()

    const showFoodSelectorInitialState = props.openSelectorModal === true
    const showCompositeFoodSelectorInitialState = props.openCompositeSelectorModal === true

    const [showFoodSelector, setShowFoodSelector] = useState<Boolean>(showFoodSelectorInitialState)
    const [showFoodAggregatedFoodSelector, setShowAggregatedFoodSelector] = useState<Boolean>(showCompositeFoodSelectorInitialState)

    if (!applicationContext) {
        return <div/>
    }

    const onOpenSelector = (aggregateSelector: boolean) => {
        if(aggregateSelector) {
            setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)
        } else {
            setShowFoodSelector(!showFoodSelector)
        }
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

        if (selectedFoodItemWithComponent !== null) {
            applicationContext.setFoodDataPanelData.addItemToFoodDataPanel(selectedFoodItemWithComponent)
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
            history.push(PATH_FOODDATA_PANEL)
            applicationContext?.setFoodDataPanelData.removeAllItemsFromFoodDataPanel()
        }
    }

    if (applicationContext?.debug) {
        console.log('FoodAnalyzerContainer: Render')
    }

    const selectedFoodItems = applicationContext?.applicationData.foodDataPanel.selectedFoodItems
    const deleteIconEnabled = selectedFoodItems && selectedFoodItems.length > 0
    const buttonClass = isMobileDevice() ? "btn mb-4" : "btn mb-4 foodanalyzer-button"

    return (
        <div className={"foodanalyzer-buttonbar"}>
            <div>
                {showFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit}
                                   compositeSelector={false}/>
                }
                {showFoodAggregatedFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit}
                                   compositeSelector={true}/>
                }
                <div className={"d-flex flex-column align-items-center"}>
                    <Button onClick={() => onOpenSelector(false)}
                            className={buttonClass}
                            data-for={"fa-btn-add"}
                            data-tip={applicationStrings.tooltip_icon_newFoodItem[languageContext.language]}>
                        <FaPlusSquare/>
                        <ReactTooltip id={"fa-btn-add"} globalEventOff="click"/>
                    </Button>
                    <Button onClick={() => onOpenSelector(true)}
                            className={buttonClass}
                            disabled={isMobileDevice()}
                            data-for={"fa-btn-aggregate"}
                            data-tip={applicationStrings.tooltip_icon_newFoodItemStack[languageContext.language]}>
                        <FaLayerGroup/>
                        <ReactTooltip id={"fa-btn-aggregate"} globalEventOff="click"/>
                    </Button>
                    <Button onClick={() => onCloseAllTabs()}
                            disabled={deleteIconEnabled === false}
                            className={buttonClass}
                            data-for={"fa-btn-close"}
                            data-tip={applicationStrings.tooltip_icon_removeAll[languageContext.language]}>
                        <FaTrash/>
                        <ReactTooltip id={"fa-btn-close"}/>
                    </Button>
                </div>
            </div>
        </div>
    )

}