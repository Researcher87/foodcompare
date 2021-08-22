import BaseDataChart from "./charts/BaseDataChart";
import EnergyDataChart from "./charts/EnergyDataChart";
import {
    CHART_MINERALS,
    CHART_VITAMINS,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import MineralVitaminChart from "./charts/MineralVitaminChart";
import LipidsDataChart from "./charts/LipidsDataChart";
import ProteinDataChart from "./charts/ProteinDataChart";
import CarbsDataChart from "./charts/CarbsDataChart";
import {ChartProps} from "../../types/livedata/ChartPropsData";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";

export function ChartPanel(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    if (!applicationContext) {
        return <div/>
    }

    const selectedDataTab = applicationContext.applicationData.foodDataPanel.selectedDataPage

    let chart = <div>Nothing to show</div>;
    if (selectedDataTab === TAB_BASE_DATA) {
        chart = <BaseDataChart selectedFoodItem={props.selectedFoodItem}/>
    } else if (selectedDataTab === TAB_ENERGY_DATA) {
        chart = <EnergyDataChart selectedFoodItem={props.selectedFoodItem}/>
    } else if (selectedDataTab === TAB_VITAMIN_DATA) {
        chart = <MineralVitaminChart selectedFoodItem={props.selectedFoodItem} selectedSubChart={CHART_VITAMINS}/>
    } else if (selectedDataTab === TAB_MINERAL_DATA) {
        chart = <MineralVitaminChart selectedFoodItem={props.selectedFoodItem} selectedSubChart={CHART_MINERALS}/>
    } else if (selectedDataTab === TAB_LIPIDS_DATA) {
        chart = <LipidsDataChart selectedFoodItem={props.selectedFoodItem}/>
    } else if (selectedDataTab === TAB_CARBS_DATA) {
        chart = <CarbsDataChart selectedFoodItem={props.selectedFoodItem}/>
    } else if (selectedDataTab === TAB_PROTEINS_DATA) {
        chart = <ProteinDataChart selectedFoodItem={props.selectedFoodItem}/>
    }

    return (
        <div style={{paddingTop: "24px"}}>
            {chart}
        </div>
    )
}