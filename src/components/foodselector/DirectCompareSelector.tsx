import React, {useContext, useState} from "react";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodSelector from "./FoodSelector";
import {Button, Card, CardDeck} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";

interface DirectCompareSelectorProps {
    updateSelectedFoodItems: (selectedFoodItem1: SelectedFoodItem, selectedFoodItem2: SelectedFoodItem) => void
}

const STATUS_FIRST_TIME = "first time"
const STATUS_NOT_UPDATED = "not updated"
const STATUS_UPDATED = "updated"

export function DirectCompareSelector(props: DirectCompareSelectorProps) {
    const applicationData = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const language = languageContext.language

    const [selectedFoodItem1, setSelectedFoodItem1] = useState<SelectedFoodItem | null>(null)
    const [selectedFoodItem2, setSelectedFoodItem2] = useState<SelectedFoodItem | null>(null)
    const [displayStatus, setDisplayStatus] = useState<string>(STATUS_FIRST_TIME)

    if (!applicationData) {
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
        const cssClass = foodSelectorNumber === 1 ? 'card1' : 'card2'
        const initialFoodClassToSet = foodSelectorNumber -1


        return <div style={{paddingTop: "32px"}}>
            <Card className={cssClass}>
                <Card.Header>
                    {applicationStrings.label_food[language]} {foodSelectorNumber}
                </Card.Header>
                <CardDeck>
                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                  smallVariant={true}
                                  noCategorySelect={true}
                                  initialFoodClassToSet={initialFoodClassToSet}
                    />
                </CardDeck>
            </Card>
        </div>
    }

    const buttonName = displayStatus === STATUS_FIRST_TIME ? applicationStrings.button_show[language] : applicationStrings.button_update[language]

    return <div>
        {renderFoodSelectorCard(1)}
        {renderFoodSelectorCard(2)}
        <div style={{paddingTop: "20px"}}>
            <Button className={"form-button float-end"}
                    disabled={displayStatus === STATUS_NOT_UPDATED}
                    onClick={onSubmit}>
                {buttonName}
            </Button>
        </div>
    </div>
}