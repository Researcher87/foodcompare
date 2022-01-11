import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../charthelper/BarChartConfigurationForm";
import {roundToNextValue} from "../../service/calculation/MathService";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";
import {Card} from "react-bootstrap";
import ProteinDataChart from "../fooddatapanel/charts/ProteinDataChart";
import {BarChartDirectCompareConfig, DirectCompareDataPanelProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import {calculateChartContainerHeight} from "../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../service/nutrientdata/NutrientDataRetriever";
import {
    getMaximumValue,
    getOverlappingValues,
    nullifyNonOverlappingValues
} from "../../service/calculation/NutrientCalculationService";

export function DcProteinDataChart(props: DirectCompareDataPanelProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const windowSize = useWindowDimension()

    const chartConfig = applicationContext
        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.proteinChartConfig
        : initialDirectCompareConfigData.proteinChartConfig

    const [portionType, setPortionType] = useState<string>(chartConfig.portionType)
    const [expand100, setExpand100] = useState<boolean>(chartConfig.expand100)
    const [synchronize, setSynchronize] = useState<boolean>(chartConfig.synchronize)

    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        updateChartConfig()
        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [portionType, expand100, synchronize, containerHeight, windowSize.height])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            const newChartConfig = {
                ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                proteinChartConfig: {
                    portionType: portionType,
                    expand100: expand100,
                    synchronize: synchronize
                }
            }
            applicationContext.setDirectCompareData.updateDirectCompareChartConfig(newChartConfig)
        }
    }

    const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.proteinRequirementData
    if (!requirementData) {
        return <div/>
    }

    const handleRadioButtonClick = (event: any): void => {
        setPortionType(event.target.value)
    }

    const handleExpandCheckbox = () => {
        setExpand100(!expand100)
    }

    const handleSynchronize = () => {
        setSynchronize(!synchronize)
    }

    const renderChartConfigurationForm = () => {
        const barChartProps = {
            portionType: portionType,
            expand100: expand100,
            synchronize: synchronize,
            handleRadioButtonClick: handleRadioButtonClick,
            handleExpandCheckboxClick: handleExpandCheckbox,
            handleSynchronize: handleSynchronize
        }

        return <BarChartConfigurationForm {...barChartProps}/>
    }

    let dataSet1 = getNutrientData(props.selectedFoodItem1).proteinData
    let dataSet2 = getNutrientData(props.selectedFoodItem2).proteinData

    if (synchronize) {
        const overlappingAttributes = getOverlappingValues(dataSet1, dataSet2)
        dataSet1 = nullifyNonOverlappingValues(dataSet1, overlappingAttributes)
        dataSet2 = nullifyNonOverlappingValues(dataSet2, overlappingAttributes)
    }

    const maxValue1 = getMaximumValue(dataSet1, props.selectedFoodItem1.portion.amount, requirementData, applicationContext.userData, true)
    const maxValue2 = getMaximumValue(dataSet2, props.selectedFoodItem2.portion.amount, requirementData, applicationContext.userData, true)
    const maxValue = Math.max(maxValue1, maxValue2)
    const maxY = synchronize ? roundToNextValue(maxValue) : undefined

    const preconfig: BarChartDirectCompareConfig = {
        maxValue: maxY,
        portionType: portionType,
        expand100: expand100,
        synchronize: synchronize,
        barChartColor: ''
    }

    const preconfigFoodItem1 = {...preconfig, barChartColor: direct_compare_color1}
    const preconfigFoodItem2 = {...preconfig, barChartColor: direct_compare_color2}

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <div className={"vertical-label"}>{props.selectedFoodItem1.resolvedName}</div>
                <ProteinDataChart selectedFoodItem={props.selectedFoodItem1}
                                  precalculatedData={dataSet1}
                                  directCompareUse={true} directCompareConfig={preconfigFoodItem1}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <div className={"vertical-label"}>{props.selectedFoodItem2.resolvedName}</div>
                <ProteinDataChart selectedFoodItem={props.selectedFoodItem2}
                                  precalculatedData={dataSet2}
                                  directCompareUse={true} directCompareConfig={preconfigFoodItem2}/>
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}