import {ChartProps} from "../ChartPanel";
import {useContext, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {AMOUNT_PORTION, CHART_MINERALS, CHART_VITAMINS, GRAM} from "../../../config/Constants";
import {determineFoodRequirementRatio} from "../../../service/calculation/DietaryRequirementService";
import * as ChartConfig from "../../../config/ChartConfig"
import {applicationStrings} from "../../../static/labels";
import {getBarChartOptions} from "../../../service/ChartService"
import {Form} from "react-bootstrap";
import {Bar} from "react-chartjs-2";

interface MineralVitaminChartProps extends ChartProps {
    selectedSubChart: string
}

export default function MineralVitaminChart(props: MineralVitaminChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const [chartType_vitamins, setChartType_vitamins] = useState<string>(AMOUNT_PORTION)
    const [expand100_vitamins, setExpand100_vitamins] = useState<boolean>(false)
    const [chartType_minerals, setChartType_minerals] = useState<string>(AMOUNT_PORTION)
    const [expand100_minerals, setExpand100_minerals] = useState<boolean>(false)

    if (!applicationContext || applicationContext.foodDataCorpus.dietaryRequirements === null) {
        return <div/>
    }


    const createVitaminChartData = () => {
        const vitaminData = props.selectedFoodItem.foodItem.nutrientDataList[0].vitaminData;
        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.vitaminRequirementData;

        if (!vitaminData || !requirementData) {
            return null
        }

        const amount = chartType_vitamins === GRAM ? 100 : props.selectedFoodItem.portion.amount;

        const labels: Array<string> = [];
        const data: Array<number> = [];

        if (vitaminData.a !== null) {
            labels.push("A");
            data.push(determineFoodRequirementRatio(requirementData.a, vitaminData.a, amount, applicationContext.userData));
        }

        if (vitaminData.b1 !== null) {
            labels.push("B1");
            data.push(determineFoodRequirementRatio(requirementData.b1, vitaminData.b1, amount, applicationContext.userData));
        }

        if (vitaminData.b2 !== null) {
            labels.push("B2");
            data.push(determineFoodRequirementRatio(requirementData.b2, vitaminData.b2, amount, applicationContext.userData));
        }

        if (vitaminData.b3 !== null) {
            labels.push("B3");
            data.push(determineFoodRequirementRatio(requirementData.b3, vitaminData.b3, amount, applicationContext.userData));
        }

        if (vitaminData.b5 !== null) {
            labels.push("B5");
            data.push(determineFoodRequirementRatio(requirementData.b5, vitaminData.b5, amount, applicationContext.userData));
        }

        if (vitaminData.b6 !== null) {
            labels.push("B6");
            data.push(determineFoodRequirementRatio(requirementData.b6, vitaminData.b6, amount, applicationContext.userData));
        }

        if (vitaminData.b9 !== null) {
            labels.push("B9");
            data.push(determineFoodRequirementRatio(requirementData.b9, vitaminData.b9, amount, applicationContext.userData));
        }

        if (vitaminData.b12 !== null) {
            labels.push("B12");
            data.push(determineFoodRequirementRatio(requirementData.b12, vitaminData.b12, amount, applicationContext.userData));
        }

        if (vitaminData.c !== null) {
            labels.push("C");
            data.push(determineFoodRequirementRatio(requirementData.c, vitaminData.c, amount, applicationContext.userData));
        }

        if (vitaminData.d !== null) {
            labels.push("D");
            data.push(determineFoodRequirementRatio(requirementData.d, vitaminData.d, amount, applicationContext.userData));
        }

        if (vitaminData.e !== null) {
            labels.push("E");
            data.push(determineFoodRequirementRatio(requirementData.e, vitaminData.e, amount, applicationContext.userData));
        }

        if (vitaminData.k !== null) {
            labels.push("K");
            data.push(determineFoodRequirementRatio(requirementData.k, vitaminData.k, amount, applicationContext.userData));
        }

        return {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_vitamins[lang],
                data: data,
                backgroundColor: ChartConfig.color_chart_green_3,
                borderWidth: 2,
                borderColor: '#555',
            }]

        }
    }

    const createMineralChartData = () => {
        const mineralData = props.selectedFoodItem.foodItem.nutrientDataList[0].mineralData;
        const requirementData = applicationContext.foodDataCorpus.dietaryRequirements?.mineralRequirementData;

        if (!mineralData || !requirementData) {
            return null
        }

        const amount = chartType_minerals === GRAM ? 100 : props.selectedFoodItem.portion.amount;

        const labels: Array<string> = [];
        const data: Array<number> = [];

        if (mineralData.calcium !== null) {
            labels.push(applicationStrings.label_nutrient_min_calcium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.calcium, mineralData.calcium, amount, applicationContext.userData));
        }

        if (mineralData.iron !== null) {
            labels.push(applicationStrings.label_nutrient_min_iron[lang]);
            data.push(determineFoodRequirementRatio(requirementData.iron, mineralData.iron, amount, applicationContext.userData));
        }

        if (mineralData.magnesium !== null) {
            labels.push(applicationStrings.label_nutrient_min_magnesium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.magnesium, mineralData.magnesium, amount, applicationContext.userData));
        }

        if (mineralData.phosphorus !== null) {
            labels.push(applicationStrings.label_nutrient_min_phosphorus[lang]);
            data.push(determineFoodRequirementRatio(requirementData.phosphorus, mineralData.phosphorus, amount, applicationContext.userData));
        }

        if (mineralData.potassium !== null) {
            labels.push(applicationStrings.label_nutrient_min_potassimum[lang]);
            data.push(determineFoodRequirementRatio(requirementData.potassium, mineralData.potassium, amount, applicationContext.userData));
        }

        if (mineralData.sodium !== null) {
            labels.push(applicationStrings.label_nutrient_min_sodium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.sodium, mineralData.sodium, amount, applicationContext.userData));
        }

        if (mineralData.zinc !== null) {
            labels.push(applicationStrings.label_nutrient_min_zinc[lang]);
            data.push(determineFoodRequirementRatio(requirementData.zinc, mineralData.zinc, amount, applicationContext.userData));
        }

        if (mineralData.copper !== null) {
            labels.push(applicationStrings.label_nutrient_min_copper[lang]);
            data.push(determineFoodRequirementRatio(requirementData.copper, mineralData.copper, amount, applicationContext.userData));
        }

        if (mineralData.manganese !== null) {
            labels.push(applicationStrings.label_nutrient_min_manganese[lang]);
            data.push(determineFoodRequirementRatio(requirementData.manganese, mineralData.manganese, amount, applicationContext.userData));
        }

        if (mineralData.selenium !== null) {
            labels.push(applicationStrings.label_nutrient_min_selenium[lang]);
            data.push(determineFoodRequirementRatio(requirementData.selenium, mineralData.selenium, amount, applicationContext.userData));
        }

        const chartData = {
            labels: labels,
            datasets: [{
                label: applicationStrings.label_charttype_minerals[lang],
                data: data,
                backgroundColor: ChartConfig.color_purple,
                borderWidth: 2,
                borderColor: '#555',
            }]

        }

        return chartData;
    }

    const handleRadioButtonClick = (event: any) => {
        if (props.selectedSubChart === CHART_VITAMINS) {
            setChartType_vitamins(event.target.value)
        } else if (props.selectedSubChart === CHART_MINERALS) {
            setChartType_minerals(event.target.value)
        }
    }

    const handleExpandCheckbox = (event: any) => {
        if (props.selectedSubChart === CHART_VITAMINS) {
            setExpand100_vitamins(!expand100_vitamins)
        } else if (props.selectedSubChart === CHART_MINERALS) {
            setExpand100_minerals(!expand100_minerals)
        }
    }

    // updateStore() {
    //     if(this.props.selectedMenu === Constants.VITAMIN_CHART) {
    //         this.props.setChartConfigVitamins(this.state.chartType_vitamins, this.state.expand100_vitamins);
    //     } else if(this.props.selectedMenu === Constants.MINERAL_CHART) {
    //         this.props.setChartConfigMinerals(this.state.chartType_minerals, this.state.expand100_minerals);
    //     }
    // }


    const getOptions = (title, maxValue) => {
        const expand100 = props.selectedSubChart === CHART_VITAMINS ? expand100_vitamins : expand100_minerals;
        let scales: any = undefined

        if(expand100 && maxValue < 100) {
            scales = {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }

        return getBarChartOptions(title, "%", scales);
    }


    const renderFormLine = () => {
        const label_portion = `${applicationStrings.label_portion[lang]} (${props.selectedFoodItem.portion.amount} g)`;

        const chartType = props.selectedSubChart === CHART_VITAMINS ? chartType_vitamins : chartType_minerals;
        const expand100 = props.selectedSubChart === CHART_VITAMINS ? expand100_vitamins : expand100_minerals;

        return (
            <div className="container-fluid">
                <div className="row foodDataPageHeader">
                    <form className="form-inline form-group">
                        <Form.Label className={"form-elements"}>
                            <b>{applicationStrings.label_reference[lang]}:</b>
                        </Form.Label>
                        <Form.Check type="radio"
                                    inline={true}
                                    label={"100g"}
                                    value={GRAM}
                                    checked={(chartType === GRAM)}
                                    onChange={handleRadioButtonClick}
                        />
                        <Form.Check type="radio"
                                    inline={true}
                                    style={{paddingRight: "48px"}}
                                    label={label_portion}
                                    value={AMOUNT_PORTION}
                                    checked={chartType === AMOUNT_PORTION}
                                    onChange={handleRadioButtonClick}
                        />
                        <Form.Check className="form-radiobutton"
                                    inline={true}
                                    label={applicationStrings.checkbox_expand100g[lang]}
                                    checked={expand100}
                                    onChange={handleExpandCheckbox}>
                        </Form.Check>
                    </form>
                </div>
            </div>
        )
    }


    const data = props.selectedSubChart === CHART_VITAMINS ? createVitaminChartData() : createMineralChartData();
    if(!data) {
        return <div/>
    }

    const maxValue = (data && data.datasets && data.datasets.length > 0) ? Math.max(...data.datasets[0].data) : 0;

    const title = props.selectedSubChart === CHART_VITAMINS ? applicationStrings.label_charttype_vitamins[lang] :
        applicationStrings.label_charttype_minerals[lang];

    const options = getOptions(title, maxValue);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className={"col-12"}>
                    <Bar
                        data={data}
                        height={ChartConfig.default_chart_height}
                        options={options}
                        type={"bar"}
                    />
                </div>
            </div>
            <div className="row chartFormLine">
                {renderFormLine()}
            </div>
        </div>
    )

}