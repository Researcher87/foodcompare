import {Card} from "react-bootstrap";
import EnergyDataChart from "../fooddatapanel/charts/EnergyDataChart";
import {DirectCompareDataPanelProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import {useEffect, useState} from "react";
import {calculateChartContainerHeight} from "../../service/nutrientdata/ChartSizeCalculation";

export function DC_EnergyChart(props: DirectCompareDataPanelProps) {
    const windowSize = useWindowDimension()
    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [containerHeight])

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <div className={"vertical-label"}>{props.selectedFoodItem1.resolvedName}</div>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem1} directCompareUse={true}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <div className={"vertical-label"}>{props.selectedFoodItem2.resolvedName}</div>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem2} directCompareUse={true}/>
            </div>
        </Card>
    </div>

}