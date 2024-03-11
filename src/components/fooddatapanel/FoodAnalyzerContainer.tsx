import React, {useContext, useState} from 'react'
import {Button} from 'react-bootstrap'
import {NotificationManager} from 'react-notifications'

import FoodSelectorModal from '../foodselector/FoodSelectorModal'
import {FaDownload, FaEdit, FaLayerGroup, FaPlusSquare, FaTable, FaTrash, FaUpload} from "react-icons/fa";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {confirmAction} from "../ConfirmationDialog";
import ReactTooltip from "react-tooltip";
import {useHistory} from 'react-router-dom';
import {MODE_EDIT, MODE_NEW, PATH_FOODDATA_PANEL} from '../../config/Constants';
import {makeFoodDataPanelComponent} from "../../service/FoodDataPanelService";
import {isMobileDevice} from "../../service/WindowDimension";
import FoodDataPage from "./FoodDataPage";
import {OverallView} from "./OverallView";

const {compress, decompress} = require('shrink-string')


interface FoodAnalyzerContainerProps {
    openSelectorModal?: boolean
    openCompositeSelectorModal?: boolean
    onNewFoodItemSelected: () => void
}

export default function FoodAnalyzerContainer(props: FoodAnalyzerContainerProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)
    const history = useHistory()

    const showFoodSelectorInitialState = props.openSelectorModal === true
    const showCompositeFoodSelectorInitialState = props.openCompositeSelectorModal === true

    const [showFoodSelector, setShowFoodSelector] = useState<Boolean>(showFoodSelectorInitialState)
    const [showFoodAggregatedFoodSelector, setShowAggregatedFoodSelector] = useState<Boolean>(showCompositeFoodSelectorInitialState)
    const [showOverallView, setShowOverallView] = useState<Boolean>(false)
    const [foodSelectorEditMode, setFoodSelectorEditMode] = useState<Boolean>(false)

    if (!applicationContext) {
        return <div/>
    }

    const onAddNewFoodItem = (aggregateSelector: boolean) => {
        setFoodSelectorEditMode(false)
        if (aggregateSelector) {
            setShowAggregatedFoodSelector(!showFoodAggregatedFoodSelector)
        } else {
            setShowFoodSelector(!showFoodSelector)
        }
    }

    const onEditSelectedFoodItem = () => {
        const {selectedFoodItems, selectedFoodItemIndex} = applicationContext.applicationData.foodDataPanel;
        const selectedFoodItem = selectedFoodItems[selectedFoodItemIndex];

        setFoodSelectorEditMode(true)
        if (selectedFoodItem.aggregated) {
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

        if (applicationContext.applicationData.foodDataPanel?.selectedFoodItems?.length > 0) {
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

    const onOpenOverallView = () => {
        setShowOverallView(!showOverallView)
    }

    const onImport = (event) => {
        const files = event.target.files;
        if (!files || files.lenth === 0) {
            return;
        }

        const file = files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = async () => {
            const content = fileReader.result as string;
            if (!content) {
                return;
            }
            const decompressedContent = await decompress(content)
            const expectedStartOfContent = "{\"selectedFoodItems\":[";
            if (decompressedContent.startsWith(expectedStartOfContent)) {
                try {
                    let foodDataPanelData = JSON.parse(decompressedContent);
                    foodDataPanelData = {
                        ...foodDataPanelData, selectedFoodItems: foodDataPanelData.selectedFoodItems.map(item => {
                            return {
                                ...item,
                                component: <FoodDataPage key={`page component ${item.id}`} selectedFoodItem={item}/>
                            }
                        })
                    }
                    applicationContext.setFoodDataPanelData.setCompleteData(foodDataPanelData);
                } catch (e) {
                    NotificationManager.error(applicationStrings.message_import_error_invalidfile[language])
                }
            } else {
                NotificationManager.error(applicationStrings.message_import_error_parse[language])
            }
        }
    }


    const onExport = async () => {
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
            const compressedContent = await compress(fileContent)

            // Create pseudo-element representing a download element
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(compressedContent));
            element.setAttribute('download', "food-compare_dataexport.json");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } catch (e) {
            NotificationManager.error(applicationStrings.message_export_error[language])
        }

    }

    const onHideSelector = (): void => {
        setShowFoodSelector(false)
        setShowAggregatedFoodSelector(false)
    }

    const onHideOverallView = (): void => {
        setShowOverallView(false)
    }

    const onSelectFoodItemSubmit = (selectedFoodItem: SelectedFoodItem): void => {
        if (applicationContext === null) {
            return
        }

        const selectedIndex = applicationContext.applicationData.foodDataPanel.selectedFoodItemIndex

        if (foodSelectorEditMode) {
            // ToDo: Anpassen bei aggregated -> composite list clonen
            applicationContext.setFoodDataPanelData.setItemOfFoodDataPanel(selectedFoodItem, selectedIndex)
        } else {
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

    const {selectedFoodItems, selectedFoodItemIndex} = applicationContext.applicationData.foodDataPanel
    const isFoodItemSelected = selectedFoodItems && selectedFoodItems.length > 0
    const buttonClass = isMobileDevice() ? "btn m-2" : "btn foodanalyzer-button-normal"
    const buttonClassWithExtraSpace = isMobileDevice() ? "btn m-2" : "btn foodanalyzer-button-separator"

    const divButtonClass = "d-flex flex-column align-items-left"

    const selectedFoodItem = isFoodItemSelected ? selectedFoodItems[selectedFoodItemIndex] : undefined
    const existingFoodItem = foodSelectorEditMode ? selectedFoodItem : undefined
    const mode = foodSelectorEditMode ? MODE_EDIT : MODE_NEW

    return (
        <div className={"foodanalyzer-buttonbar"}>
            {showFoodSelector &&
                <FoodSelectorModal onHide={onHideSelector}
                                   selectedFoodItemCallback={onSelectFoodItemSubmit}
                                   compositeSelector={false}
                                   selectedFoodItem={existingFoodItem}
                                   mode={mode}
                />
            }
            {showFoodAggregatedFoodSelector &&
                <FoodSelectorModal onHide={onHideSelector}
                                   selectedFoodItemCallback={onSelectFoodItemSubmit}
                                   compositeSelector={true}
                                   selectedFoodItem={existingFoodItem}
                                   mode={mode}
                />
            }
            {showOverallView &&
                <OverallView onHide={onHideOverallView} />
            }
            <div className={divButtonClass}>
                <Button onClick={() => onAddNewFoodItem(false)}
                        className={buttonClass}
                        data-for={"fa-btn-add"}
                        data-tip={applicationStrings.tooltip_icon_newFoodItem[language]}>
                    <FaPlusSquare/>
                    <ReactTooltip id={"fa-btn-add"} globalEventOff="click"/>
                </Button>
                <Button onClick={() => onAddNewFoodItem(true)}
                        className={buttonClass}
                        disabled={isMobileDevice()}
                        data-for={"fa-btn-aggregate"}
                        data-tip={applicationStrings.tooltip_icon_newFoodItemStack[language]}>
                    <FaLayerGroup/>
                    <ReactTooltip id={"fa-btn-aggregate"} globalEventOff="click"/>
                </Button>
                <Button onClick={() => onEditSelectedFoodItem()}
                        className={buttonClassWithExtraSpace}
                        disabled={!isFoodItemSelected}
                        data-for={"fa-btn-edit"}
                        data-tip={applicationStrings.tooltip_icon_editFoodItem[language]}>
                    <FaEdit/>
                    <ReactTooltip id={"fa-btn-edit"} globalEventOff="click"/>
                </Button>
                <Button onClick={() => onExport()}
                        className={buttonClass}
                        disabled={!isFoodItemSelected || isMobileDevice()}
                        data-for={"fa-btn-export"}
                        data-tip={applicationStrings.tooltip_icon_export[language]}>
                    <FaDownload/>
                    <ReactTooltip id={"fa-btn-export"} globalEventOff="click"/>
                </Button>
                <input type="file"
                       id="importFileInput"
                       style={{visibility: "hidden", maxWidth: "1px", maxHeight: "1px"}}
                       accept={".json"}
                       onChange={onImport}/>
                <Button onClick={() => onOpenFileUpload()}
                        className={buttonClass}
                        disabled={isMobileDevice()}
                        data-for={"fa-btn-import"}
                        data-tip={applicationStrings.tooltip_icon_import[language]}>
                    <FaUpload/>
                    <ReactTooltip id={"fa-btn-import"} globalEventOff="click"/>
                </Button>
                <Button onClick={() => onOpenOverallView()}
                        className={buttonClassWithExtraSpace}
                        disabled={isMobileDevice() || !isFoodItemSelected || selectedFoodItems.length <= 1}
                        data-for={"fa-btn-overallview"}
                        data-tip={applicationStrings.tooltip_icon_overallView[language]}>
                    <FaTable/>
                    <ReactTooltip id={"fa-btn-overallview"} globalEventOff="click"/>
                </Button>
                <Button onClick={() => onCloseAllTabs()}
                        disabled={!isFoodItemSelected}
                        className={buttonClass + " btn-secondary"}
                        data-for={"fa-btn-close"}
                        data-tip={applicationStrings.tooltip_icon_removeAll[language]}>
                    <FaTrash/>
                    <ReactTooltip id={"fa-btn-close"}/>
                </Button>
            </div>
        </div>
    )

}