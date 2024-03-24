import React, {useContext, useState} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {Button} from "react-bootstrap";
import {FaEdit, FaTrash} from "react-icons/fa";
import {EditPortionModal} from "./EditPortionModal";

export interface CompositeFoodListProps {
    selectedFoodItems: Array<SelectedFoodItem>
    deleteItem: (index: number) => void,
    editCompositeElement: (index: number, newPortion: number) => void
}

export function CompositeFoodList(props: CompositeFoodListProps) {
    const languageContext = useContext(LanguageContext)
    const applicationContext = useContext(ApplicationDataContextStore)

    const [showEditModal, setShowEditModal] = useState(false)
    const [editModalIndex, setEditModalIndex] = useState<number | null>(null)

    if (!applicationContext) {
        return <div/>
    }


    const onDeleteItem = (index: number) => {
        props.deleteItem(index)
    }

    const onEditItem = (editIndex: number) => {
        setShowEditModal(true)
        setEditModalIndex(editIndex)
    }

    const closeEditModal = () => {
        setShowEditModal(false)
        setEditModalIndex(null)
    }

    const setNewPortionData = (portion) => {
        if(editModalIndex !== null) {
            props.editCompositeElement(editModalIndex, portion)
        }
        closeEditModal()
    }

    const renderLine = (selectedFoodItem: SelectedFoodItem, index: number) => {
        const name = getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, selectedFoodItem.foodItem.nameId!!, languageContext.language)
        return <div className={"row"}
                    key={`composite food list ${index}`}
                    style={{borderBottom: "1px solid #dddddd", paddingTop: "6px"}}>
            <div className={"col-1"}>
                <b>{index + 1}.</b>
            </div>
            <div className={"col-8"}>
                {name}
                <br/>
                {selectedFoodItem.portion.amount} g
            </div>
            <div className={"col-3"}>
                <Button style={{marginRight: "1ch"}} onClick={() => onEditItem(index)}>
                    <FaEdit/>
                </Button>
                <Button onClick={() => onDeleteItem(index)}>
                    <FaTrash/>
                </Button>
            </div>
        </div>
    }

    const editingFoodItem = editModalIndex !== null ? props.selectedFoodItems[editModalIndex] : null
    const editingFoodItemName = editingFoodItem
        ? getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, editingFoodItem.foodItem.nameId!!, languageContext.language)
        : ''
    const editingFoodItemPortion = editingFoodItem ? editingFoodItem.portion.amount : 0

    return <div className={"container"} style={{maxHeight: "300px", overflowY: "auto"}}>
        {showEditModal &&
        <EditPortionModal portionAmount={editingFoodItemPortion}
                          foodName={editingFoodItemName ?? ''}
                          closeModal={closeEditModal}
                          submitNewPortion={setNewPortionData}/>

        }
        {props.selectedFoodItems.map((selectedFoodItem, index) => renderLine(selectedFoodItem, index))}
    </div>

}