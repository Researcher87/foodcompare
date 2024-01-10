import React, {useContext, useState} from 'react'

import {Button, Modal} from 'react-bootstrap'

import {NotificationManager} from 'react-notifications'
import 'react-notifications/lib/notifications.css';

import FoodSelector from "./FoodSelector";
import {applicationStrings} from "../../static/labels";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {CompositeFoodList} from "./CompositeFoodList";
import {initialFoodClassId, maximalPortionSize} from "../../config/ApplicationSetting";
import combineFoodItems from "../../service/calculation/FoodDataAggregationService";
import {FaQuestionCircle} from "react-icons/fa";
import {HelpModal} from "../HelpModal";
import {getHelpText} from "../../service/HelpService";
import ReactSelectOption from "../../types/ReactSelectOption";
import {MODE_EDIT} from "../../config/Constants";

export interface FoodSelectorModalProps {
    onHide: () => void,
    selectedFoodItemCallback: (selectedFoodItem: SelectedFoodItem) => void
    compositeSelector: boolean
    selectedFoodItem?: SelectedFoodItem,
    mode?: string
}


const FoodSelectorModal: React.FC<FoodSelectorModalProps> = (props: FoodSelectorModalProps) => {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const initialFoodItem = props.selectedFoodItem ? props.selectedFoodItem : null
    const initialCompositeList = props.selectedFoodItem && props.selectedFoodItem.compositeSubElements
        ? props.selectedFoodItem.compositeSubElements
        : []

    const [selectedFoodItem, setSelectedFoodItem] = useState<SelectedFoodItem | null>(initialFoodItem)
    const [compositeTitle, setCompositeTitle] = useState<string | null>(null)
    const [compositeList, setCompositeList] = useState<Array<SelectedFoodItem>>( initialCompositeList ?? [])
    const [showHelpModal, setShowHelpModal] = useState<boolean>(false)

    if (!applicationContext) {
        return <div/>
    }

    const updateSelectedFoodItem = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem(selectedFoodItem)
    }

    const updateCompositeTitle = (title: string): void => {
        setCompositeTitle(title)
    }

    const addCompositeElement = () => {
        if (selectedFoodItem !== null) {
            if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
                NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
                return;
            }

            const newList: Array<SelectedFoodItem> = [...compositeList]
            newList.push(selectedFoodItem)
            setCompositeList(newList)
        }
    }

    const deleteCompositeElement = (index: number) => {
        const newList: Array<SelectedFoodItem> = [...compositeList]
        newList.splice(index, 1)
        setCompositeList(newList)
    }

    const onSubmit = () => {
        if (props.compositeSelector) {
            onSubmitComposite()
        } else {
            onSubmitSingleItem()
        }
    }

    const onSubmitSingleItem = () => {
        if(props.mode === MODE_EDIT) {
            if(selectedFoodItem) {
                if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
                    NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
                    return
                }
                props.selectedFoodItemCallback(selectedFoodItem)
                props.onHide()
            }
            return;
        }

        const foodItemId = selectedFoodItem ? selectedFoodItem.foodItem.id : null
        if (foodItemId) {
            const existingItemInList = applicationContext?.applicationData.foodDataPanel.selectedFoodItems.find(foodItem => foodItem.id === foodItemId)

            if (existingItemInList) {
                NotificationManager.error(applicationStrings.message_error_existing_element[language])
                return
            }
        }

        if (!selectedFoodItem || !selectedFoodItem.foodItem || !selectedFoodItem.foodClass || !selectedFoodItem.portion) {
            NotificationManager.error(applicationStrings.message_error_incomplete_form[language])
        } else if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
            NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
        } else {
            props.selectedFoodItemCallback(selectedFoodItem)
            props.onHide()
        }
    }

    const onSubmitComposite = () => {
        const preferredSource = applicationContext.applicationData.preferredSource
        let aggregatedSelectedFoodItem = combineFoodItems(compositeList, preferredSource)

        if (compositeTitle !== null && compositeTitle.trim().length > 0) {
            const titleToShow = compositeTitle.length < 24
                ? compositeTitle.trim()
                : compositeTitle.substring(0, 21).trim() + "..."
            aggregatedSelectedFoodItem.title = titleToShow
        } else {
            aggregatedSelectedFoodItem.title = applicationStrings.input_compositelist_title[language]
        }

        if (!aggregatedSelectedFoodItem) {
            return
        }

        aggregatedSelectedFoodItem = {...aggregatedSelectedFoodItem, aggregated: true}
        props.selectedFoodItemCallback(aggregatedSelectedFoodItem)
        props.onHide()
    }

    const updateFoodSelectorConfig = (selectedCategory: ReactSelectOption | null, supplementData: boolean, combineData: boolean) => {
        if (applicationContext) {
            const currentSelectorSetting = applicationContext.applicationData.foodSelector
            if (selectedCategory !== currentSelectorSetting.selectedCategory || supplementData !== currentSelectorSetting.sourceSupplement
                || combineData !== currentSelectorSetting.sourceCombine) {
                applicationContext.setFoodSelectorConfig(selectedCategory, supplementData, combineData)
            }
        }
    }

    const onCancel = () => {
        props.onHide()
    }

    const onOpenHelpModal = () => {
        setShowHelpModal(true)
    }

    const title = props.compositeSelector ? applicationStrings.label_foodselector_composite[language] : applicationStrings.label_foodselector[language]
    const helpText = props.compositeSelector ? getHelpText(10, language) : getHelpText(9, language)

    return (
        <Modal size={'lg'} show={true} onHide={props.onHide} backdrop="static">
            <Modal.Header>
                <b>{title}</b>
            </Modal.Header>
            <Modal.Body>
                {showHelpModal && helpText !== null &&
                <HelpModal helpText={helpText} closeHelpModal={() => setShowHelpModal(false)}/>
                }
                <div>
                    {!props.compositeSelector ?
                        <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                      defaultFoodClass={initialFoodClassId}
                                      compositeSelector={false}
                                      selectedFoodItem={selectedFoodItem}
                                      updateFoodSelectorConfig={updateFoodSelectorConfig}
                                      mode={props.mode}
                        />
                        :
                        <div className={"container"}>
                            <div className={"row"}>
                                <div className={"col-6"}>
                                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                                  updateFoodSelectorConfig={updateFoodSelectorConfig}
                                                  defaultFoodClass={initialFoodClassId}
                                                  updateCompositeTitle={updateCompositeTitle}
                                                  compositeSelector={true}
                                    />
                                </div>
                                <div className={"col-6"}>
                                    <CompositeFoodList selectedFoodItems={compositeList}
                                                       deleteItem={deleteCompositeElement}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className={"justify-content-between"}>
                <div>
                    <Button className={"btn btn-secondary"} onClick={onOpenHelpModal}>
                        <FaQuestionCircle/>
                    </Button>
                </div>
                <div className={"d-flex d-row justify-content-end"}>
                    <Button className={"btn-secondary form-button"} onClick={onCancel}>
                        {applicationStrings.button_cancel[language]}
                    </Button>
                    {props.compositeSelector ?
                        <Button className={"form-button"}
                                onClick={onSubmit}
                                disabled={!compositeList || compositeList.length < 1}>
                            {applicationStrings.button_show[language]}
                        </Button>
                        :
                        <Button className={"form-button"} onClick={onSubmit}>
                            {applicationStrings.button_select[language]}
                        </Button>
                    }

                    {props.compositeSelector &&
                    <Button className={"form-button"} onClick={addCompositeElement}>
                        {applicationStrings.button_add[language]}
                    </Button>
                    }
                </div>
            </Modal.Footer>
        </Modal>
    )

}

export default FoodSelectorModal