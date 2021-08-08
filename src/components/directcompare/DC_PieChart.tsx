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
    GeneralChartConfigDirectCompareWithSubCharts,
    GeneralChartConfigWithDetails
} from "../../types/livedata/ChartConfigData";
import {calculateChartContainerHeight} from "../../service/nutrientdata/ChartSizeCalculation";
import {useWindowDimension} from "../../service/WindowDimension";

/**
 * Re-usable direct compare chart component for pie-chart data pages (Lipids, Carbs, Base Data)
 */
export function DC_PieChart(props: PieChartDirectCompareProp) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const windowSize = useWindowDimension()

    let initialConfig
    switch (props.dataPage) {
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

    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, true))

    useEffect(() => {
        const currentConfig = applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart

        if (!currentConfig) {
            return
        }

        if (props.dataPage === TAB_LIPIDS_DATA || props.dataPage === TAB_CARBS_DATA) {
            const configObject: GeneralChartConfigDirectCompareWithSubCharts = props.dataPage === TAB_LIPIDS_DATA
                ? currentConfig.lipidsChartConfig
                : currentConfig.carbsChartConfig

            if (chartType !== configObject.chartType || showLegend !== configObject.showLegend
                || subChart1 !== configObject.subChart1 || subChart2 !== configObject.subChart2) {
                updateChartConfig()
            }
        } else if (props.dataPage === TAB_BASE_DATA) {
            const configObject: GeneralChartConfigWithDetails = currentConfig.baseChartConfig
            if (chartType !== configObject.chartType || showLegend !== configObject.showLegend || showDetails !== configObject?.showDetails) {
                updateChartConfig()
            }
        }

        setContainerHeight(calculateChartContainerHeight(windowSize, true))
    }, [chartType, showDetails, showLegend, subChart1, subChart2, containerHeight, windowSize.height])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            let newChartConfig

            if (props.dataPage === TAB_BASE_DATA) {
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

                if (props.dataPage === TAB_LIPIDS_DATA) {
                    newChartConfig = {
                        ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                        lipidsChartConfig: pieChartConfig
                    }
                } else if (props.dataPage === TAB_CARBS_DATA) {
                    newChartConfig = {
                        ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                        carbsChartConfig: pieChartConfig
                    }
                }
            }

            if (newChartConfig) {
                applicationContext.setDirectCompareData.updateDirectCompareChartConfig(newChartConfig)
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
        return <PieChartConfigurationForm key = {`Config ${props.dataPage}`} {...chartProps}/>
    }

    const getConfigurationProps = (): PieChartConfigurationProps => {
        let chartProps: PieChartConfigurationProps = {
            chartType: chartType,
            showLegend: showLegend,
            handleRadioButtonClick: handleRadioButtonClick,
            handleLegendCheckboxClick: handleShowLegendCheckbox,
        }

        if (props.dataPage === TAB_BASE_DATA) {
            chartProps = {
                ...chartProps,
                detailsCheckboxAvailable: true,
                showDetails: showDetails,
                handleDetailsCheckboxClick: handleShowDetailsCheckbox
            }
        }

        return chartProps
    }


    const getChartComponent = (selectedFoodItem: SelectedFoodItem, index: number) => {
        let preconfig: PieChartDirectCompareConfig = {
            chartType: chartType,
            showLegend: showLegend,
            showDetails: showDetails,
        }

        if (props.dataPage === TAB_BASE_DATA) {
            return <BaseDataChart key = {`${TAB_BASE_DATA} ${index}`} selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                  directCompareConfig={preconfig}/>
        }

        if (props.dataPage === TAB_LIPIDS_DATA) {
            const selectedSubChart = applicationContext
                ? index === 1
                    ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart1
                        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart1
                        : LIPIDS_DATA_BASE
                    : applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart2
                        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.lipidsChartConfig.subChart2
                        : LIPIDS_DATA_BASE
                : LIPIDS_DATA_BASE

            preconfig = {
                ...preconfig,
                subChart: selectedSubChart,
                handleSubchartChange: index === 1 ? handleSubchart1Change : handleSubchart2Change,
                chartIndex: index
            }

            return <LipidsDataChart key = {`${TAB_LIPIDS_DATA} ${index}`} selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                    directCompareConfig={preconfig}/>
        }

        if (props.dataPage === TAB_CARBS_DATA) {
            const selectedSubChart = applicationContext
                ? index === 1
                    ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart1
                        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart1
                        : CARBS_DATA_BASE
                    : applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart2
                        ? applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart.carbsChartConfig.subChart2
                        : CARBS_DATA_BASE
                : CARBS_DATA_BASE

            preconfig = {
                ...preconfig,
                subChart: selectedSubChart,
                chartIndex: index,
                handleSubchartChange: index === 1 ? handleSubchart1Change : handleSubchart2Change
            }

            return <CarbsDataChart key = {`${TAB_CARBS_DATA} ${index}`} selectedFoodItem={selectedFoodItem} directCompareUse={true}
                                   directCompareConfig={preconfig}/>
        }
    }

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}} key={"directcompare container" + containerHeight}>
                <div className={"vertical-label"}>{props.selectedFoodItem1.resolvedName}</div>
                {getChartComponent(props.selectedFoodItem1, 1)}
            </div>
        </Card>

        <Card>
            <div className={"d-flex"} style={{maxHeight: containerHeight}} key={"directcompare container" + containerHeight}>
                <div className={"vertical-label"}>{props.selectedFoodItem2.resolvedName}</div>
                {getChartComponent(props.selectedFoodItem2, 2)}
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}