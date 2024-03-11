import React, {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {Button} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {FaBookOpen, FaChartBar, FaQuestionCircle, FaThList, FaTimes, FaTools} from "react-icons/fa";
import {
    DISPLAYMODE_CHART,
    DISPLAYMODE_TABLE,
    PATH_FOODDATA_PANEL,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_INFO, TAB_JUXTAPOSITION,
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
import SettingsModal from "./SettingsModal";

import {VitaminsBook} from "./VitaminBook";
import nutrientBook from "../../static/nutrientBook.json";
import {BookDataEntry} from "../../types/BookData";


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
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)

    if (applicationContext === null) {
        return <div/>
    }

    const displayMode = applicationContext.applicationData.foodDataPanel.displayMode
    const dataPage = applicationContext.applicationData.foodDataPanel.selectedDataPage

    const handleRadioButtonClick = (value: string) => {
        props.setDisplayMode(value)
    }

    const closeTab = () => {
        const id = (props.selectedFoodItem.foodItem.id)
        const remainingItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems.length - 1
        applicationContext.setFoodDataPanelData.removeItemFromFoodDataPanel(id)

        if (remainingItems === 0) {
            history.push({pathName: PATH_FOODDATA_PANEL})
        }
    }

    const openHelpMenu = () => {
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
            case TAB_JUXTAPOSITION:
                setHelpModalId(11)
                return;
            default:
                return;
        }
    }

    const openSettingsMenu = () => {
        setShowSettingsModal(true)
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
        fullName = condition?.id !== 100
            ? `${foodName} (${conditionName}, ${portionSize} g)`
            : `${foodName} (${portionSize} g)`
    } else {
        fullName = `${foodName} (${portionSize} g)`
    }

    const helpText: HelpText | null = helpModalId > 0 ? getHelpText(helpModalId, languageContext.language) : null
    const sourceString = getSourceName(props.selectedFoodItem.selectedSource)
    const selectedDataPage = applicationContext.applicationData.foodDataPanel.selectedDataPage
    const sourceToolTip = `${applicationStrings.tooltip_source[languageContext.language]} ${sourceString}`

    let bookToolTip = null
    let bookData: BookDataEntry[] = []
    switch (selectedDataPage) {
        case TAB_VITAMIN_DATA:
            bookToolTip = applicationStrings.tooltip_icon_vitamins[languageContext.language]
            bookData = nutrientBook.vitamins
            break;
        case TAB_MINERAL_DATA:
            bookToolTip = applicationStrings.tooltip_icon_minerals[languageContext.language]
            bookData = nutrientBook.minerals
            break;
    }

    const shouldShowBookIcon = selectedDataPage === TAB_VITAMIN_DATA || selectedDataPage == TAB_MINERAL_DATA

    const smallHelpDialogTabs = [TAB_BASE_DATA, TAB_ENERGY_DATA, TAB_INFO, TAB_VITAMIN_DATA, TAB_MINERAL_DATA]

    const helpModalSize = smallHelpDialogTabs.includes(selectedDataPage)
        ? "sm"
        : "lg"

    return (
        <div style={{paddingBottom: "6px"}}>
            {helpText !== null &&
            <HelpModal helpText={helpText}
                       size={helpModalSize}
                       closeHelpModal={() => setHelpModalId(0)}
            />
            }
            {showBookModal &&
            <VitaminsBook selectedDataTab={selectedDataPage} bookData={bookData}
                          closeBookModal={() => setShowBookModal(false)}/>
            }
            {showSettingsModal &&
            <SettingsModal onHide={() => setShowSettingsModal(false)}/>
            }
            <div className={"d-flex flex-nowrap"}>
                <div className="col-2">
                    <div className={"card"}>
                        <div className="card-body" style={{paddingLeft: "0.65vw"}}>
                            <ChartMenuPanel verticalArrangement={true} setDataPage={props.setDataPage}
                                            dataPage={selectedDataPage}/>
                            <div className={"d-flex card"} style={{marginTop: "2vh", backgroundColor: "#eeeeee"}}>
                                <div className={"text-center food-analyzer-sourcebox"} data-tip={sourceToolTip}>
                                    {sourceString}
                                    <ReactTooltip/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"col-10"}>
                    <div className="d-flex flex-row justify-content-between" style={{marginTop: "1vh"}}>
                        <div style={{paddingTop: "0.75vh", paddingLeft: "1.5vw"}}>
                            <div className={"header-label"}>
                                <b>{fullName}</b>
                            </div>
                        </div>
                        <div className={"d-flex flex-row"} style={{paddingRight: "24px"}}>
                            <div style={{padding: "0px !important", margin: "0px !important"}}>
                                {shouldShowBookIcon &&
                                <span style={{marginRight: "20px"}}>
                                    <Button
                                        onClick={() => openVitaminMineralBook()}
                                        data-tip={bookToolTip}>
                                                        <ReactTooltip/>
                                                        <FaBookOpen/>
                                    </Button>
                                </span>
                                }
                            </div>
                            <div className={"d-flex flex-row"}>
                                <div className="btn-group" role="group">
                                    <Button className={chartButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_CHART)}
                                            active={displayMode === DISPLAYMODE_CHART}
                                            data-for={"datapanel-chart"}
                                            data-tip={applicationStrings.tooltip_icon_charts[languageContext.language]}>
                                        <ReactTooltip id={"datapanel-chart"}/>
                                        <FaChartBar/>
                                    </Button>
                                    <Button className={tablesButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_TABLE)}
                                            active={displayMode === DISPLAYMODE_TABLE}
                                            data-for={"datapanel-table"}
                                            data-tip={applicationStrings.tooltip_icon_table[languageContext.language]}>
                                        <ReactTooltip id="datapanel-table"/>
                                        <FaThList/>
                                    </Button>
                                </div>
                                <div className={"d-flex flex-row"} style={{paddingLeft: "20px"}}>
                                    <Button className={"btn-primary button-foodPanelHead"}
                                            onClick={openSettingsMenu}
                                            data-for={"datapanel-settings"}
                                            data-tip={applicationStrings.tooltip_icon_settings[languageContext.language]}>
                                        <ReactTooltip id="datapanel-settings" globalEventOff="click"/>
                                        <FaTools/>
                                    </Button>
                                    <Button className={"btn-primary button-foodPanelHead"}
                                            onClick={openHelpMenu}>
                                        <FaQuestionCircle/>
                                    </Button>
                                    <Button className={"button-closeTab"}
                                            onClick={closeTab}
                                            data-for={"datapanel-close"}
                                            data-tip={applicationStrings.tooltip_icon_close[languageContext.language]}>
                                        <ReactTooltip id="datapanel-close"/>
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