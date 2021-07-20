import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import {ChartItem, getOrderedFoodList} from "../../service/RankingService";
import {convertAbsoluteValueToDailyRequirement} from "../../service/calculation/DietaryRequirementService";
import * as Constants from "./../../config/Constants";
import {applicationStrings} from "../../static/labels";
import {RankingSelector} from "./RankingSelector";
import {RankingChart} from "./RankingChart";

export function RankingContainer() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const [chartItems, setChartItems] = useState<Array<ChartItem>>([])
    const [unit, setUnit] = useState<string>("g")

    if (!applicationContext) {
        return <div/>
    }

    const openChart = (selectedCategory, selectedValue, portionAmount, transformToDietaryRequirements) => {
        let category = 0;
        if (selectedCategory) {
            category = selectedCategory.value;
        }

        const {foodItems, foodClasses, dietaryRequirements} = applicationContext.foodDataCorpus
        const userData = applicationContext.userData

        const orderedChartItems = getOrderedFoodList(foodItems, foodClasses, category,
            selectedValue.value, portionAmount, language, applicationContext?.foodDataCorpus.foodNames);

        if (transformToDietaryRequirements && dietaryRequirements) {
            for (let i = 0; i < orderedChartItems.length; i++) {
                const dailyRequirementValue = convertAbsoluteValueToDailyRequirement(
                    dietaryRequirements,
                    selectedValue.value,
                    orderedChartItems[i].value,
                    userData
                );
                orderedChartItems[i].value = dailyRequirementValue;
            }
        }

        const unit = getUnit(selectedValue.value, transformToDietaryRequirements)

        setChartItems(orderedChartItems)
        setUnit(unit)
    }


    const getUnit = (selectedValue, transformToDietaryRequirements) => {
        if (selectedValue === Constants.DATA_ENERGY) {
            return "kCal";
        } else if (selectedValue === Constants.DATA_WATER
            || selectedValue === Constants.DATA_LIPIDS
            || selectedValue === Constants.DATA_CARBS
            || selectedValue === Constants.DATA_CARBS_SUGAR
            || selectedValue === Constants.DATA_PROTEINS
            || selectedValue === Constants.DATA_CARBS_DIETARY_FIBERS
            || selectedValue === Constants.DATA_LIPIDS_SATURATED
            || selectedValue === Constants.DATA_LIPIDS_MONO_UNSATURATED
            || selectedValue === Constants.DATA_LIPIDS_POLY_UNSATURATED
            || selectedValue === Constants.DATA_LIPIDS_TRANSFATTY_ACIDS) {
            return "g";
        } else if (transformToDietaryRequirements) {
            return "%";
        } else {
            return "mg";
        }
    }

    const renderHelpText = () => {
        const helpText = applicationStrings.text_ranking[language];

        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className="col-md-6 col-lg-5 infotextMenus" style={{padding: "24px"}}>
                        <i>{helpText}</i>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{paddingTop: "24px"}}>
            <div className="row">
                <div className="col-3">
                    <RankingSelector openChart={openChart}/>
                </div>
                {chartItems &&
                <div className="col-9">
                    <RankingChart chartItems={chartItems}
                                  unit={unit}/>
                </div>
                }
                {!chartItems || chartItems.length === 0 &&
                renderHelpText()
                }
            </div>
        </div>
    );


}