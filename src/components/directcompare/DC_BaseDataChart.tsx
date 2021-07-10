import {DirectCompareDataPanelProps} from "./DirectCompareDataPanel";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {CHART_TYPE_PIE, CHART_VITAMINS} from "../../config/Constants";
import {initialDirectCompareConfigData} from "../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../charthelper/BarChartConfigurationForm";
import {PieChartConfigurationForm} from "../charthelper/PieChartConfigurationForm";
import {Card} from "react-bootstrap";
import MineralVitaminChart from "../fooddatapanel/charts/MineralVitaminChart";
import BaseDataChart from "../fooddatapanel/charts/BaseDataChart";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import {LanguageContext} from "../../contexts/LangContext";

export function DC_BaseDataChart(props: DirectCompareDataPanelProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)

    const initialConfig = applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.baseChartConfig
        : initialDirectCompareConfigData.baseChartConfig

    const [chartType, setChartType] = useState<string>(initialConfig.chartType)
    const [showLegend, setShowLegend] = useState<boolean>(initialConfig.showLegend)
    const [showDetails, setShowDetaisls] = useState<boolean>(initialConfig.showDetails)

    useEffect(() => {
        updateChartConfig()
    }, [chartType, showDetails, showLegend])

    if (!applicationContext) {
        return <div/>
    }

    const updateChartConfig = () => {
        if (applicationContext) {
            const newChartConfig = {
                ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                baseChartConfig: {
                    chartType: chartType,
                    showDetails: showDetails,
                    showLegend: showLegend
                }
            }
            applicationContext.applicationData.directCompareDataPanel.updateDirectCompareChartConfig(newChartConfig)
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
        const chartProps = {
            chartType: chartType,
            showLegend: showLegend,
            showDetails: showDetails,
            detailsCheckboxAvailable: true,
            handleRadioButtonClick: handleRadioButtonClick,
            handleDetailsCheckboxClick: handleShowDetailsCheckbox,
            handleLegendCheckboxClick: handleShowLegendCheckbox
        }

        return <PieChartConfigurationForm {...chartProps}/>
    }


    const preconfig = {
        chartType: chartType,
        showLegend: showLegend,
        showDetails: showDetails,
    }

    const foodNames = applicationContext.foodDataCorpus.foodNames
    const language = languageContext.language

    const nameId1 = props.selectedFoodItem1.foodItem.nameId ? props.selectedFoodItem1.foodItem.nameId : null
    const nameId2 = props.selectedFoodItem2.foodItem.nameId ? props.selectedFoodItem2.foodItem.nameId : null

    const name1 = nameId1 ? getNameFromFoodNameList(foodNames, nameId1, language) : ""
    const name2 = nameId2 ? getNameFromFoodNameList(foodNames, nameId2, language) : ""

    return <div className={"direct-compare-panel"}>
        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{name1}</div>
                <BaseDataChart selectedFoodItem={props.selectedFoodItem1} directCompareUse={true}
                               directCompareConfig={preconfig}/>
            </div>
        </Card>

        <Card>
            <div className={"d-flex"}>
                <div className={"vertical-label"}>{name2}</div>
                <BaseDataChart selectedFoodItem={props.selectedFoodItem2} directCompareUse={true}
                               directCompareConfig={preconfig}/>
            </div>
        </Card>
        <Card.Footer>
            {renderChartConfigurationForm()}
        </Card.Footer>
    </div>

}