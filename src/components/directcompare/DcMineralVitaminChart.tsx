import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import {AMOUNT_PORTION, CHART_VITAMINS} from "../../config/Constants";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {BarChartConfigurationForm} from "../charthelper/BarChartConfigurationForm";
import {roundToNextValue} from "../../service/calculation/MathService";
import {
    getMaximumValue,
    getOverlappingValues,
    nullifyNonOverlappingValues
} from "../../service/calculation/NutrientCalculationService";
import {direct_compare_color1, direct_compare_color2} from "../../config/ChartConfig";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {Card} from "react-bootstrap";
import {DC_MineralVitaminChartProps} from "../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../service/WindowDimension";
import {calculateChartContainerHeight} from "../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../service/nutrientdata/NutrientDataRetriever";
import {VerticalLabel} from "./VerticalLabel";
import {callEvent} from "../../service/GA_EventService";
import {
    GA_ACTION_DATAPANEL_MINERALS_CONFIG,
    GA_ACTION_DATAPANEL_VITAMINS_CONFIG,
    GA_CATEGORY_DATAPANEL
} from "../../config/GA_Events";

export function DcMineralVitaminChart(props: DC_MineralVitaminChartProps) {
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
    }, [portionType_minerals,
        portionType_vitamins,
        synchronizeVitamins,
        synchronizeMinerals,
        expand100_vitamins,
        expand100_minerals,
        containerHeight,
        windowSize]
    )

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
            applicationContext.setDirectCompareData.updateDirectCompareChartConfig(newChartConfig)
        }
    }

    const requirementData = props.selectedSubChart === CHART_VITAMINS
        ? applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData
        : applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData

    if (!requirementData) {
        return <div></div>
    }

    const handleRadioButtonClick = (event: any): void => {
        const value = event.target.value
        const action = props.selectedSubChart === CHART_VITAMINS
            ? GA_ACTION_DATAPANEL_VITAMINS_CONFIG
            : GA_ACTION_DATAPANEL_MINERALS_CONFIG
        callEvent(applicationContext?.debug, action, GA_CATEGORY_DATAPANEL, value, 2)
        props.selectedSubChart === CHART_VITAMINS ? setPortionType_vitamins(event.target.value) : setPortionType_minerals(value)
    }

    const handleExpandCheckbox = () => {
        const action = props.selectedSubChart === CHART_VITAMINS
            ? GA_ACTION_DATAPANEL_VITAMINS_CONFIG
            : GA_ACTION_DATAPANEL_MINERALS_CONFIG
        const label = props.selectedSubChart === CHART_VITAMINS
            ? "expand100: " + !expand100_vitamins
            : "expand100: " + !expand100_minerals
        callEvent(applicationContext?.debug, action, GA_CATEGORY_DATAPANEL, label, 2)
        props.selectedSubChart === CHART_VITAMINS ? setExpand100_vitamins(!expand100_vitamins) : setExpand100_minerals(!expand100_minerals)
    }

    const handleSynchronize = () => {
        const action = props.selectedSubChart === CHART_VITAMINS
            ? GA_ACTION_DATAPANEL_VITAMINS_CONFIG
            : GA_ACTION_DATAPANEL_MINERALS_CONFIG
        const label = props.selectedSubChart === CHART_VITAMINS
            ? "synchronize: " + !synchronizeVitamins
            : "synchronize: " + !synchronizeMinerals
        callEvent(applicationContext?.debug, action, GA_CATEGORY_DATAPANEL, label, 2)
        props.selectedSubChart === CHART_VITAMINS ? setSynchronizeVitamins(!synchronizeVitamins) : setSynchronizeMinerals(!synchronizeMinerals)
    }

    const portionType = props.selectedSubChart === CHART_VITAMINS ? portionType_vitamins : portionType_minerals

    const renderChartConfigurationForm = () => {
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

    const nutrientData1 = getNutrientData(props.selectedFoodItem1)
    const nutrientData2 = getNutrientData(props.selectedFoodItem2)

    let dataSet1 = props.selectedSubChart === CHART_VITAMINS ? nutrientData1.vitaminData : nutrientData1.mineralData
    let dataSet2 = props.selectedSubChart === CHART_VITAMINS ? nutrientData2.vitaminData : nutrientData2.mineralData

    const synchronize = props.selectedSubChart === CHART_VITAMINS ? synchronizeVitamins : synchronizeMinerals

    if (synchronize) {
        const overlappingAttributes = getOverlappingValues(dataSet1, dataSet2)
        dataSet1 = nullifyNonOverlappingValues(dataSet1, overlappingAttributes)
        dataSet2 = nullifyNonOverlappingValues(dataSet2, overlappingAttributes)
    }

    const portion1 = portionType === AMOUNT_PORTION ? props.selectedFoodItem1.portion.amount : 100
    const portion2 = portionType === AMOUNT_PORTION ? props.selectedFoodItem2.portion.amount : 100

    const maxValue1 = getMaximumValue(dataSet1, portion1, requirementData, applicationContext.userData)
    const maxValue2 = getMaximumValue(dataSet2, portion2, requirementData, applicationContext.userData)
    const maxValue = Math.max(maxValue1, maxValue2)

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
                <VerticalLabel selectedFoodItem={props.selectedFoodItem1}></VerticalLabel>
                <MineralVitaminChart selectedSubChart={props.selectedSubChart}
                                     selectedFoodItem={props.selectedFoodItem1}
                                     precalculatedData={dataSet1}
                                     directCompareUse={true} directCompareConfig={preconfigFoodItem1}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}}>
                <VerticalLabel selectedFoodItem={props.selectedFoodItem2}></VerticalLabel>
                <MineralVitaminChart selectedSubChart={props.selectedSubChart}
                                     selectedFoodItem={props.selectedFoodItem2}
                                     precalculatedData={dataSet2}
                                     directCompareUse={true} directCompareConfig={preconfigFoodItem2}/>
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}