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

    useEffect(() => {
        ReactTooltip.rebuild()
    })

    ReactTooltip.rebuild()

    if (!applicationContext) {
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
    ReactTooltip.rebuild()

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
                    <Button onClick={() => setShowFoodSelector(!showFoodSelector)}
                            className={buttonClass}
                            data-tip={applicationStrings.tooltip_icon_newFoodItem[languageContext.language]}>
                        <FaPlusSquare/>
                    </Button>
                    <Button onClick={() => setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)}
                            className={buttonClass}
                            disabled={isMobileDevice()}
                            data-tip={applicationStrings.tooltip_icon_newFoodItemStack[languageContext.language]}>
                        <FaLayerGroup/>
                    </Button>
                    <Button onClick={() => onCloseAllTabs()}
                            disabled={deleteIconEnabled === false}
                            className={buttonClass}
                            data-tip={applicationStrings.tooltip_icon_removeAll[languageContext.language]}>
                        <FaTrash/>
                    </Button>
                </div>
                <ReactTooltip/>
            </div>
        </div>
    )

}