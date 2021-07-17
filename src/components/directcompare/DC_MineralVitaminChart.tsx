import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import {CHART_VITAMINS} from "../../config/Constants";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {BarChartConfigurationForm} from "../charthelper/BarChartConfigurationForm";
import {roundToNextValue} from "../../service/calculation/MathService";
import {getMaximumValue, nullifyIncompleValues} from "../../service/calculation/NutrientCalculationService";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {Card} from "react-bootstrap";
import {DC_MineralVitaminChartProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import {calculateChartContainerHeight} from "../../service/nutrientdata/ChartSizeCalculation";

export function DC_MineralVitaminChart(props: DC_MineralVitaminChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const windowSize = useWindowDimension()

    const chartConfigVitamins = applicationContext
        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.vitaminChartConfig
        : initialDirectCompareConfigData.vitaminChartConfig

    const chartConfigMinerals = applicationContext
        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.mineralChartConfig
        : initialDirectCompareConfigData.mineralChartConfig

    const [portionType_vitamins, setPortionType_vitamins] = useState<string>(chartConfigVitamins.portionType)
    const [portionType_minerals, setPortionType_minerals] = useState<string>(chartConfigMinerals.portionType)
    const [expand100_vitamins, setExpand100_vitamins] = useState<boolean>(chartConfigVitamins.expand100)
    const [expand100_minerals, setExpand100_minerals] = useState<boolean>(chartConfigMinerals.expand100)
    const [synchronizeVitamins, setSynchronizeVitamins] = useState<boolean>(chartConfigVitamins.synchronize)
    const [synchronizeMinerals, setSynchronizeMinerals] = useState<boolean>(chartConfigMinerals.synchronize)

    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        updateChartConfig()
        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [portionType_minerals, portionType_vitamins, synchronizeVitamins, synchronizeMinerals, expand100_vitamins, expand100_minerals, containerHeight])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            const newChartConfig = {
                ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                vitaminChartConfig: {
                    portionType: portionType_vitamins,
                    expand100: expand100_vitamins,
                    synchronize: synchronizeVitamins
                },
                mineralChartConfig: {
                    portionType: portionType_minerals,
                    expand100: expand100_minerals,
                    synchronize: synchronizeMinerals
                }
            }
            applicationContext.applicationData.directCompareDataPanel.updateDirectCompareChartConfig(newChartConfig)
        }
    }

    const requirementData = props.selectedSubChart === CHART_VITAMINS
        ? applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData
        : applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData

    if (!requirementData) {
        return <div></div>
    }

    const handleRadioButtonClick = (event: any): void => {
        props.selectedSubChart === CHART_VITAMINS ? setPortionType_vitamins(event.target.value) : setPortionType_minerals(event.target.value)
    }

    const handleExpandCheckbox = () => {
        props.selectedSubChart === CHART_VITAMINS ? setExpand100_vitamins(!expand100_vitamins) : setExpand100_minerals(!expand100_minerals)
    }

    const handleSynchronize = () => {
        props.selectedSubChart === CHART_VITAMINS ? setSynchronizeVitamins(!synchronizeVitamins) : setSynchronizeMinerals(!synchronizeMinerals)
    }

    const renderChartConfigurationForm = () => {
        const portionType = props.selectedSubChart === CHART_VITAMINS ? portionType_vitamins : portionType_minerals
        const expand100 = props.selectedSubChart === CHART_VITAMINS ? expand100_vitamins : expand100_minerals
        const synchronize = props.selectedSubChart === CHART_VITAMINS ? synchronizeVitamins : synchronizeMinerals

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


    const nutrientData1 = props.selectedFoodItem1.foodItem.nutrientDataList[0]
    const nutrientData2 = props.selectedFoodItem2.foodItem.nutrientDataList[0]

    const dataSet1 = props.selectedSubChart === CHART_VITAMINS ? nutrientData1.vitaminData : nutrientData1.mineralData
    const dataSet2 = props.selectedSubChart === CHART_VITAMINS ? nutrientData2.vitaminData : nutrientData2.mineralData

    const maxValue1 = getMaximumValue(dataSet1, props.selectedFoodItem1.portion.amount, requirementData, applicationContext.userData)
    const maxValue2 = getMaximumValue(dataSet2, props.selectedFoodItem2.portion.amount, requirementData, applicationContext.userData)
    const maxValue = Math.max(maxValue1, maxValue2)

    const synchronize = props.selectedSubChart === CHART_VITAMINS ? synchronizeVitamins : synchronizeMinerals

    if (synchronize) {
        nullifyIncompleValues(dataSet1, dataSet2)
    }

    const maxY = synchronize
        ? roundToNextValue(maxValue) : undefined

    const preconfigVitamins = {
        maxValue: maxY,
        portionType: portionType_vitamins,
        expand100: expand100_vitamins,
        synchronize: synchronizeVitamins
    }

    const preconfigMinerals = {
        maxValue: maxY,
        portionType: portionType_minerals,
        expand100: expand100_minerals,
        synchronize: synchronizeMinerals
    }

    const preconfig = props.selectedSubChart === CHART_VITAMINS ? preconfigVitamins : preconfigMinerals

    const preconfigFoodItem1 = {...preconfig, barChartColor: direct_compare_color1}
    const preconfigFoodItem2 = {...preconfig, barChartColor: direct_compare_color2}

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <MineralVitaminChart selectedSubChart={props.selectedSubChart}
                                     selectedFoodItem={props.selectedFoodItem1}
                                     directCompareUse={true} directCompareConfig={preconfigFoodItem1}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <MineralVitaminChart selectedSubChart={props.selectedSubChart}
                                     selectedFoodItem={props.selectedFoodItem2}
                                     directCompareUse={true} directCompareConfig={preconfigFoodItem2}/>
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}