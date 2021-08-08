import {ChartMenuPanel} from "../fooddatapanel/ChartMenuPanel";
import {
    CHART_MINERALS,
    CHART_VITAMINS,
    TAB_BASE_DATA, TAB_CARBS_DATA,
    TAB_ENERGY_DATA, TAB_INFO,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {useContext, useState} from "react";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {DC_MineralVitaminChart} from "./DC_MineralVitaminChart";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {Card} from "react-bootstrap";
import {DC_PieChart} from "./DC_PieChart";
import {DC_ProteinDataChart} from "./DC_ProteinDataChart";
import {DC_EnergyChart} from "./DC_EnergyChart";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import {LanguageContext} from "../../contexts/LangContext";
import {DirectCompareDataPanelProps} from "../../types/livedata/ChartPropsData";
import ProteinDataChart from "../fooddatapanel/charts/ProteinDataChart";
import {InfoData} from "../fooddatapanel/charts/InfoData";

export function DirectCompareDataPanel(props: DirectCompareDataPanelProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const initialPage = applicationContext?.applicationData.directCompareDataPanel.selectedDataPage
        ? applicationContext?.applicationData.directCompareDataPanel.selectedDataPage
        : TAB_BASE_DATA

    const [selectedDataTab, setSelectedDataTab] = useState<string>(initialPage)

    if (!applicationContext) {
        return <div/>
    }

    const setDataPage = (datapage: string) => {
        applicationContext.setDirectCompareData.setSelectedDirectCompareDataPage(datapage)
        setSelectedDataTab(datapage)
    }

    const foodNames = applicationContext.foodDataCorpus.foodNames

    const nameId1 = props.selectedFoodItem1.foodItem.nameId ? props.selectedFoodItem1.foodItem.nameId : null
    const nameId2 = props.selectedFoodItem2.foodItem.nameId ? props.selectedFoodItem2.foodItem.nameId : null

    const name1 = nameId1 ? getNameFromFoodNameList(foodNames, nameId1, languageContext.language) : ""
    const name2 = nameId2 ? getNameFromFoodNameList(foodNames, nameId2, languageContext.language) : ""

    const selectedFoodItem1: SelectedFoodItem = {...props.selectedFoodItem1, resolvedName: name1}
    const selectedFoodItem2: SelectedFoodItem = {...props.selectedFoodItem2, resolvedName: name2}

    const renderCharts = () => {
        switch (selectedDataTab) {
            case TAB_BASE_DATA:
                return <DC_PieChart key={TAB_BASE_DATA}
                                    selectedFoodItem1={selectedFoodItem1}
                                    selectedFoodItem2={selectedFoodItem2}
                                    dataPage={TAB_BASE_DATA}
                />
            case TAB_ENERGY_DATA:
                return <DC_EnergyChart selectedFoodItem1={selectedFoodItem1}
                                       selectedFoodItem2={selectedFoodItem2}
                />

            case TAB_VITAMIN_DATA:
                return <DC_MineralVitaminChart key={TAB_VITAMIN_DATA}
                                               selectedFoodItem1={selectedFoodItem1}
                                               selectedFoodItem2={selectedFoodItem2}
                                               selectedSubChart={CHART_VITAMINS}
                />
            case TAB_MINERAL_DATA:
                return <DC_MineralVitaminChart key={TAB_MINERAL_DATA}
                                               selectedFoodItem1={selectedFoodItem1}
                                               selectedFoodItem2={selectedFoodItem2}
                                               selectedSubChart={CHART_MINERALS}
                />
            case TAB_LIPIDS_DATA:
                return <DC_PieChart key={TAB_LIPIDS_DATA}
                                    selectedFoodItem1={selectedFoodItem1}
                                    selectedFoodItem2={selectedFoodItem2}
                                    dataPage={TAB_LIPIDS_DATA}
                />
            case TAB_CARBS_DATA:
                return <DC_PieChart key={TAB_CARBS_DATA}
                                    selectedFoodItem1={selectedFoodItem1}
                                    selectedFoodItem2={selectedFoodItem2}
                                    dataPage={TAB_CARBS_DATA}
                />
            case TAB_PROTEINS_DATA:
                return <DC_ProteinDataChart selectedFoodItem1={selectedFoodItem1}
                                            selectedFoodItem2={selectedFoodItem2}
                />
            case TAB_INFO:
                return <div>
                    <Card>
                        <InfoData selectedFoodItem={props.selectedFoodItem1} directCompare={true}/>
                    </Card>
                    <Card>
                        <InfoData selectedFoodItem={props.selectedFoodItem2} directCompare={true}/>
                    </Card>
                </div>

        }

        return <div/>
    }

    return <div>
        <Card.Header>
            <ChartMenuPanel dataPage={selectedDataTab} verticalArrangement={false} setDataPage={setDataPage}/>
        </Card.Header>
        {renderCharts()}
    </div>

}