import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {getCategorySelectList} from "../../service/nutrientdata/CategoryService";
import {useHistory} from 'react-router-dom';
import {getElementsOfRankingGroup, getRankingGroups} from "../../service/RankingService";
import {applicationStrings} from "../../static/labels";
import {Form} from "react-bootstrap";
import Select from 'react-select';
import {PATH_RANKING, QUERYKEY_DATAPANEL_AGGREGATED, QUERYKEY_DATAPANEL_RANKING} from "../../config/Constants";
import {makeRankingPanelDataUri, parseRankingPanelDataUri} from "../../service/uri/RankingPanelUriService";
import {RankingPanelData} from "../../types/livedata/ApplicationData";

interface RankingSelectorProps {
    openChart: (selectedCategory, selectedValue, portionAmount, transformToDietaryRequirements) => void
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

    const [elementsList, setElementsList] = useState<any>()
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (applicationContext) {
            const newElements = buildElementsList(applicationContext.applicationData.rankingPanelData.selectedGroup)
            setElementsList(newElements)
            if (newElements) {
                applicationContext.setRankingPanelData({
                    ...applicationContext.applicationData.rankingPanelData, selectedElement:
                        null
                })
                resetChart()
            }
        }
    }, [applicationContext?.applicationData.rankingPanelData.selectedGroup])

    useEffect(() => {
        if (selectedFoodCategory && selectedGroup && selectedElement && initialized) {
            updateUriQuery()
            openChart()
        } else if(!initialized) {
            buildRankingPanelPageFromURI()
        }
    }, [applicationContext?.applicationData.rankingPanelData.selectedFoodCategory,
        applicationContext?.applicationData.rankingPanelData.selectedElement,
        applicationContext?.applicationData.rankingPanelData.use100gram,
        applicationContext?.applicationData.rankingPanelData.showDietaryRequirements
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
            selectedGroup: selectedOption
        }
        applicationContext.setRankingPanelData(newRankingData)
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
        const mineralOrVitaminCategory = (rankingCategory === VITAMIN_INDEX) || (rankingCategory === MINERAL_INDEX);
        const transformToDietaryRequirements = mineralOrVitaminCategory ? showDietaryRequirements : false;

        props.openChart(selectedFoodCategory, selectedElement, use100gram, transformToDietaryRequirements);
    }

    const resetChart = () => {
        props.openChart(null, null, false, false);
    }

    const renderPortionForm = () => {
        const rankingCategory = selectedGroup ? selectedGroup.value : null;

        return (
            <div className="column select-menu" style={{paddingLeft: "20px", paddingTop: "10px"}}>
                <form className="form-inline form-group">
                    <label className="form-elements">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={(!use100gram)}
                               onChange={handlePortionAmountChange}
                        />
                        100 g
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={use100gram}
                               onChange={handlePortionAmountChange}
                        />
                        {applicationStrings.label_portion[language]}
                    </label>
                    {(rankingCategory === VITAMIN_INDEX || rankingCategory === MINERAL_INDEX) &&
                    <Form.Label className="form-elements">
                        <Form.Check inline={true}
                                    label={applicationStrings.label_ranking_dietaryRequirements[language]}
                                    className="form-radiobutton"
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

    return (
        <div className="container">
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_category[language]}:</i>
                <Select options={getFoodCategoryList()}
                        value={selectedFoodCategory}
                        onChange={handleFoodCategoryChange}
                />
            </div>
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_group[language]}:</i>
                <Select options={rankingList}
                        value={selectedGroup}
                        onChange={handleGroupChange}
                />
            </div>
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_value[language]}:</i>
                <Select options={elementsList}
                        value={selectedElement}
                        onChange={handleValueChange}
                />
            </div>
            {renderPortionForm()}
        </div>
    )


}