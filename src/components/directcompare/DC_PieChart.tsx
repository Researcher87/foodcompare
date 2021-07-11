import {DirectCompareDataPanelProps} from "./DirectCompareDataPanel";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {PieChartConfigurationForm} from "../charthelper/PieChartConfigurationForm";
import {Card} from "react-bootstrap";
import BaseDataChart from "../fooddatapanel/charts/BaseDataChart";
import {LIPIDS_DATA_BASE, TAB_BASE_DATA, TAB_CARBS_DATA, TAB_LIPIDS_DATA} from "../../config/Constants";
import LipidsDataChart from "../fooddatapanel/charts/LipidsDataChart";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";

interface PieChartDirectCompareProp extends DirectCompareDataPanelProps {
    chartType: string
}

/**
 *
 */
export function DC_PieChart(props: PieChartDirectCompareProp) {
    const applicationContext = useContext(ApplicationDataContextStore)

    let initialConfig
    switch (props.chartType) {
        case TAB_BASE_DATA:
            initialConfig = applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
                ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
                : initialDirectCompareConfigData.baseChartConfig
            break
        case TAB_LIPIDS_DATA:
            initialConfig = applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig
                ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig
                : initialDirectCompareConfigData.lipidsChartConfig
            break
    }


    const [chartType, setChartType] = useState<string>(initialConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(initialConfig.showLegend)
    const [showDetails, setShowDetails] = useState<boolean>(initialConfig.showDetails)

    useEffect(() => {
        updateChartConfig()
    }, [chartType, showDetails, showLegend])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            const pieChartConfig = {
                chartType: chartType,
                showDetails: showDetails,
                showLegend: showLegend
            }

            let newChartConfig

            if (props.chartType === TAB_BASE_DATA) {
                newChartConfig = {
                    ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                    baseChartConfig: pieChartConfig
                }
            }

            if (props.chartType === TAB_LIPIDS_DATA) {
                newChartConfig = {
                    ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                    lipids: pieChartConfig
                }
            }

            if (newChartConfig) {
                applicationContext.applicationData.directCompareDataPanel.updateDirectCompareChartConfig(newChartConfig)
            }
        }
    }

    const handleRadioButtonClick = (event: any): void => {
        setChartType(event.target.value)
    }

    const handleShowLegendCheckbox = () => {
        setShowLegend(!showLegend)
    }

    const handleShowDetailsCheckbox = () => {
        setShowDetails(!showDetails)
    }

    const renderChartConfigurationForm = () => {
        const chartProps = getConfigurationProps()
        return <PieChartConfigurationForm {...chartProps}/>
    }


    const getConfigurationProps = () => {
        let chartProps: any = {
            chartType: chartType,
            showLegend: showLegend,
            handleRadioButtonClick: handleRadioButtonClick,
            handleLegendCheckboxClick: handleShowLegendCheckbox
        }

        if(props.chartType === TAB_BASE_DATA) {
            chartProps = {...chartProps,
                detailsCheckboxAvailable: true,
                showDetails: showDetails,
                handleDetailsCheckboxClick: handleShowDetailsCheckbox
            }
        }

        return chartProps
    }


    let preconfig: any = {
        chartType: chartType,
        showLegend: showLegend,
        showDetails: showDetails,
    }

    const getChartComponent = (selectedFoodItem: SelectedFoodItem, index: number) => {
        if (props.chartType === TAB_BASE_DATA) {
            return <BaseDataChart selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                  directCompareConfig={preconfig}/>
        }
        if (props.chartType === TAB_LIPIDS_DATA) {
            const selectedSubChart = applicationContext
                ? index === 1
                    ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart1
                    : applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart2
                : LIPIDS_DATA_BASE

            preconfig = {
                ...preconfig,
                subChart: selectedSubChart,
                chartIndex: index
            }

            return <LipidsDataChart selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                  directCompareConfig={preconfig}/>
        }
    }


    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{props.selectedFoodItem1.resolvedName}</div>
                {getChartComponent(props.selectedFoodItem1, 1)}
            </div>
        </Card>

        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{props.selectedFoodItem2.resolvedName}</div>
                {getChartComponent(props.selectedFoodItem2, 2)}
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}