import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {getCategorySelectList} from "../../service/nutrientdata/CategoryService";
import {useHistory} from 'react-router-dom';
import {getElementsOfRankingGroup, getRankingGroups} from "../../service/RankingService";
import {applicationStrings} from "../../static/labels";
import {Form} from "react-bootstrap";
import Select from 'react-select';
import {PATH_RANKING, QUERYKEY_DATAPANEL_RANKING} from "../../config/Constants";
import {makeRankingPanelDataUri, parseRankingPanelDataUri} from "../../service/uri/RankingPanelUriService";
import {RankingPanelData} from "../../types/livedata/ApplicationData";
import {customSelectStyles} from "../../config/UI_Config";
import {callEvent} from "../../service/GA_EventService";
import {
    GA_ACTION_RANKING_CONFIG,
    GA_ACTION_SELECTION_RANKING_CAT, GA_ACTION_SELECTION_RANKING_ELEMENT,
    GA_CATEGORY_RANKING
} from "../../config/GA_Events";

interface RankingSelectorProps {
    openChart: (selectedCategory, selectedValue, use100gram, transformToDietaryRequirements) => void,
    useHorizontalLayout: boolean
}

export const BASE_DATA_INDEX = 0
export const VITAMIN_INDEX = 1
export const MINERAL_INDEX = 2
export const LIPIDS_INDEX = 3
export const CARBS_INDEX = 4
export const PROTEIN_INDEX = 5

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

        callEvent(applicationContext.debug, GA_ACTION_SELECTION_RANKING_CAT, GA_CATEGORY_RANKING, selectedOption.value)
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

        callEvent(applicationContext.debug, GA_ACTION_SELECTION_RANKING_ELEMENT, GA_CATEGORY_RANKING, selectedOption.value)
        applicationContext.setRankingPanelData(newRankingData)
    }

    const handlePortionAmountChange = () => {
        const label = "100 gram portion: " + !use100gram
        callEvent(applicationContext.debug, GA_ACTION_RANKING_CONFIG, GA_CATEGORY_RANKING, label)
        const newRankingData = {
            ...applicationContext.applicationData.rankingPanelData,
            use100gram: !use100gram
        }
        applicationContext.setRankingPanelData(newRankingData)
    }

    const handleDietaryRequirementsCheckbox = () => {
        const label = "use dietary req.: " + !showDietaryRequirements
        callEvent(applicationContext.debug, GA_ACTION_RANKING_CONFIG, GA_CATEGORY_RANKING, label)
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
        const mineralOrVitaminCategory = (rankingCategory === VITAMIN_INDEX) || (rankingCategory === MINERAL_INDEX);
        const transformToDietaryRequirements = mineralOrVitaminCategory ? showDietaryRequirements : false;

        props.openChart(selectedFoodCategory, selectedElement, use100gram, transformToDietaryRequirements);
    }

    const renderPortionForm = () => {
        const rankingCategory = selectedGroup ? selectedGroup.value : null;

        return (
            <div className="column select-menu" style={{paddingLeft: "20px", paddingTop: "10px"}}>
                <form className="form-inline form-group">
                    <label className="form-elements form-label">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={(use100gram)}
                               onChange={handlePortionAmountChange}
                        />
                        100 g
                    </label>
                    <label className="form-elements-largespace form-label">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={!use100gram}
                               onChange={handlePortionAmountChange}
                        />
                        {applicationStrings.label_portion_common[language]}
                    </label>
                    {(rankingCategory === VITAMIN_INDEX || rankingCategory === MINERAL_INDEX) &&
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