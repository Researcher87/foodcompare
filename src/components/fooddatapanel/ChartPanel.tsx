import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import BaseDataChart from "./charts/BaseDataChart";
import EnergyDataChart from "./charts/EnergyDataChart";
import {
    CHART_MINERALS,
    CHART_VITAMINS,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_INFO,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import MineralVitaminChart from "./charts/MineralVitaminChart";
import LipidsDataChart from "./charts/LipidsDataChart";
import ProteinDataChart from "./charts/ProteinDataChart";
import CarbsDataChart from "./charts/CarbsDataChart";
import {InfoData} from "./charts/InfoData";

export interface ChartProps {
    selectedFoodItem: SelectedFoodItem
    directCompareUse?: boolean
}

interface ChartPanelProps extends ChartProps {
    selectedDataTab: string
}

export function ChartPanel(props: ChartPanelProps) {

        let chart = <div>Nothing to show</div>;
        if(props.selectedDataTab === TAB_BASE_DATA) {
            chart = <BaseDataChart selectedFoodItem={props.selectedFoodItem} />
        } else if(props.selectedDataTab === TAB_ENERGY_DATA) {
            chart = <EnergyDataChart selectedFoodItem={props.selectedFoodItem} />
        } else if(props.selectedDataTab === TAB_VITAMIN_DATA) {
            chart = <MineralVitaminChart selectedFoodItem={props.selectedFoodItem} selectedSubChart={CHART_VITAMINS} />
        } else if(props.selectedDataTab === TAB_MINERAL_DATA) {
            chart = <MineralVitaminChart selectedFoodItem={props.selectedFoodItem} selectedSubChart={CHART_MINERALS} />
        } else if(props.selectedDataTab === TAB_LIPIDS_DATA) {
            chart = <LipidsDataChart selectedFoodItem={props.selectedFoodItem}  />
        } else if(props.selectedDataTab === TAB_CARBS_DATA) {
            chart = <CarbsDataChart selectedFoodItem={props.selectedFoodItem}  />
        } else if(props.selectedDataTab === TAB_PROTEINS_DATA) {
            chart = <ProteinDataChart selectedFoodItem={props.selectedFoodItem}  />
        }

        return(
            <div style={{paddingTop: "24px"}}>
                {chart}
            </div>
        )
}