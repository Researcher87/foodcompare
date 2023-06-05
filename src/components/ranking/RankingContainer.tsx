import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {ChartItem, getOrderedFoodList} from "../../service/RankingService";
import {convertAbsoluteValueToDailyRequirement} from "../../service/calculation/DietaryRequirementService";
import * as Constants from "./../../config/Constants";
import {applicationStrings} from "../../static/labels";
import {RankingSelector} from "./RankingSelector";
import {RankingChart} from "./RankingChart";
import {maxElementsInRankingChart} from "../../config/ApplicationSetting";
import ReactSelectOption from "../../types/ReactSelectOption";
import {isMobileDevice} from "../../service/WindowDimension";
import {getUnit} from "../../service/calculation/NutrientCalculationService";

export function RankingContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const [chartItems, setChartItems] = useState<Array<ChartItem>>([])
    const [unit, setUnit] = useState<string>("g")
    const [selectedValue, setSelectedValue] = useState<ReactSelectOption | null>(null)

    if (!applicationContext) {
        return <div/>
    }

    const openChart = (selectedCategory, selectedValue, use100gram, transformToDietaryRequirements) => {
        if (!selectedValue) {
            setChartItems([])
            return
        }

        let category = 0;
        if (selectedCategory) {
            category = selectedCategory.value;
        }

        setSelectedValue(selectedValue)
        const {foodItems, foodClasses, dietaryRequirements} = applicationContext.foodDataCorpus
        const userData = applicationContext.userData

        let orderedChartItems = getOrderedFoodList(foodItems, foodClasses, category,
            selectedValue.value, use100gram, language, applicationContext?.foodDataCorpus.foodNames,
            applicationContext?.foodDataCorpus.conditions);

        if (transformToDietaryRequirements && dietaryRequirements) {
            for (let i = 0; i < orderedChartItems.length; i++) {
                orderedChartItems[i].value = convertAbsoluteValueToDailyRequirement(
                    dietaryRequirements,
                    selectedValue.value,
                    orderedChartItems[i].value,
                    userData
                );
            }
        }

        const unit = getUnit(selectedValue.value, transformToDietaryRequirements)

        if (orderedChartItems.length > maxElementsInRankingChart) {
            orderedChartItems = orderedChartItems.slice(0, maxElementsInRankingChart + 1)
        }

        setChartItems(orderedChartItems)
        setUnit(unit)
    }

    const renderHelpText = () => {
        const helpText = applicationStrings.text_ranking[language];

        return (
            <div className="col-md-6 col-lg-5 infotextMenus" style={{padding: "24px"}}>
                <i>{helpText}</i>
            </div>
        );
    }

    const renderInformationText = () => {
        return (
            <span>
                {selectedValue === null &&
                renderHelpText()
                }
                {selectedValue !== null && chartItems && chartItems.length === 0 &&
                applicationStrings.label_noData[language]
                }
            </span>
        )
    }

    const renderWebsite = () => {
        return (
            <div className="container-fluid" style={{paddingTop: "24px"}}>
                <div className="row">
                    <div className="col-3">
                        <RankingSelector openChart={openChart} useHorizontalLayout={false}/>
                    </div>
                    {chartItems && chartItems.length > 0 &&
                    <div className="col-9">
                        <RankingChart chartItems={chartItems}
                                      unit={unit}
                                      selectedElement={selectedValue ? selectedValue.label : ""}/>
                    </div>
                    }
                    {
                        renderInformationText()
                    }
                </div>
            </div>
        );
    }

    const renderMobile = () => {
        return (
            <div className="container-fluid" style={{paddingTop: "24px"}}>
                <div>
                    <RankingSelector openChart={openChart} useHorizontalLayout={isMobileDevice()}/>
                </div>
                <hr/>
                {chartItems && chartItems.length > 0 &&
                <div>
                    <RankingChart chartItems={chartItems}
                                  unit={unit}
                                  selectedElement={selectedValue ? selectedValue.label : ""}/>
                </div>
                }
                {
                    renderInformationText()
                }
            </div>
        );
    }


    return isMobileDevice() ? renderMobile() : renderWebsite()

}