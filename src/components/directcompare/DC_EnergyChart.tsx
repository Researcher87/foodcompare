import {Card} from "react-bootstrap";
import EnergyDataChart from "../fooddatapanel/charts/EnergyDataChart";
import {DirectCompareDataPanelProps} from "./DirectCompareDataPanel";

export function DC_EnergyChart(props: DirectCompareDataPanelProps) {
    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{props.selectedFoodItem1.resolvedName}</div>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem1} directCompareUse={true}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{props.selectedFoodItem2.resolvedName}</div>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem2} directCompareUse={true}/>
            </div>
        </Card>
    </div>

}