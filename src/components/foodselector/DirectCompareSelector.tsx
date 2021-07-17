import React, {useContext, useEffect, useState} from "react";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodSelector from "./FoodSelector";
import {Button, Card, CardDeck} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";

interface DirectCompareSelectorProps {
    updateSelectedFoodItems: (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => void
}

const STATUS_FIRST_TIME = "first time"
const STATUS_NOT_UPDATED = "not updated"
const STATUS_UPDATED = "updated"

export function DirectCompareSelector(props: DirectCompareSelectorProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const language = languageContext.language

    const initialItem1 = applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem1
        ? applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem1
        : null

    const initialItem2 = applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem2
        ? applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem2
        : null

    console.log('STATUS:', initialItem1)

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(initialItem1)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(initialItem2)
    const [displayStatus, setDisplayStatus] = useState<string>(STATUS_FIRST_TIME)

    useEffect(() => {
    }, [selectedFoodItem1, selectedFoodItem2])

    if (!applicationContext) {
        return <div/>
    }

    const updateSelectedFoodItem1 = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem1(selectedFoodItem)
        if(displayStatus !== STATUS_FIRST_TIME) {
            setDisplayStatus(STATUS_UPDATED)
        }
    }

    const updateSelectedFoodItem2 = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem2(selectedFoodItem)
        if(displayStatus !== STATUS_FIRST_TIME) {
            setDisplayStatus(STATUS_UPDATED)
        }
    }

    const onSubmit = () => {
        if(selectedFoodItem1 && selectedFoodItem2) {
            props.updateSelectedFoodItems(selectedFoodItem1, selectedFoodItem2)
        }

        setDisplayStatus(STATUS_NOT_UPDATED)
    }


    const renderFoodSelectorCard = (foodSelectorNumber: number) => {
        const updateSelectedFoodItem = foodSelectorNumber === 1 ? updateSelectedFoodItem1 : updateSelectedFoodItem2
        const styleClass = foodSelectorNumber === 1 ? {backgroundColor: direct_compare_color1} : {backgroundColor: direct_compare_color2}
        const initialFoodClassToSet = foodSelectorNumber -1

        const selectedFoodItem = foodSelectorNumber === 1 ? selectedFoodItem1 : selectedFoodItem2

        return <div style={{paddingTop: "32px"}}>
            <Card style={styleClass}>
                <Card.Header>
                    {applicationStrings.label_food[language]} {foodSelectorNumber}
                </Card.Header>
                <CardDeck>
                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                  smallVariant={true}
                                  noCategorySelect={true}
                                  initialFoodClassToSet={initialFoodClassToSet}
                                  selectedFoodItem={selectedFoodItem}
                    />
                </CardDeck>
            </Card>
        </div>
    }

    const buttonName = displayStatus === STATUS_FIRST_TIME ? applicationStrings.button_show[language] : applicationStrings.button_update[language]

    return <div>
        {renderFoodSelectorCard(1)}
        {renderFoodSelectorCard(2)}
        <div style={{paddingTop: "20px", paddingBottom: "64px"}}>
            <Button className={"form-button float-end"}
                    disabled={displayStatus === STATUS_NOT_UPDATED}
                    onClick={onSubmit}>
                {buttonName}
            </Button>
        </div>
    </div>
}