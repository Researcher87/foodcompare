import React, {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import getName from "../../service/LanguageService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";

export interface VerticalLabelProps {
    selectedFoodItem: SelectedFoodItem
}

export function VerticalLabel(props: VerticalLabelProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    if(applicationContext === null) {
        return null
    }

    const condition = applicationContext.foodDataCorpus.conditions.find(condition => condition.id === props.selectedFoodItem.foodItem.conditionId)
    const conditionName = condition ? getName(condition, languageContext.language) : ""

    return (
        <>
            <div className={"vertical-label-small"}>{conditionName}</div>
            <div className={"vertical-label"}>{props.selectedFoodItem.resolvedName}</div>
        </>
    )
}