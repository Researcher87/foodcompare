import {useContext, useEffect, useState} from "react";
import {AMOUNT_PORTION} from "../../../config/Constants";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../../static/labels";
import {determineProteinRequirementRatio} from "../../../service/calculation/DietaryRequirementService";
import * as ChartConfig from "../../../config/ChartConfig"
import {getBarChartOptions} from "../../../service/ChartConfigurationService"
import {Bar} from "react-chartjs-2";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../../charthelper/BarChartConfigurationForm";
import {ProteinDataChartProps} from "../../../types/livedata/ChartPropsData";
import {useWindowDimension} from "../../../service/WindowDimension";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";

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
    const [chartHeight, setChartHeight] = useState<number>(calculateChartHeight(windowSize, props.directCompareUse))

    useEffect(() => {
        if (props.directCompareConfig) {
            setExpand100(chartConfig.expand100)
            setPortionType(chartConfig.portionType)
        }

        setChartHeight(calculateChartHeight(windowSize, props.directCompareUse))
        updateChartConfig()
    }, [portionType, expand100, chartHeight, props])

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
                applicationContext.applicationData.foodDataPanel.updateFoodDataPanelChartConfig(newChartConfig)

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
        const amount = portionType === AMOUNT_PORTION ? props.selectedFoodItem.portion.amount : 100;

        const labels: Array<string> = [];
        const data: Array<number> = [];

        if (proteinData.histidine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_histidine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.histidine, proteinData.histidine, amount, userData)
            )
        }

        if (proteinData.isoleucine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_isoleucine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.isoleucine, proteinData.isoleucine, amount, userData)
            )
        }

        if (proteinData.leucine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_leucine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.leucine, proteinData.leucine, amount, userData)
            )
        }

        if (proteinData.lysine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_lysine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.lysine, proteinData.lysine, amount, userData)
            )
        }

        if (proteinData.methionine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_methionine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.methionine, proteinData.methionine, amount, userData)
            )
        }

        if (proteinData.phenylalanine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_phenylalanine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.phenylalanine, proteinData.phenylalanine, amount, userData)
            )
        }

        if (proteinData.threonine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_threonine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.threonine, proteinData.threonine, amount, userData)
            )
        }

        if (proteinData.tryptophan !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_tryptophan[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.tryptophan, proteinData.tryptophan, amount, userData)
            )
        }

        if (proteinData.valine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_valine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.valine, proteinData.valine, amount, userData)
            )
        }

        if (proteinData.cystine !== null) {
            labels.push(applicationStrings.label_nutrient_proteins_cystine[lang]);
            data.push(determineProteinRequirementRatio(
                requirementData.cystine, proteinData.cystine, amount, userData)
            )
        }

        const chartColor = props.directCompareConfig && props.directCompareConfig.barChartColor
            ? props.directCompareConfig.barChartColor
            : ChartConfig.color_proteins

        return {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_proteins[lang],
                data: data,
                backgroundColor: chartColor,
                borderWidth: 2,
                borderColor: '#555',
            }]
        }
    }


    const handleRadioButtonClick = (event: any) => {
        setPortionType(event.target.value)
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
            if (expand100 === true && (maxYValue === undefined || maxYValue < 100)) {
                maxYValue = 100
            }
        }

        return getBarChartOptions(title, "%", maxYValue);
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

    const containerHeight = calculateChartContainerHeight(windowSize,  props.directCompareUse)

    return (
        <div className="container-fluid">
            <div className="row" style={{height: containerHeight}} key={"base chart container " + containerHeight}>
                <div className="col-12">
                    {dataExists &&
                    <Bar
                        data={data}
                        key={'chart ' + chartHeight}
                        height={chartHeight}
                        options={options}
                        type={"bar"}
                    />
                    }
                    {!dataExists &&
                    <p className="text-center" style={{height: ChartConfig.default_chart_height}}>
                        {applicationStrings.label_noData[lang]}
                    </p>
                    }
                </div>
            </div>
            {props.directCompareUse !== true &&
            <div className="row chartFormLine">
                {renderChartConfigurationForm()}
            </div>
            }
        </div>
    )

}