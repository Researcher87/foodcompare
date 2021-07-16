import React, {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {Button} from "react-bootstrap";
import {FaTrash} from "react-icons/all";

export interface CompositeFoodListProps {
    selectedFoodItems: Array<SelectedFoodItem>
    deleteItem: (index: number) => void
}

export function CompositeFoodList(props: CompositeFoodListProps) {
    const languageContext = useContext(LanguageContext)
    const applicationContext = useContext(ApplicationDataContextStore)

    const onDeleteItem = (index: number) => {
        props.deleteItem(index)
    }

    const renderLine = (selectedFoodItem: SelectedFoodItem, index: number) => {
        if(applicationContext) {
            const name = getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, selectedFoodItem.foodItem.nameId!!, languageContext.language)

            return <div className={"row"}
                        key={`composite food list ${index}`}
                        style={{borderBottom: "1px solid #dddddd", paddingTop: "6px"}}>
                <div className={"col-1"}>
                    <b>{index+1}.</b>
                </div>
                <div className={"col-8"}>
                    {name}
                    <br/>
                    {selectedFoodItem.portion.amount} g
                </div>
                <div className={"col-3"}>
                    <Button onClick={() => onDeleteItem(index)}>
                        <FaTrash/>
                    </Button>
                </div>
            </div>
        }

        return <div></div>
    }

    return <div className={"container"} style={{maxHeight: "300px", overflowY: "auto"}}>
        {props.selectedFoodItems.map((selectedFoodItem, index) => renderLine(selectedFoodItem, index))}
    </div>

}