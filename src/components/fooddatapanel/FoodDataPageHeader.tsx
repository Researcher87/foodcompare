import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {Button} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {FaBookOpen, FaChartBar, FaQuestionCircle, FaThList, FaTimes} from "react-icons/fa";
import {
    DISPLAYMODE_CHART,
    DISPLAYMODE_TABLE,
    PATH_FOODDATA_PANEL,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_INFO,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {LanguageContext} from "../../contexts/LangContext";
import ReactTooltip from "react-tooltip";
import {getNameFromFoodNameList, shortenName} from "../../service/nutrientdata/NameTypeService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodDataPageBody from "./FoodDataPageBody";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {HelpModal} from "../HelpModal";
import {getHelpText, HelpText} from "../../service/HelpService";
import getName from "../../service/LanguageService";
import {ChartMenuPanel} from "./ChartMenuPanel";
import {getSourceName} from "../../service/nutrientdata/NutrientDataRetriever";
import {useHistory} from 'react-router-dom';
import {isMobileDevice} from "../../service/WindowDimension";
import {callEvent} from "../../service/GA_EventService";
import {GA_ACTION_DATAPANEL_GENERAL_ACTION, GA_CATEGORY_DATAPANEL} from "../../config/GA_Events";

interface FoodDataPageHeaderProps {
    setDisplayMode: (id: string) => void
    setDataPage: (id: string) => void
    selectedFoodItem: SelectedFoodItem
    tableData: Array<FoodTableDataObject>
}

export default function FoodDataPageHeader(props: FoodDataPageHeaderProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const history = useHistory()

    const [helpModalId, setHelpModalId] = useState<number>(0)
    const [showBookModal, setShowBookModal] = useState<boolean>(false)

    if (applicationContext === null) {
        return <div/>
    }

    const displayMode = applicationContext.applicationData.foodDataPanel.displayMode
    const dataPage = applicationContext.applicationData.foodDataPanel.selectedDataPage

    const handleRadioButtonClick = (value: string) => {
        const displaymode = value === DISPLAYMODE_TABLE ? "table" : "chart"
        const label = `Switch display mode to ${displaymode}`
        callEvent(applicationContext.debug, GA_ACTION_DATAPANEL_GENERAL_ACTION, GA_CATEGORY_DATAPANEL, label)
        props.setDisplayMode(value)
    }

    const closeTab = () => {
        const id = (props.selectedFoodItem.foodItem.id)
        const remainingItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length - 1
        callEvent(applicationContext.debug, GA_ACTION_DATAPANEL_GENERAL_ACTION, GA_CATEGORY_DATAPANEL, "Close food item tab")

        applicationContext.setFoodDataPanelData.removeItemFromFoodDataPanel(id)

        if (remainingItems === 0) {
            history.push({pathName: PATH_FOODDATA_PANEL})
        }
    }

    const help = () => {
        const label = `Open help page: ${dataPage}`
        callEvent(applicationContext.debug, GA_ACTION_DATAPANEL_GENERAL_ACTION, GA_CATEGORY_DATAPANEL, label)
        switch (dataPage) {
            case TAB_BASE_DATA:
                setHelpModalId(1)
                return;
            case TAB_ENERGY_DATA:
                setHelpModalId(2)
                return;
            case TAB_VITAMIN_DATA:
                setHelpModalId(3)
                return;
            case TAB_MINERAL_DATA:
                setHelpModalId(4)
                return;
            case TAB_LIPIDS_DATA:
                setHelpModalId(5)
                return;
            case TAB_INFO:
                setHelpModalId(6)
                return;
            case TAB_CARBS_DATA:
                setHelpModalId(7)
                return;
            case TAB_PROTEINS_DATA:
                setHelpModalId(8)
                return;
            default:
                return;
        }
    }

    const openVitaminMineralBook = () => {
        setShowBookModal(true)
    }

    const enabledDisplayButtonClasses = "btn button-displaymode-enabled"
    const disabledDisplayButtonClasses = "btn button-displaymode-disabled"

    const chartButtonClasses = displayMode === DISPLAYMODE_CHART ? enabledDisplayButtonClasses
        : disabledDisplayButtonClasses;

    const tablesButtonClasses = displayMode === DISPLAYMODE_TABLE ? enabledDisplayButtonClasses
        : disabledDisplayButtonClasses;

    const foodNamesList = applicationContext.foodDataCorpus.foodNames;


    let foodName
    if (props.selectedFoodItem.foodItem.nameId) {
        foodName = getNameFromFoodNameList(foodNamesList, props.selectedFoodItem.foodItem.nameId, languageContext.language)
    } else {
        foodName = props.selectedFoodItem.title !== undefined ? props.selectedFoodItem.title : 'Individual'
    }

    let fullName
    const portionSize = props.selectedFoodItem.portion.amount

    if (!props.selectedFoodItem.foodItem.aggregated) {
        const condition = applicationContext.foodDataCorpus.conditions.find(condition => condition.id === props.selectedFoodItem.foodItem.conditionId)
        const conditionName = condition ? getName(condition, languageContext.language) : ""
        if (isMobileDevice()) {
            foodName = shortenName(foodName, 16)
        }
        fullName = `${foodName} (${conditionName}, ${portionSize} g)`
    } else {
        fullName = `${foodName} (${portionSize} g)`
    }

    const helpText: HelpText | null = helpModalId > 0 ? getHelpText(helpModalId, languageContext.language) : null
    const sourceString = getSourceName(props.selectedFoodItem.selectedSource)
    const selectedDataPage = applicationContext.applicationData.foodDataPanel.selectedDataPage
    const sourceToolTip = `${applicationStrings.tooltip_source[languageContext.language]} ${sourceString}`
    const headerLabel = isMobileDevice() ? "header-label-m" : "header-label";

    return (
        <div style={{paddingBottom: "6px"}}>
            {helpText !== null &&
            <HelpModal helpText={helpText} closeHelpModal={() => setHelpModalId(0)}/>
            }
            <div className={"d-flex flex-nowrap"}>
                <div className="col-2">
                    <div className={"card"}>
                        <div className="card-body" style={{paddingRight: "16px"}}>
                            <ChartMenuPanel verticalArrangement={true} setDataPage={props.setDataPage}
                                            dataPage={selectedDataPage}/>
                            <div className={"d-flex card"} style={{marginTop: "24px", backgroundColor: "#eeeeee"}}>
                                <div className={"text-center"} style={{fontSize: "0.8em"}} data-tip={sourceToolTip}>
                                    {sourceString}
                                    <ReactTooltip/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-10"}>
                    <div className="d-flex flex-row justify-content-between" style={{marginTop: "10px"}}>
                        <div style={{paddingTop: "6px", paddingLeft: "32px"}}>
                            <div className={headerLabel}>
                                <b>{fullName}</b>
                            </div>
                        </div>
                        <div style={{paddingRight: "24px"}}>
                            <div style={{padding: "0px !important", margin: "0px !important"}}>
                                <div className="btn-group" role="group">
                                    <Button className={chartButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_CHART)}
                                            active={displayMode === DISPLAYMODE_CHART}
                                            data-tip={applicationStrings.tooltip_icon_charts[languageContext.language]}>
                                        <ReactTooltip/>
                                        <FaChartBar/>
                                    </Button>
                                    <Button className={tablesButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_TABLE)}
                                            active={displayMode === DISPLAYMODE_TABLE}
                                            data-tip={applicationStrings.tooltip_icon_table[languageContext.language]}>
                                        <FaThList/>
                                    </Button>
                                </div>
                                <div className="btn-group" role="group" style={{paddingLeft: "20px"}}>
                                    <Button className={"btn-primary button-foodPanelHead"}
                                            onClick={help}
                                            active={displayMode === DISPLAYMODE_CHART}>
                                        <ReactTooltip/>
                                        <FaQuestionCircle/>
                                    </Button>
                                    <Button className={"button-closeTab"}
                                            onClick={closeTab}
                                            data-for="closeButtonTooltip"
                                            data-tip={applicationStrings.tooltip_icon_close[languageContext.language]}>
                                        <ReactTooltip id="closeButtonTooltip"/>
                                        <FaTimes/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FoodDataPageBody selectedFoodItem={props.selectedFoodItem}
                                      tableData={props.tableData}
                                      dataPage={dataPage}
                    />
                </div>
            </div>
        </div>
    );

}