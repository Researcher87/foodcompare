import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {PieChartConfigurationForm} from "../charthelper/PieChartConfigurationForm";
import {Card} from "react-bootstrap";
import BaseDataChart from "../fooddatapanel/charts/BaseDataChart";
import {
    CARBS_DATA_BASE,
    LIPIDS_DATA_BASE,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_LIPIDS_DATA
} from "../../config/Constants";
import LipidsDataChart from "../fooddatapanel/charts/LipidsDataChart";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {
    PieChartConfigurationProps,
    PieChartDirectCompareConfig,
    PieChartDirectCompareProp
} from "../../types/livedata/ChartPropsData";
import CarbsDataChart from "../fooddatapanel/charts/CarbsDataChart";
import {
    DirectCompareChartConfigData,
    GeneralChartConfigDirectCompareWithSubCharts, GeneralChartConfigWithDetails, GeneralChartConfigWithSubCharts
} from "../../types/livedata/ChartConfigData";

/**
 * Re-usable direct compare chart component for pie-chart data pages (Lipids, Carbs, Base Data)
 */
export function DC_PieChart(props: PieChartDirectCompareProp) {
    const applicationContext = useContext(ApplicationDataContextStore)

    let initialConfig
    switch (props.chartType) {
        case TAB_BASE_DATA:
            initialConfig = applicationContext && applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
                ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
                : initialDirectCompareConfigData.baseChartConfig
            break
        case TAB_LIPIDS_DATA:
            initialConfig = applicationContext && applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig
                ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig
                : initialDirectCompareConfigData.lipidsChartConfig
            break
        case TAB_CARBS_DATA:
            initialConfig = applicationContext && applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig
                ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig
                : initialDirectCompareConfigData.carbsChartConfig
            break
    }

    const [chartType, setChartType] = useState<string>(initialConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(initialConfig.showLegend)
    const [showDetails, setShowDetails] = useState<boolean>(initialConfig.showDetails)
    const [subChart1, setSubChart1] = useState<string>(initialConfig.subChart1)
    const [subChart2, setSubChart2] = useState<string>(initialConfig.subChart2)

    useEffect(() => {
        updateChartConfig()
    }, [chartType, showDetails, showLegend, subChart1, subChart2])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            let newChartConfig

            if (props.chartType === TAB_BASE_DATA) {
                const pieChartConfig: GeneralChartConfigWithDetails = {
                    chartType: chartType,
                    showLegend: showLegend,
                    showDetails: showDetails
                }

                newChartConfig = {
                    ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                    baseChartConfig: pieChartConfig
                }
            } else {
                const pieChartConfig: GeneralChartConfigDirectCompareWithSubCharts = {
                    chartType: chartType,
                    showLegend: showLegend,
                    subChart1: subChart1,
                    subChart2: subChart2
                }

                if (props.chartType === TAB_LIPIDS_DATA) {
                    newChartConfig = {
                        ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                        lipidsChartConfig: pieChartConfig
                    }
                } else if (props.chartType === TAB_CARBS_DATA) {
                    newChartConfig = {
                        ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                        carbsChartConfig: pieChartConfig
                    }
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

    const handleSubchart1Change = (event: any): void => {
        setSubChart1(event.target.value)
    }

    const handleSubchart2Change = (event: any): void => {
        setSubChart2(event.target.value)
    }

    const renderChartConfigurationForm = () => {
        const chartProps = getConfigurationProps()
        return <PieChartConfigurationForm {...chartProps}/>
    }


    const getConfigurationProps = (): PieChartConfigurationProps => {
        let chartProps: PieChartConfigurationProps = {
            chartType: chartType,
            showLegend: showLegend,
            handleRadioButtonClick: handleRadioButtonClick,
            handleLegendCheckboxClick: handleShowLegendCheckbox,
        }

        if (props.chartType === TAB_BASE_DATA) {
            chartProps = {
                ...chartProps,
                detailsCheckboxAvailable: true,
                showDetails: showDetails,
                handleDetailsCheckboxClick: handleShowDetailsCheckbox
            }
        }

        return chartProps
    }


    let preconfig: PieChartDirectCompareConfig = {
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
            const selectedSubChart = index === 1
                ? subChart1
                : subChart2

            preconfig = {
                ...preconfig,
                subChart: selectedSubChart,
                handleSubchartChange: index === 1 ? handleSubchart1Change : handleSubchart2Change,
                chartIndex: index
            }

            return <LipidsDataChart selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                    directCompareConfig={preconfig}/>
        }

        if (props.chartType === TAB_CARBS_DATA) {
            const selectedSubChart = applicationContext
                ? index === 1
                    ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart1
                    : applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart2
                : CARBS_DATA_BASE

            preconfig = {
                ...preconfig,
                subChart: selectedSubChart,
                chartIndex: index,
                handleSubchartChange: index === 1 ? handleSubchart1Change : handleSubchart2Change
            }

            return <CarbsDataChart selectedFoodItem={selectedFoodItem} directCompareUse={true}
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