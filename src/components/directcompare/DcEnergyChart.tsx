import {Card} from "react-bootstrap";
import EnergyDataChart from "../fooddatapanel/charts/EnergyDataChart";
import {DirectCompareDataPanelProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import React, {useEffect, useState} from "react";
import {calculateChartContainerHeight} from "../../service/ChartSizeCalculation";
import {VerticalLabel} from "./VerticalLabel";

export function DcEnergyChart(props: DirectCompareDataPanelProps) {
    const windowSize = useWindowDimension()
    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [containerHeight, windowSize])

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight, marginBottom: "2vh"}}>
                <VerticalLabel selectedFoodItem={props.selectedFoodItem1}/>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem1} directCompareUse={true}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight, marginBottom: "2vh"}}>
                <VerticalLabel selectedFoodItem={props.selectedFoodItem2}/>
                <EnergyDataChart selectedFoodItem={props.selectedFoodItem2} directCompareUse={true}/>
            </div>
        </Card>
    </div>

}