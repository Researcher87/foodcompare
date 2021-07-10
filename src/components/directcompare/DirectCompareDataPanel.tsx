import {ChartMenuPanel} from "../fooddatapanel/ChartMenuPanel";
import {
    CHART_MINERALS,
    CHART_VITAMINS,
    TAB_BASE_DATA,
    TAB_INFO,
    TAB_MINERAL_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {useContext, useState} from "react";
import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {DC_MineralVitaminChart} from "./DC_MineralVitaminChart";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {Card} from "react-bootstrap";
import {DC_BaseDataChart} from "./DC_BaseDataChart";

export interface DirectCompareDataPanelProps {
    selectedFoodItem1: SelectedFoodItem
    selectedFoodItem2: SelectedFoodItem
}

export function DirectCompareDataPanel(props: DirectCompareDataPanelProps) {
    const applicationContext = useContext(ApplicationDataContextStore)

    const initialPage = applicationContext?.applicationData.directCompareDataPanel.selectedDataPage
        ? applicationContext?.applicationData.directCompareDataPanel.selectedDataPage
        : TAB_BASE_DATA

    const [selectedDataTab, setSelectedDataTab] = useState<string>(initialPage)

    if (!applicationContext) {
        return <div/>
    }

    const setDataPage = (datapage: string) => {
        applicationContext.applicationData.directCompareDataPanel.setSelectedDirectCompareDataPage(datapage)
        setSelectedDataTab(datapage)
    }

    const renderCharts = () => {

        switch (selectedDataTab) {
            case TAB_BASE_DATA:
                return <DC_BaseDataChart selectedFoodItem1={props.selectedFoodItem1}
                                         selectedFoodItem2={props.selectedFoodItem2}
                />
            case TAB_VITAMIN_DATA:
                return <DC_MineralVitaminChart selectedFoodItem1={props.selectedFoodItem1}
                                               selectedFoodItem2={props.selectedFoodItem2}
                                               selectedSubChart={CHART_VITAMINS}
                />
            case TAB_MINERAL_DATA:
                return <DC_MineralVitaminChart selectedFoodItem1={props.selectedFoodItem1}
                                               selectedFoodItem2={props.selectedFoodItem2}
                                               selectedSubChart={CHART_MINERALS}
                />
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