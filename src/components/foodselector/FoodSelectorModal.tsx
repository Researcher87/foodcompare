import React, {useContext, useState} from 'react'

import {Button, Modal} from 'react-bootstrap'

import {NotificationManager, NotificationContainer} from 'react-notifications'
import 'react-notifications/lib/notifications.css';

import FoodSelector from "./FoodSelector";
import {applicationStrings} from "../../static/labels";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {max_portion} from "../../config/ChartConfig";
import {maximalPortionSize} from "../../config/ApplicationSetting";

interface FoodSelectorModalProps {
    onHide: () => void,
    selectedFoodItemCallback: (selectedFoodItem: SelectedFoodItem) => void
}


const FoodSelectorModal: React.FC<FoodSelectorModalProps> = (props: FoodSelectorModalProps) => {
    const [showModal, setShowModal] = useState<Boolean>(true)
    const [selectedFoodItem, setSelectedFoodItem] = useState<SelectedFoodItem | null>(null)

    const applicationData = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    if (!applicationData) {
        return <div/>
    }

    const updateSelectedFoodItem = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem(selectedFoodItem)
    }

    const onSubmit = () => {
        const foodItemId = selectedFoodItem ? selectedFoodItem.foodItem.id : null
        if (foodItemId) {
            const existingItemInList = applicationData?.applicationData.foodDataPanel.selectedFoodItems.find(foodItem => foodItem.id === foodItemId)

            if(existingItemInList) {
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

    return (
        <Modal size={'lg'} show={showModal} onHide={props.onHide}>
            <Modal.Header>
                <b>{applicationStrings.label_foodselector[language]}</b>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className={"container-fluid"}>
                    <Button className={"form-button float-end"} onClick={onSubmit}>
                        {applicationStrings.button_select[language]}
                    </Button>
                    <Button className={"btn-secondary form-button float-end"} onClick={() => setShowModal(false)}>
                        {applicationStrings.button_cancel[language]}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )

}

export default FoodSelectorModal