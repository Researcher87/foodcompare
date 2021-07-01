import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {Button, ButtonGroup} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {FaChartBar, FaQuestionCircle, FaThList, FaTimes} from "react-icons/all";
import {
    DISPLAYMODE_CHART,
    DISPLAYMODE_TABLE,
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
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodDataPageBody from "./FoodDataPageBody";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {HelpModal} from "../HelpModal";
import {getHelpText, HelpText} from "../../service/HelpService";
import getName from "../../service/LanguageService";


interface FoodDataPageHeaderProps {
    displayMode: string
    setDisplayMode: (id: string) => void
    infoPage: string
    setInfoPage: (id: string) => void
    selectedFoodItem: SelectedFoodItem
    tableData: Array<FoodTableDataObject>
    selectedDataTab: string
}

export default function FoodDataPageHeader(props: FoodDataPageHeaderProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const [helpModalId, setHelpModalId] = useState<number>(0)

    if (applicationContext === null) {
        return <div/>
    }

    const handlePageButtonClick = (value: string) => {
        props.setInfoPage(value)
    }

    const handleRadioButtonClick = (value: string) => {
        props.setDisplayMode(value)
    }

    const closeTab = () => {
        const id = (props.selectedFoodItem.foodItem.id)
        applicationContext.removeItemFromFoodDataPanel(id)
    }

    const help = () => {
        switch (props.infoPage) {
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


    const renderPageTabs = () => {
        const variant = "link"
        const helpText: HelpText | null = helpModalId > 0 ? getHelpText(helpModalId, languageContext.language) : null

        return (
            <div className={"d-flex"}>
                {helpText !== null &&
                <HelpModal helpText={helpText} closeHelpModal={() => setHelpModalId(0)}></HelpModal>
                }
                <ButtonGroup vertical>
                    <Button className="btn btn-link header-link"
                            onClick={() => handlePageButtonClick(TAB_BASE_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_BASE_DATA}>
                        {applicationStrings.label_overview[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link header-link header-link"
                            onClick={() => handlePageButtonClick(TAB_ENERGY_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_ENERGY_DATA}>
                        {applicationStrings.label_nutrient_energy[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link header-link"
                            onClick={() => handlePageButtonClick(TAB_VITAMIN_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_VITAMIN_DATA}>
                        {applicationStrings.label_nutrient_vit[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link page-head-button header-link"
                            onClick={() => handlePageButtonClick(TAB_MINERAL_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_MINERAL_DATA}>
                        {applicationStrings.label_nutrient_min[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link page-head-button header-link"
                            onClick={() => handlePageButtonClick(TAB_LIPIDS_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_LIPIDS_DATA}>
                        {applicationStrings.label_nutrient_lipids[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link page-head-button header-link"
                            onClick={() => handlePageButtonClick(TAB_CARBS_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_CARBS_DATA}>
                        {applicationStrings.label_nutrient_carbohydrates[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link page-head-button header-link"
                            onClick={() => handlePageButtonClick(TAB_PROTEINS_DATA)}
                            variant={variant}
                            active={props.infoPage === TAB_PROTEINS_DATA}>
                        {applicationStrings.label_nutrient_proteins[languageContext.language]}
                    </Button>
                    <Button className="btn btn-link page-head-button header-link"
                            onClick={() => handlePageButtonClick(TAB_INFO)}
                            variant={variant}
                            active={props.infoPage === TAB_INFO}>
                        {applicationStrings.label_info[languageContext.language]}
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    const enabledDisplayButtonClasses = "btn button-displaymode-enabled"
    const disabledDisplayButtonClasses = "btn button-displaymode-disabled"

    const chartButtonClasses = props.displayMode === DISPLAYMODE_CHART ? enabledDisplayButtonClasses
        : disabledDisplayButtonClasses;

    const tablesButtonClasses = props.displayMode === DISPLAYMODE_TABLE ? enabledDisplayButtonClasses
        : disabledDisplayButtonClasses;

    const foodNamesList = applicationContext.foodDataCorpus.foodNames;

    const foodName = getNameFromFoodNameList(foodNamesList, props.selectedFoodItem.foodItem.nameId, languageContext.language)

    console.log('AA:', props.selectedFoodItem.foodItem.conditionId)
    console.log('BB:', applicationContext.foodDataCorpus.conditions)

    const condition = applicationContext.foodDataCorpus.conditions.find(condition => condition.id === props.selectedFoodItem.foodItem.conditionId)
    const conditionName = condition ? getName(condition, languageContext.language) : ""
    const portionSize = props.selectedFoodItem.portion.amount

    console.log('CCC:',  condition)

    const fullName = `${foodName} (${conditionName}, ${portionSize} g)`

    return (
        <div style={{paddingBottom: "6px"}}>
            <div className={"row d-flex flex-nowrap"}>
                <div className="col-md-2 col-sm-3">
                    <div className={"card"}>
                        <div className="card-body" style={{paddingRight: "30px"}}>
                            {renderPageTabs()}
                        </div>
                    </div>
                </div>
                <div className={"col"}>
                    <div className="row d-flex flex-nowrap" style={{marginTop: "10px"}}>
                        <div className="col-md-8" style={{paddingTop: "6px", paddingLeft: "32px"}}>
                            <div style={{borderBottom: "1px solid #BBBBBB", paddingLeft: "12px"}}>
                                <b>{fullName}</b>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <div style={{width: "200px", padding: "0px !important", margin: "0px !important"}}>
                                <div className="btn-group" role="group">
                                    <Button className={chartButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_CHART)}
                                            active={props.displayMode === DISPLAYMODE_CHART}
                                            data-tip={applicationStrings.tooltip_icon_charts[languageContext.language]}>
                                        <ReactTooltip/>
                                        <FaChartBar/>
                                    </Button>
                                    <Button className={tablesButtonClasses}
                                            onClick={() => handleRadioButtonClick(DISPLAYMODE_TABLE)}
                                            active={props.displayMode === DISPLAYMODE_TABLE}
                                            data-tip={applicationStrings.tooltip_icon_table[languageContext.language]}>
                                        <FaThList/>
                                    </Button>
                                </div>

                                <div className="btn-group" role="group" style={{paddingLeft: "24px"}}>
                                    <Button className={"btn-primary button-foodPanelHead"}
                                            onClick={help}
                                            active={props.displayMode === DISPLAYMODE_CHART}>
                                        <ReactTooltip/>
                                        <FaQuestionCircle/>
                                    </Button>
                                    <Button className={"button-closeTab"}
                                            onClick={closeTab}
                                            data-tip={applicationStrings.tooltip_icon_close[languageContext.language]}>
                                        <ReactTooltip/>
                                        <FaTimes/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FoodDataPageBody selectedFoodItem={props.selectedFoodItem}
                                      tableData={props.tableData}
                                      displayMode={props.displayMode}
                                      selectedDataTab={props.selectedDataTab}
                    />
                </div>
            </div>
        </div>
    );

}