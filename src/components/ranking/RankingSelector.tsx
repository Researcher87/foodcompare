import React, {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {getCategorySelectList} from "../../service/nutrientdata/CategoryService";
import {useHistory} from 'react-router-dom';
import {getElementsOfRankingGroup, getRankingGroups} from "../../service/RankingService";
import {applicationStrings} from "../../static/labels";
import {Form} from "react-bootstrap";
import Select from 'react-select';
import {
    RANKING_MINERAL_INDEX,
    PATH_RANKING,
    QUERYKEY_DATAPANEL_RANKING,
    RANKING_VITAMIN_INDEX
} from "../../config/Constants";
import {makeRankingPanelDataUri, parseRankingPanelDataUri} from "../../service/uri/RankingPanelUriService";
import {RankingPanelData} from "../../types/livedata/ApplicationData";
import {customSelectStyles} from "../../config/UI_Config";
import {FaLightbulb} from "react-icons/fa";

interface RankingSelectorProps {
    openChart: (selectedCategory, selectedValue, use100gram, transformToDietaryRequirements) => void,
    useHorizontalLayout: boolean,
    numberOfChartItems: number
}

export function RankingSelector(props: RankingSelectorProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)
    const history = useHistory()

    const rankingPanelData = applicationContext?.applicationData.rankingPanelData

    const initializeState = rankingPanelData && rankingPanelData.selectedFoodCategory
    && rankingPanelData.selectedGroup && rankingPanelData.selectedElement ? true : false

    const [elementsList, setElementsList] = useState<any>()
    const [initialized, setInitialized] = useState<boolean>(initializeState)

    useEffect(() => {
        if (applicationContext) {
            const newElements = buildElementsList(applicationContext.applicationData.rankingPanelData.selectedGroup)
            setElementsList(newElements)
        }
    }, [applicationContext?.applicationData.rankingPanelData.selectedGroup])

    useEffect(() => {
        if (selectedFoodCategory && selectedGroup && selectedElement && initialized) {
            updateUriQuery()
            openChart()
        } else if (!initialized) {
            buildRankingPanelPageFromURI()
        }
    }, [applicationContext?.applicationData.rankingPanelData.selectedFoodCategory,
        applicationContext?.applicationData.rankingPanelData.selectedElement,
        applicationContext?.applicationData.rankingPanelData.use100gram,
        applicationContext?.applicationData.rankingPanelData.showDietaryRequirements,
        elementsList
    ])

    if (!applicationContext) {
        return <div/>
    }

    const {
        selectedFoodCategory,
        selectedGroup,
        selectedElement,
        use100gram,
        showDietaryRequirements
    } = applicationContext.applicationData.rankingPanelData

    const buildRankingPanelPageFromURI = () => {
        const queryString = window.location.search.substring(1)
        const equalOperator = queryString.indexOf("=")
        const key = queryString.substring(0, equalOperator)
        const value = queryString.substring(equalOperator + 1)

        if (key === QUERYKEY_DATAPANEL_RANKING && value.length > 1) {
            const uriData: RankingPanelData | null = parseRankingPanelDataUri(value, applicationContext.foodDataCorpus, language)
            if (!uriData) {
                return
            }

            const {selectedFoodCategory, selectedGroup, selectedElement} = uriData
            if (selectedFoodCategory === null || selectedGroup === null || selectedElement === null) {
                return
            } else {   // Set new URI Query
                applicationContext.setRankingPanelData(uriData)
                openChart()
                setInitialized(true)
            }
        }
    }

    const updateUriQuery = () => {
        const query = makeRankingPanelDataUri(applicationContext.applicationData.rankingPanelData)

        history.push({
            pathName: PATH_RANKING,
            search: `${QUERYKEY_DATAPANEL_RANKING}=${query}`
        })
    }

    const handleFoodCategoryChange = (selectedOption) => {
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            selectedFoodCategory: selectedOption
        }

        applicationContext.setRankingPanelData(newRankingData)
    }

    const handleGroupChange = (selectedOption) => {
        setInitialized(true)
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            selectedGroup: selectedOption,
            selectedElement: null
        }
        applicationContext.setRankingPanelData(newRankingData)
        props.openChart(null, null, false, false);
    }

    const handleValueChange = (selectedOption) => {
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            selectedElement: selectedOption
        }

        applicationContext.setRankingPanelData(newRankingData)
    }

    const handlePortionAmountChange = () => {
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            use100gram: !use100gram
        }
        applicationContext.setRankingPanelData(newRankingData)
    }

    const handleDietaryRequirementsCheckbox = () => {
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            showDietaryRequirements: !showDietaryRequirements
        }
        applicationContext.setRankingPanelData(newRankingData)
    }

    const getFoodCategoryList = () => {
        return getCategorySelectList(applicationContext.foodDataCorpus.categories, language)
    }

    const getRankingGroupsList = () => {
        return getRankingGroups(language);
    }

    const buildElementsList = (selectedGroup) => {
        if (!selectedGroup) {
            return;
        }

        return getElementsOfRankingGroup(selectedGroup.value, language)
    }

    const openChart = () => {
        if (!selectedFoodCategory || !selectedGroup || !selectedElement) {
            return
        }

        const rankingCategory = selectedGroup ? selectedGroup.value : null
        const mineralOrVitaminCategory = (rankingCategory === RANKING_VITAMIN_INDEX) || (rankingCategory === RANKING_MINERAL_INDEX);
        const transformToDietaryRequirements = mineralOrVitaminCategory ? showDietaryRequirements : false;

        props.openChart(selectedFoodCategory, selectedElement, use100gram, transformToDietaryRequirements);
    }

    const renderPortionForm = () => {
        const rankingCategory = selectedGroup ? selectedGroup.value : null;

        return (
            <div className="column select-menu" style={{paddingLeft: "20px", paddingTop: "10px"}}>
                <form className="form-inline form-group">
                    <label className="form-elements form-label">
                        <input className={"form-input"}
                               type="radio"
                               checked={(use100gram)}
                               onChange={handlePortionAmountChange}
                        />
                        100 g
                    </label>
                    <label className="form-elements-largespace form-label">
                        <input className={"form-input"}
                               type="radio"
                               checked={!use100gram}
                               onChange={handlePortionAmountChange}
                        />
                        {applicationStrings.label_portion_common[language]}
                    </label>
                    {(rankingCategory === RANKING_VITAMIN_INDEX || rankingCategory === RANKING_MINERAL_INDEX) &&
                    <Form.Label className="form-elements">
                        <Form.Check className="form-radiobutton"
                                    inline={true}
                                    label={applicationStrings.label_ranking_dietaryRequirements[language]}
                                    defaultChecked={showDietaryRequirements}
                                    onClick={handleDietaryRequirementsCheckbox}>
                        </Form.Check>
                    </Form.Label>
                    }
                </form>
                {props.numberOfChartItems > 100 &&
                <div style={{paddingTop: "20px"}}>
                    <FaLightbulb/> <span className={"form-text"}>{applicationStrings.ranking_note[language]}</span>
                </div>
                }
            </div>
        );

    }

    const rankingList = getRankingGroupsList()

    const containerClass = props.useHorizontalLayout ? "container row" : "container"
    const selectorClass = props.useHorizontalLayout ? "col-4 select-menu form-section" : "column select-menu form-section"

    return (
        <div className={containerClass}>
            <div className={selectorClass}>
                <span className={"form-label"}>{applicationStrings.label_category[language]}:</span>
                <Select className="form-control-sm"
                        options={getFoodCategoryList()}
                        value={selectedFoodCategory}
                        styles={customSelectStyles}
                        onChange={handleFoodCategoryChange}
                />
            </div>
            <div className={selectorClass}>
                <span className={"form-label"}>{applicationStrings.label_group[language]}:</span>
                <Select className="form-control-sm"
                        options={rankingList}
                        value={selectedGroup}
                        styles={customSelectStyles}
                        onChange={handleGroupChange}
                />
            </div>
            <div className={selectorClass}>
                <span className={"form-label"}>{applicationStrings.label_value[language]}:</span>
                <Select className="form-control-sm"
                        options={elementsList}
                        value={selectedElement}
                        styles={customSelectStyles}
                        onChange={handleValueChange}
                />
            </div>
            {renderPortionForm()}
        </div>
    )


}