import React, {useContext, useState} from 'react'
import {Button} from 'react-bootstrap'
import {NotificationManager} from 'react-notifications'

import FoodSelectorModal from '../foodselector/FoodSelectorModal'
import {FaDownload, FaLayerGroup, FaPlusSquare, FaTrash, FaUpload} from "react-icons/fa";
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
import FoodDataPage from "./FoodDataPage";


interface FoodAnalyzerContainerProps {
    openSelectorModal?: boolean
    openCompositeSelectorModal?: boolean
    onNewFoodItemSelected: () => void
}

export default function FoodAnalyzerContainer(props: FoodAnalyzerContainerProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const { language } = useContext(LanguageContext)
    const history = useHistory()

    const showFoodSelectorInitialState = props.openSelectorModal === true
    const showCompositeFoodSelectorInitialState = props.openCompositeSelectorModal === true

    const [showFoodSelector, setShowFoodSelector] = useState<Boolean>(showFoodSelectorInitialState)
    const [showFoodAggregatedFoodSelector, setShowAggregatedFoodSelector] = useState<Boolean>(showCompositeFoodSelectorInitialState)

    if (!applicationContext) {
        return <div/>
    }

    const onOpenSelector = (aggregateSelector: boolean) => {
        if (aggregateSelector) {
            setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)
        } else {
            setShowFoodSelector(!showFoodSelector)
        }
    }

    const onOpenFileUpload = async () => {
        const startUpload = () => {
            const uploadElement = document.getElementById('importFileInput')
            if (uploadElement) {
                uploadElement.click();
            }
        }

        if(applicationContext.applicationData.foodDataPanel?.selectedFoodItems?.length > 0) {
            if (await confirmAction(
                applicationStrings.message_import_question[language],
                applicationStrings.button_yes[language],
                applicationStrings.button_no[language],
                {}
            )) {
                startUpload()
            }
        } else {
            startUpload()
        }
    }


    const onImport = (event) => {
        const files = event.target.files;
        if (!files || files.lenth === 0) {
            return;
        }

        const file = files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => {
            const content = fileReader.result as string;
            const expectedStartOfContent = "{\"selectedFoodItems\":[";
            if (content && content.startsWith(expectedStartOfContent)) {
                try {
                    let foodDataPanelData = JSON.parse(content);
                    foodDataPanelData = {
                        ...foodDataPanelData, selectedFoodItems: foodDataPanelData.selectedFoodItems.map(item => {
                            return {
                                ...item,
                                component: <FoodDataPage key={`page component ${item.id}`} selectedFoodItem={item}/>
                            }
                        })
                    }
                    applicationContext.setFoodDataPanelData.setCompleteData(foodDataPanelData);
                } catch(e) {
                    NotificationManager.error(applicationStrings.message_import_error_invalidfile[language])
                }
            } else {
                NotificationManager.error(applicationStrings.message_import_error_parse[language])
            }
        }
    }


    const onExport = () => {
        let dataObj = applicationContext.applicationData.foodDataPanel;

        /*
         * We need to remove the component data object from each item, as it contains the food item object again
         * (cyclic reference), causing errors in the serializiation process. On import, we have to re-define the
         * components again.
         */
        dataObj = {
            ...dataObj, selectedFoodItems: dataObj.selectedFoodItems.map(item => {
                return {...item, component: undefined}
            })
        }

        try {
            const fileContent = JSON.stringify(dataObj);

            // Create pseudo-element representing a download element
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
            element.setAttribute('download', "food-compare_dataexport.json");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch(e) {
            NotificationManager.error(applicationStrings.message_export_error[language])
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
            selectedFoodItem, applicationContext.foodDataCorpus.foodNames, language)

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
            applicationStrings.confirm_close_all_tabs[language],
            applicationStrings.button_yes[language],
            applicationStrings.button_no[language],
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
    const buttonClass = isMobileDevice() ? "btn m-2" : "btn mb-4 foodanalyzer-button"

    const divButtonClass = isMobileDevice() ? "d-flex flex-row mb-4" : "d-flex flex-column align-items-center"

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
                <div className={divButtonClass}>
                    <Button onClick={() => onOpenSelector(false)}
                            className={buttonClass}
                            data-for={"fa-btn-add"}
                            data-tip={applicationStrings.tooltip_icon_newFoodItem[language]}>
                        <FaPlusSquare/>
                        <ReactTooltip id={"fa-btn-add"} globalEventOff="click"/>
                    </Button>
                    <Button onClick={() => onOpenSelector(true)}
                            className={buttonClass}
                            disabled={isMobileDevice()}
                            data-for={"fa-btn-aggregate"}
                            data-tip={applicationStrings.tooltip_icon_newFoodItemStack[language]}>
                        <FaLayerGroup/>
                        <ReactTooltip id={"fa-btn-aggregate"} globalEventOff="click"/>
                    </Button>
                    <Button onClick={() => onExport()}
                            className={buttonClass}
                            disabled={isMobileDevice()}
                            data-for={"fa-btn-export"}
                            data-tip={applicationStrings.tooltip_icon_export[language]}>
                        <FaDownload/>
                        <ReactTooltip id={"fa-btn-export"} globalEventOff="click"/>
                    </Button>
                    <input type="file" id="importFileInput" style={{visibility: "hidden"}} accept={".json"}
                           onChange={onImport}/>
                    <Button onClick={() => onOpenFileUpload()}
                            className={buttonClass}
                            disabled={isMobileDevice()}
                            data-for={"fa-btn-import"}
                            data-tip={applicationStrings.tooltip_icon_import[language]}>
                        <FaUpload/>
                        <ReactTooltip id={"fa-btn-import"} globalEventOff="click"/>
                    </Button>
                    <Button onClick={() => onCloseAllTabs()}
                            disabled={deleteIconEnabled === false}
                            className={buttonClass}
                            data-for={"fa-btn-close"}
                            data-tip={applicationStrings.tooltip_icon_removeAll[language]}>
                        <FaTrash/>
                        <ReactTooltip id={"fa-btn-close"}/>
                    </Button>
                </div>
            </div>
        </div>
    )

}