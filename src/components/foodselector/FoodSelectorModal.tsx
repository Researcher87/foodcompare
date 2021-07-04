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
import {maximalPortionSize} from "../../config/ApplicationSetting";
import combineFoodItems from "../../service/FoodDataAggregationService";

export interface FoodSelectorModalProps {
    onHide: () => void,
    selectedFoodItemCallback: (selectedFoodItem: SelectedFoodItem) => void
    compositeSelector: boolean
}


const FoodSelectorModal: React.FC<FoodSelectorModalProps> = (props: FoodSelectorModalProps) => {
    const [showModal, setShowModal] = useState<Boolean>(true)
    const [selectedFoodItem, setSelectedFoodItem] = useState<SelectedFoodItem | null>(null)
    const [compositeList, setCompositeList] = useState<Array<SelectedFoodItem>>([])

    const applicationData = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    if (!applicationData) {
        return <div/>
    }

    const updateSelectedFoodItem = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem(selectedFoodItem)
    }

    const addCompositeElement = () => {
        if (selectedFoodItem !== null) {
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
        const foodItemId = selectedFoodItem ? selectedFoodItem.foodItem.id : null
        if (foodItemId) {
            const existingItemInList = applicationData?.applicationData.foodDataPanel.selectedFoodItems.find(foodItem => foodItem.id === foodItemId)

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
        const aggregatedSelectedFoodItem = combineFoodItems(compositeList)
        console.log('Composite:', aggregatedSelectedFoodItem)

        if(!aggregatedSelectedFoodItem) {
            console.error('Error while creating aggregated food item.')
        }

        props.selectedFoodItemCallback(aggregatedSelectedFoodItem)
        props.onHide()
    }

    const title = props.compositeSelector ? applicationStrings.label_foodselector_composite[language] : applicationStrings.label_foodselector[language]

    return (
        <Modal size={'lg'} show={showModal} onHide={props.onHide}>
            <Modal.Header>
                <b>{title}</b>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {!props.compositeSelector ?
                        <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem} compositeSelector={false}/>
                        :
                        <div className={"container"}>
                            <div className={"row"}>
                                <div className={"col-6"}>
                                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                                  compositeSelector={true}/>
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
            <Modal.Footer>
                <div className={"container-fluid"}>
                    {props.compositeSelector ?
                        <Button className={"form-button float-end"}
                                onClick={onSubmit}
                                disabled={!compositeList || compositeList.length < 1}>
                            {applicationStrings.button_show[language]}
                        </Button>
                        :
                        <Button className={"form-button float-end"} onClick={onSubmit}>
                            {applicationStrings.button_select[language]}
                        </Button>
                    }

                    {props.compositeSelector &&
                    <Button className={"form-button float-end"} onClick={addCompositeElement}>
                        {applicationStrings.button_add[language]}
                    </Button>
                    }

                    <Button className={"btn-secondary form-button float-end"} onClick={() => setShowModal(false)}>
                        {applicationStrings.button_cancel[language]}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )

}

export default FoodSelectorModal