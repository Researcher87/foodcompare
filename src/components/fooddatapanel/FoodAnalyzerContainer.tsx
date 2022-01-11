import React, {useContext, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

import FoodSelectorModal from '../foodselector/FoodSelectorModal'
import {FaLayerGroup, FaPlusSquare, FaTrash} from "react-icons/all";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {confirmAction} from "../ConfirmationDialog";
import ReactTooltip from "react-tooltip";
import {useHistory} from 'react-router-dom';
import {PATH_FOODDATA_PANEL} from '../../config/Constants';
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import {isNarrowScreen, useWindowDimension} from "../../service/WindowDimension";

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

    let windowSize = useWindowDimension()

    useEffect(() => {
        ReactTooltip.rebuild()
    })
    
    ReactTooltip.rebuild()

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

    console.log('Window size:', windowSize)

    const buttonRowClass = isNarrowScreen(windowSize) ? "d-flex flex-column align-items-center mr-4" : "d-flex flex-row justify-content-center"
    const buttonRowStyle = isNarrowScreen(windowSize) ? {paddingTop: "16px", marginLeft: "16px"} : {marginLeft: "30px", marginRight: "30px", paddingTop: "16px"}
    const buttonClass = isNarrowScreen(windowSize) ? "btn mb-4" : "btn"
    const buttonStyle = isNarrowScreen(windowSize) ? {marginRight: "32px"} : {marginRight: "24px"}

    return (
        <div>
            <div>
                {showFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit} compositeSelector={false}/>
                }
                { showFoodAggregatedFoodSelector &&
                <FoodSelectorModal onHide={onHide} selectedFoodItemCallback={onSelectFoodItemSubmit} compositeSelector={true}/>
                }
                <div className={buttonRowClass} style={buttonRowStyle}>
                    <Button onClick={() => setShowFoodSelector(!showFoodSelector)}
                            className={buttonClass}
                            style = {buttonStyle}
                            data-tip={applicationStrings.tooltip_icon_newFoodItem[languageContext.language]}>
                        <FaPlusSquare/>
                    </Button>
                    <Button onClick={() => setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)}
                            className={buttonClass}
                            style = {buttonStyle}
                            data-tip={applicationStrings.tooltip_icon_newFoodItemStack[languageContext.language]}>
                        <FaLayerGroup/>
                    </Button>
                    <Button onClick={() => onCloseAllTabs()}
                            disabled={deleteIconEnabled === false}
                            className={buttonClass}
                            style = {buttonStyle}
                            data-tip={applicationStrings.tooltip_icon_removeAll[languageContext.language]}>
                        <FaTrash/>
                    </Button>
                </div>
                <ReactTooltip/>
            </div>
        </div>
    )

}