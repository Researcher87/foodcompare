import {useContext, useEffect, useState} from "react";
import {AMOUNT_PORTION} from "../../../config/Constants";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../../static/labels";
import * as ChartConfig from "../../../config/ChartConfig"
import {getBarChartOptions} from "../../../service/ChartConfigurationService"
import {Bar} from "react-chartjs-2";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../../charthelper/BarChartConfigurationForm";
import {ProteinDataChartProps} from "../../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../../service/WindowDimension";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {getProteinChartData} from "../../../service/chartdata/ProteinChartDataService";

export default function ProteinDataChart(props: ProteinDataChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language
    const windowSize = useWindowDimension()

    const chartConfig = props.directCompareConfig
        ? props.directCompareConfig
        : applicationContext
            ? applicationContext.applicationData.foodDataPanel.chartConfigData.proteinChartConfig
            : initialChartConfigData.proteinChartConfig

    const [portionType, setPortionType] = useState<string>(chartConfig.portionType)
    const [expand100, setExpand100] = useState<boolean>(chartConfig.expand100)

    useEffect(() => {
        if (props.directCompareConfig) {
            setExpand100(chartConfig.expand100)
            setPortionType(chartConfig.portionType)
        }

        updateChartConfig()
    }, [portionType, expand100, props])

    const updateChartConfig = () => {
        if (applicationContext && !props.directCompareConfig) {
            const currentSetting = applicationContext.applicationData.foodDataPanel.chartConfigData.proteinChartConfig
            if (expand100 !== currentSetting.expand100 || portionType !== currentSetting.portionType) {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    proteinChartConfig: {
                        portionType: portionType,
                        expand100: expand100
                    }
                }
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }
    }


    const createProteinChartData = () => {
        const proteinData = getNutrientData(props.selectedFoodItem).proteinData;
        if (!proteinData || !applicationContext) {
            return null;
        }

        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.proteinRequirementData;
        if (!requirementData) {
            return null;
        }

        const userData = applicationContext.userData;
        const portionAmount = portionType === AMOUNT_PORTION ? props.selectedFoodItem.portion.amount : 100;
        const chartDisplayData = getProteinChartData(proteinData, requirementData, userData, portionAmount, lang)

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_proteins

        return {
            labels: chartDisplayData.labels,
            datasets: [{
                label: applicationStrings.label_charttype_proteins[lang],
                data: chartDisplayData.values,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const handleRadioButtonClick = (event: any) => {
        const value=event.target.value
        setPortionType(value)
    }

    const handleExpandCheckbox = () => {
        setExpand100(!expand100)
    }

    const getOptions = (title, maxValue) => {
        const overallMaxValue = props.directCompareConfig && props.directCompareConfig.maxValue
            ? props.directCompareConfig.maxValue
            : maxValue

        let maxYValue
        if (!props.directCompareConfig) {
            if (expand100 && overallMaxValue < 100) {
                maxYValue = 100
            }
        } else {
            if (props.directCompareConfig.maxValue) {
                maxYValue = props.directCompareConfig.maxValue
            }
            if (expand100) {
                if (maxYValue === undefined) {
                    if (overallMaxValue < 100) {
                        maxYValue = 100
                    }
                } else if (maxYValue < 100) {
                    maxYValue = 100
                }
            }
        }

        return getBarChartOptions(title, applicationStrings.label_requirement_chart[lang], maxYValue);
    }

    const renderChartConfigurationForm = () => {
        const barChartProps = {
            selectedFoodItem: props.selectedFoodItem,
            portionType: portionType,
            expand100: expand100,
            handleRadioButtonClick: handleRadioButtonClick,
            handleExpandCheckboxClick: handleExpandCheckbox
        }

        return <BarChartConfigurationForm {...barChartProps} />
    }

    const data = createProteinChartData();
    if (!data) {
        return <div/>
    }

    const maxValue = (data && data.datasets && data.datasets.length > 0) ? Math.max(...data.datasets[0].data) : 0;
    const options = getOptions(applicationStrings.label_charttype_proteins[lang], maxValue);
    const dataExists = data.datasets && data.datasets[0].data && data.datasets[0].data.length > 0

    const chartClass = props.directCompareUse ? "col-12 chart-area-dc" : "col-12 chart-area"

    return (
        <div className="container-fluid">
            <div className="row" key={"base chart container proteins"}>
                <div className={chartClass}>
                    {dataExists &&
                    <Bar
                        data={data}
                        key={'chart proteins'}
                        options={options}
                    />
                    }
                    {!dataExists &&
                    <p className="text-center">
                        {applicationStrings.label_noData[lang]}
                    </p>
                    }
                </div>
            </div>
            {props.directCompareUse !== true &&
            <div className="row chart-control-button-bar">
                {renderChartConfigurationForm()}
            </div>
            }
        </div>
    )

}