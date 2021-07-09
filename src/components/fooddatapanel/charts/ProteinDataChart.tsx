import {ChartProps} from "../ChartPanel";
import {useContext, useEffect, useState} from "react";
import {AMOUNT_PORTION, CHART_MINERALS, CHART_VITAMINS, GRAM} from "../../../config/Constants";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../../static/labels";
import {determineProteinRequirementRatio} from "../../../service/calculation/DietaryRequirementService";
import * as ChartConfig from "../../../config/ChartConfig"
import {getBarChartOptions} from "../../../service/ChartService"
import {Col, Form} from "react-bootstrap";
import {Bar} from "react-chartjs-2";
import {initialChartConfigData} from "../../../config/ApplicationSetting";
import {BarChartConfigurationForm} from "../../charthelper/BarChartConfigurationForm";

export default function ProteinDataChart(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const chartConfig = applicationContext
        ? applicationContext.applicationData.foodDataPanel.chartConfigData.proteinChartConfig
        : initialChartConfigData.proteinChartConfig


    const [portionType, setPortionType] = useState<string>(chartConfig.portionType)
    const [expand100, setExpand100] = useState<boolean>(chartConfig.expand100)

    useEffect(() => {
        updateChartConfig()
    }, [portionType, expand100])

    const updateChartConfig = () => {
        if (applicationContext) {
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


    const createProteinChartData = () => {
        const proteinData = props.selectedFoodItem.foodItem.nutrientDataList[0].proteinData;
        if(!proteinData || !applicationContext) {
            return null;
        }

        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.proteinRequirementData;
        if(!requirementData) {
            return null;
        }

        const userData = applicationContext.userData;
        const amount = portionType === AMOUNT_PORTION ? props.selectedFoodItem.portion.amount : 100;

        const labels: Array<string> = [];
        const data: Array<number>  = [];

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

        return {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_proteins[lang],
                data: data,
                backgroundColor: ChartConfig.color_proteins,
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
        const maxYvalue = expand100 && maxValue < 100 ? 100 : undefined
        return getBarChartOptions(title, "%", maxYvalue);
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
    if(!data) {
        return <div/>
    }

    const maxValue = (data && data.datasets && data.datasets.length > 0) ? Math.max(...data.datasets[0].data) : 0;
    const options = getOptions(applicationStrings.label_charttype_proteins[lang], maxValue);
    const dataExists = data.datasets && data.datasets[0].data && data.datasets[0].data.length > 0

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    {dataExists &&
                    <Bar
                        data={data}
                        height={ChartConfig.default_chart_height}
                        options={options}
                        type={"bar"}
                    />
                    }
                    {!dataExists &&
                    <p className="text-center" style={{ height: ChartConfig.default_chart_height }}>
                        {applicationStrings.label_noData[lang]}
                    </p>
                    }
                </div>
            </div>
            <div className="row chartFormLine">
                {renderChartConfigurationForm()}
            </div>
        </div>
    )

}