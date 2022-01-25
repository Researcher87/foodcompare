import React, {useContext, useEffect, useState} from "react";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodSelector from "./FoodSelector";
import {Button, Card, CardDeck} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";
import {initialComparisonFoodClassId, initialFoodClassId} from "../../config/ApplicationSetting";

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

    const initialItem1 = applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem1 !== null
        ? applicationContext.applicationData.directCompareDataPanel.selectedFoodItem1
        : null

    const initialItem2 = applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem2 !== null
        ? applicationContext.applicationData.directCompareDataPanel.selectedFoodItem2
        : null

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(initialItem1)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(initialItem2)
    const [displayStatus, setDisplayStatus] = useState<string>(STATUS_FIRST_TIME)

    useEffect(() => {
        if(applicationContext && applicationContext.applicationData.directCompareDataPanel.selectedFoodItem2) {
            const {selectedFoodItem1, selectedFoodItem2} = applicationContext.applicationData.directCompareDataPanel
            if(selectedFoodItem1 && selectedFoodItem2) {
                updateSelectedFoodItem1(selectedFoodItem1)
                updateSelectedFoodItem2(selectedFoodItem2)
            }
        }

    }, [applicationContext?.applicationData.directCompareDataPanel])

    if (!applicationContext) {
        return <div/>
    }

    const updateSelectedFoodItem1 = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem1({...selectedFoodItem})
        if (displayStatus !== STATUS_FIRST_TIME) {
            setDisplayStatus(STATUS_UPDATED)
        }
    }

    const updateSelectedFoodItem2 = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem2(selectedFoodItem)
        if (displayStatus !== STATUS_FIRST_TIME) {
            setDisplayStatus(STATUS_UPDATED)
        }
    }

    const onSubmit = () => {
        if (selectedFoodItem1 && selectedFoodItem2) {
            props.updateSelectedFoodItems(selectedFoodItem1, selectedFoodItem2)
        }

        setDisplayStatus(STATUS_NOT_UPDATED)
    }


    const renderFoodSelectorCard = (foodSelectorNumber: number, initialFoodClass: number) => {
        const updateSelectedFoodItem = foodSelectorNumber === 1 ? updateSelectedFoodItem1 : updateSelectedFoodItem2
        const styleClass = foodSelectorNumber === 1 ? {backgroundColor: direct_compare_color1} : {backgroundColor: direct_compare_color2}
        const initialFoodClassToSet = foodSelectorNumber === 1 ? initialFoodClassId : initialComparisonFoodClassId

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
                                  selectedFoodItem={selectedFoodItem}
                                  defaultFoodClass={initialFoodClassToSet}
                    />
                </CardDeck>
            </Card>
        </div>
    }

    const buttonName = displayStatus === STATUS_FIRST_TIME ? applicationStrings.button_show[language] : applicationStrings.button_update[language]

    return <div>
        {renderFoodSelectorCard(1, initialFoodClassId)}
        {renderFoodSelectorCard(2, initialComparisonFoodClassId)}
        <div style={{paddingTop: "20px", paddingBottom: "64px"}}>
            <Button className={"form-button float-end"}
                    disabled={displayStatus === STATUS_NOT_UPDATED}
                    onClick={onSubmit}>
                {buttonName}
            </Button>
        </div>
    </div>
}