import React, {useContext, useEffect, useState} from "react";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodSelector from "./FoodSelector";
import {Button, Card, CardDeck} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";
import {initialComparisonFoodClassId, initialFoodClassId} from "../../config/ApplicationSetting";
import ReactSelectOption from "../../types/ReactSelectOption";

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

    // Checkbox states (needed to update global configuration)
    const [supplementData1, setSupplementData1] = useState<boolean>(true)
    const [combineData1, setCombineData1] = useState<boolean>(false)

    const [supplementData2, setSupplementData2] = useState<boolean>(true)
    const [combineData2, setCombineData2] = useState<boolean>(false)

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

    }, [applicationContext?.applicationData.directCompareDataPanel, supplementData1, combineData1, supplementData2, combineData2 ])

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

    const updateFoodSelectorConfig1 = (selectedCategory: ReactSelectOption | null, supplementData: boolean, combineData: boolean) => {
        setSupplementData1(supplementData)
        setCombineData1(combineData)
    }

    const updateFoodSelectorConfig2 = (selectedCategory: ReactSelectOption | null, supplementData: boolean, combineData: boolean) => {
        setSupplementData2(supplementData)
        setCombineData2(combineData)
    }

    const onSubmit = () => {
        if (selectedFoodItem1 && selectedFoodItem2) {
            props.updateSelectedFoodItems(selectedFoodItem1, selectedFoodItem2)

            if (applicationContext) {
                const currentSelectorSetting1 = applicationContext.applicationData.directCompareDataPanel.foodSelector1
                if (supplementData1 !== currentSelectorSetting1.sourceSupplement
                    || combineData1 !== currentSelectorSetting1.sourceCombine) {
                    applicationContext.setDirectCompareFoodSelector1(supplementData1, combineData1)
                }

                const currentSelectorSetting2 = applicationContext.applicationData.directCompareDataPanel.foodSelector2
                if (supplementData2 !== currentSelectorSetting2.sourceSupplement
                    || combineData2 !== currentSelectorSetting2.sourceCombine) {
                    applicationContext.setDirectCompareFoodSelector2(supplementData2, combineData2)
                }
            }
        }

        setDisplayStatus(STATUS_NOT_UPDATED)
    }


    const renderFoodSelectorCard = (foodSelectorNumber: number) => {
        const updateSelectedFoodItem = foodSelectorNumber === 1 ? updateSelectedFoodItem1 : updateSelectedFoodItem2
        const styleClass = foodSelectorNumber === 1 ? {backgroundColor: direct_compare_color1} : {backgroundColor: direct_compare_color2}
        const initialFoodClassToSet = foodSelectorNumber === 1 ? initialFoodClassId : initialComparisonFoodClassId

        const selectedFoodItem = foodSelectorNumber === 1 ? selectedFoodItem1 : selectedFoodItem2
        const updateFoodSelectorConfig = foodSelectorNumber === 1 ? updateFoodSelectorConfig1 : updateFoodSelectorConfig2

        return <div style={{paddingTop: "32px"}}>
            <Card style={styleClass}>
                <Card.Header>
                    {applicationStrings.label_food[language]} {foodSelectorNumber}
                </Card.Header>
                <CardDeck>
                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                  updateFoodSelectorConfig={updateFoodSelectorConfig}
                                  compositeSelector={false}
                                  directCompareSelector={true}
                                  selectedFoodItem={selectedFoodItem}
                                  defaultFoodClass={initialFoodClassToSet}
                                  directCompareSelectorNumber={foodSelectorNumber}
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