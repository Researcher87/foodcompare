import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {ChartItem, getOrderedFoodList} from "../../service/RankingService";
import {convertAbsoluteValueToDailyRequirement} from "../../service/calculation/DietaryRequirementService";
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

    const renderEmptyDatapage = () => {
        return (
            <span>
                {selectedValue === null ?
                    <div>{renderHelpText()}</div>
                    :
                    <p>{applicationStrings.label_noData[language]}</p>
                }
            </span>
        )
    }

    const numberOfChartItems = chartItems ? chartItems.length : 0;

    // Note: The chart will only be displayed if at least 2 (!) items are in the result set.

    const renderWebsite = () => (
        <div className="container-fluid" style={{paddingTop: "24px"}}>
            <div className="row">
                <div className="col-3">
                    <RankingSelector openChart={openChart}
                                     useHorizontalLayout={false}
                                     numberOfChartItems={numberOfChartItems}/>
                </div>
                <div className="col-9">
                    {chartItems && chartItems.length > 1 ?
                        <RankingChart chartItems={chartItems}
                                      unit={unit}
                                      selectedElement={selectedValue ? selectedValue.label : ""}/>
                        :
                        <div>{renderEmptyDatapage()}</div>
                    }
                </div>
            </div>
        </div>
    );

    const renderMobile = () => {
        return (
            <div className="container-fluid" style={{paddingTop: "24px"}}>
                <div>
                    <RankingSelector openChart={openChart}
                                     useHorizontalLayout={isMobileDevice()}
                                     numberOfChartItems={numberOfChartItems}
                    />
                </div>
                <hr/>
                {chartItems && chartItems.length > 0 ?
                    <RankingChart chartItems={chartItems}
                                  unit={unit}
                                  selectedElement={selectedValue ? selectedValue.label : ""}/>
                    :
                    <div>{renderEmptyDatapage()}</div>
                }
            </div>
        );
    }

    return isMobileDevice() ? renderMobile() : renderWebsite()
}