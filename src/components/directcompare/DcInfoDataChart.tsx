import {Card} from "react-bootstrap";
import {InfoData} from "../fooddatapanel/charts/InfoData";
import {DirectCompareDataPanelProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import {useEffect, useState} from "react";
import {calculateChartContainerHeight} from "../../service/ChartSizeCalculation";


export function DcInfoDataChart(props: DirectCompareDataPanelProps) {
    const windowSize = useWindowDimension()
    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [containerHeight])


    return <div>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <InfoData selectedFoodItem={props.selectedFoodItem1} directCompare={true}/>
            </div>
        </Card>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <InfoData selectedFoodItem={props.selectedFoodItem2} directCompare={true}/>
            </div>
        </Card>
    </div>

}