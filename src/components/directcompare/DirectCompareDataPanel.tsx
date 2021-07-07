import {ChartMenuPanel} from "../fooddatapanel/ChartMenuPanel";
import {
    CHART_MINERALS,
    CHART_VITAMINS,
    TAB_BASE_DATA,
    TAB_INFO,
    TAB_MINERAL_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {useState} from "react";
import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {DC_MineralVitaminChart} from "./DC_MineralVitaminChart";

export interface DirectCompareDataPanelProps {
    selectedFoodItem1: SelectedFoodItem
    selectedFoodItem2: SelectedFoodItem
}

export function DirectCompareDataPanel(props: DirectCompareDataPanelProps) {

    const [selectedDataTab, setSelectedDataTab] = useState<string>(TAB_BASE_DATA)

    const setInfoPage = (datapage: string) => {
        setSelectedDataTab(datapage)
    }

    const renderCharts = () => {

        switch (selectedDataTab) {
            case TAB_VITAMIN_DATA:
                return <DC_MineralVitaminChart selectedFoodItem1={props.selectedFoodItem1}
                                               selectedFoodItem2={props.selectedFoodItem2}
                                               chartType={CHART_VITAMINS}
                />
            case TAB_MINERAL_DATA:
                return <DC_MineralVitaminChart selectedFoodItem1={props.selectedFoodItem1}
                                               selectedFoodItem2={props.selectedFoodItem2}
                                               chartType={CHART_MINERALS}
                />
        }

        return <div/>

    }

    return <div>
        <ChartMenuPanel infoPage={selectedDataTab} verticalArrangement={false} setInfoPage={setInfoPage}/>
        {renderCharts()}
    </div>

}