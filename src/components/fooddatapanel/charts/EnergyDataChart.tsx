import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {applicationStrings} from "../../../static/labels";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {ChartProps} from "../../../types/livedata/ChartPropsData";
import {getNutrientData} from "../../../service/nutrientdata/NutrientDataRetriever";
import {EnergyLevelChart} from "./energy/EnergyLevelChart";
import {Form} from "react-bootstrap";
import {CHART_TYPE_BAR, CHART_TYPE_COMPOSITION, CHART_TYPE_ENERGY_LEVEL, CHART_TYPE_PIE} from "../../../config/Constants";
import {EnergyCompositionChart} from "./energy/EnergyCompositionChart";

export default function EnergyDataChart(props: ChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language
    const nutrientData = getNutrientData(props.selectedFoodItem);
    const energy100g = nutrientData.baseData.energy;

    const initialChartType = props.directCompareUse
        ? applicationContext?.applicationData.directCompareDataPanel.directCompareConfigChart.energyChartConfig.chartType ?? CHART_TYPE_COMPOSITION
        : applicationContext?.applicationData.foodDataPanel.chartConfigData.energyChartConfig.chartType ?? CHART_TYPE_COMPOSITION

    const [chartType, setChartType] = useState<string>(initialChartType)

    useEffect(() => {
        if (applicationContext) {
            if (props.directCompareUse) {
                const newChartConfig = {
                    ...applicationContext.applicationData.directCompareDataPanel.directCompareConfigChart,
                    energyChartConfig: {
                        chartType: chartType,
                        showLegend: true
                    }
                }
                applicationContext.setDirectCompareData.updateDirectCompareChartConfig(newChartConfig)
            } else {
                const newChartConfig = {
                    ...applicationContext.applicationData.foodDataPanel.chartConfigData,
                    energyChartConfig: {
                        chartType: chartType,
                        showLegend: true
                    }
                }
                applicationContext.setFoodDataPanelData.updateFoodDataPanelChartConfig(newChartConfig)
            }
        }

    }, [chartType])

    if (!applicationContext || !energy100g) {
        return <div>No data.</div>
    }


    return (
        <div>
            {chartType === CHART_TYPE_COMPOSITION &&
            <div>
                <EnergyCompositionChart selectedFoodItem={props.selectedFoodItem}/>
            </div>
            }
            {chartType === CHART_TYPE_ENERGY_LEVEL &&
            <div>
                <EnergyLevelChart selectedFoodItem={props.selectedFoodItem}></EnergyLevelChart>
            </div>
            }
            <div className="row chart-control-button-bar">
                <div className="container">
                    <div className="row">
                        <form className="form-inline form-group">
                            <Form.Label className="form-elements">
                                <b>{applicationStrings.label_charttype[language]}:</b>
                            </Form.Label>
                            <Form.Check inline={true}
                                        className="form-radiobutton"
                                        label={applicationStrings.label_charttype_energy_composition[language]}
                                        type="radio"
                                        value={CHART_TYPE_PIE}
                                        checked={chartType === CHART_TYPE_COMPOSITION}
                                        onChange={() => setChartType(CHART_TYPE_COMPOSITION)}>
                            </Form.Check>
                            <Form.Check inline={true}
                                        className="form-radiobutton form-horizontal-separation"
                                        label={applicationStrings.label_charttype_energy_level[language]}
                                        type="radio"
                                        value={CHART_TYPE_BAR}
                                        checked={chartType === CHART_TYPE_ENERGY_LEVEL}
                                        onChange={() => setChartType(CHART_TYPE_ENERGY_LEVEL)}>
                            </Form.Check>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )

}