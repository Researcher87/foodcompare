import {ChartProps} from "../../../types/livedata/ChartPropsData";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {getRankingGroups} from "../../../service/RankingService";
import {applicationStrings} from "../../../static/labels";
import {customSelectStyles} from "../../../config/UI_Config";
import Select from 'react-select';
import {useHistory, useLocation} from 'react-router-dom';
import {
    COMPARISON_REFERENCE_ALL,
    COMPARISON_REFERENCE_ALL_IN_CATEGORY, COMPARISON_REFERENCE_SELECTED_TABS, DISPLAYMODE_CHART
} from "../../../config/Constants";
import {JuxtapositionChart} from "./JuxtapositionChart";
import {JuxtapositionTable} from "./JuxtapositionTable";
import {JustapositionSettings} from "./JustapositionSettings";

export default function JuxtapostionContainer(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language
    const history = useHistory();
    const location = useLocation();

    if (!applicationContext) {
        throw new Error("ApplicationContext unavailable.")
    }

    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)

    const referenceList = [
        {value: COMPARISON_REFERENCE_ALL, label: applicationStrings.label_reference_all[language]},
        {value: COMPARISON_REFERENCE_ALL_IN_CATEGORY, label: applicationStrings.label_reference_category[language]}
    ]

    const numberOfTabs = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length
    if(numberOfTabs > 1) {
        referenceList.push({value: COMPARISON_REFERENCE_SELECTED_TABS, label: applicationStrings.label_reference_panel[language]})
    }

    const updateQueryParam = (): void => {
        const selectedGroup = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData?.selectedGroup?.value
        if (selectedGroup && window.history.replaceState) {  // Update Query string without triggering a re-render caused by the react router
            const url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search
            let newUrl = url
            if(url.includes("group=")) {  // Replace the group part at the end of the search string
                newUrl = url.substring(0, url.indexOf("group=")-1)
            }
            newUrl = `${newUrl}&group=${selectedGroup}`
            window.history.replaceState({path: newUrl},'', newUrl);
        }
    }

    const handleGroupChange = (selectedOption: any) => {
        const newJuxtapositionConfigData = {
            ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
            selectedGroup: selectedOption
        }
        applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
    }

    const handleComparisonReferenceChange = (selectedOption) => {
        const newJuxtapositionConfigData = {
            ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
            selectedComparisonReference: selectedOption
        }
        applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
    }

    useEffect(() => {
        const numberOfFoodItemsInPanel = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length
        const {juxtapositionConfigData} =  applicationContext.applicationData.foodDataPanel
        const compareToFoodItemsInPanel =
            juxtapositionConfigData.selectedComparisonReference?.value === COMPARISON_REFERENCE_SELECTED_TABS
        if(numberOfFoodItemsInPanel === 1 && compareToFoodItemsInPanel) {
            const newJuxtapositionConfigData = {
                ...applicationContext.applicationData.foodDataPanel.juxtapositionConfigData,
                selectedComparisonReference: referenceList[0]
            }
            applicationContext.setFoodDataPanelData.updateJuxtapositionConfig(newJuxtapositionConfigData)
        }
        updateQueryParam()
    }, [applicationContext.applicationData.foodDataPanel.selectedFoodItems.length,
        applicationContext.applicationData.foodDataPanel.juxtapositionConfigData])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const groupParam = params.get('group');
        if(groupParam !== null) {
            const group = rankingList.find(entry => entry.value === Number(groupParam))
            if(group) {
                handleGroupChange(group)
            }
        }
    }, [])

    const getRankingGroupsList = () => {
        return getRankingGroups(language);
    }

    const {
        selectedGroup,
        selectedComparisonReference
    } = applicationContext.applicationData.foodDataPanel.juxtapositionConfigData

    const rankingList = getRankingGroupsList()
    const group = selectedGroup ?? rankingList[0]

    const reference = selectedComparisonReference ?? referenceList[1]

    if(props.selectedFoodItem.aggregated === true) {
        return <div>
            <p style={{maxHeight: "437px", minHeight: "437px", textAlign: "center"}}>{applicationStrings.label_juxtaposition_unavailable[language]}</p>
        </div>
    }

    return (
        <div className={"juxtaposition-data"}>
            {showSettingsModal &&
                <JustapositionSettings onHide={() => setShowSettingsModal(false)}></JustapositionSettings>
            }
            <div className={"container row align-items-end"}>
                <div className={"col-4"}>
                    <span className={"form-label"}>{applicationStrings.label_reference[language]}:</span>
                    <Select className="form-control-sm"
                            options={referenceList}
                            value={reference}
                            defaultValue={referenceList[0]}
                            styles={customSelectStyles}
                            onChange={handleComparisonReferenceChange}
                    />
                </div>
                <div className={"col-4"}>
                    <span className={"form-label"}>{applicationStrings.label_group[language]}:</span>
                    <Select className="form-control-sm"
                            options={rankingList}
                            value={group}
                            defaultValue={rankingList[0]}
                            styles={customSelectStyles}
                            onChange={handleGroupChange}
                    />
                </div>
                <div className={"col-2"}>
                    <button className={"btn btn-link"} onClick={() => setShowSettingsModal(true)}>
                        {applicationStrings.label_juxtaposition_settings_btn[language]}
                    </button>
                </div>
            </div>
            <hr/>
            <div style={{paddingTop: "1vh", paddingBottom: "1vh", paddingLeft: "1vw", paddingRight: "0.75vw"}}>
                {props.displayMode === DISPLAYMODE_CHART ?
                    <JuxtapositionChart selectedGroup={group.value} selectedReference={reference.value} selectedFoodItem={props.selectedFoodItem}/>
                    :
                    <JuxtapositionTable selectedGroup={group.value} selectedReference={reference.value} selectedFoodItem={props.selectedFoodItem}></JuxtapositionTable>
                }
            </div>
        </div>
    )

}