import {useContext, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import ReactSelectOption from "../../types/ReactSelectOption";
import {getCategorySelectList} from "../../service/nutrientdata/CategoryService";
import {
    getBaseCategoryValues,
    getCarbohydrateCategoryValues,
    getLipidCategoryValues,
    getMineralCategoryValues,
    getProteinCategoryValues,
    getRankingCategories,
    getVitaminCategoryValues
} from "../../service/RankingService";
import {applicationStrings} from "../../static/labels";
import {Button, Form} from "react-bootstrap";
import Select from 'react-select';

interface RankingSelectorProps {
    openChart: (selectedCategory, selectedValue, portionAmount, transformToDietaryRequirements) => void
}

export const BASE_DATA_INDEX = 0
export const VITAMIN_INDEX = 1
export const MINERAL_INDEX = 2
export const LIPIDS_INDEX = 3
export const CARBS_INDEX = 4
export const PROTEIN_INDEX = 5

export function RankingSelector(props: RankingSelectorProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const [selectedFoodCategory, setSelectedFoodCategory] = useState<ReactSelectOption>()
    const [selectedRankingCategory, setSelectedRankingCategory] = useState<ReactSelectOption>()
    const [selectedValue, setSelectedValue] = useState<ReactSelectOption>()
    const [portionAmount, setPortionAmount] = useState<boolean>(true)
    const [dietaryRequirementTransform, setDietaryRequirementTransform] = useState<boolean>(false)

    if (!applicationContext) {
        return <div/>
    }

    const handleFoodCategoryChange = (selectedOption) => {
        setSelectedFoodCategory(selectedOption)
    }

    const handleRankingCategoryChange = (selectedOption) => {
        setSelectedRankingCategory(selectedOption)
    }

    const handleValueChange = (selectedOption) => {
        setSelectedValue(selectedOption)
    }

    const handlePortionAmountChange = () => {
        setPortionAmount(!portionAmount)
    }

    const handleDietaryRequirementsCheckbox = () => {
        setDietaryRequirementTransform(!dietaryRequirementTransform)
    }

    const getFoodCategoryList = () => {
        return getCategorySelectList(applicationContext.foodDataCorpus.categories, language)
    }

    const getRankingCategoryList = () => {
        return getRankingCategories(language);
    }

    const getValueList = () => {
        if (!selectedRankingCategory) {
            return;
        }

        switch (selectedRankingCategory.value) {
            case BASE_DATA_INDEX:
                return getBaseCategoryValues(language)
            case VITAMIN_INDEX:
                return getVitaminCategoryValues(language)
            case MINERAL_INDEX:
                return getMineralCategoryValues(language)
            case LIPIDS_INDEX:
                return getLipidCategoryValues(language)
            case CARBS_INDEX:
                return getCarbohydrateCategoryValues(language)
            case PROTEIN_INDEX:
                return getProteinCategoryValues(language)
        }
    }


    const openChart = () => {
        const rankingCategory = selectedRankingCategory ? selectedRankingCategory.value : null
        const mineralOrVitaminCategory = (rankingCategory === VITAMIN_INDEX) || (rankingCategory === MINERAL_INDEX);
        const transformToDietaryRequirements = mineralOrVitaminCategory ? dietaryRequirementTransform : false;

        props.openChart(selectedFoodCategory, selectedValue, portionAmount, transformToDietaryRequirements);

    }

    const renderPortionForm = () => {
        const rankingCategory = selectedRankingCategory ? selectedRankingCategory.value : null;

        return (
            <div className="column select-menu" style={{paddingLeft: "20px", paddingTop: "10px"}}>
                <form className="form-inline form-group">
                    <label className="form-elements">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={(!portionAmount)}
                               onChange={handlePortionAmountChange}
                        />
                        100 g
                    </label>
                    <label className="form-elements-largespace">
                        <input className="form-radiobutton"
                               type="radio"
                               checked={portionAmount}
                               onChange={handlePortionAmountChange}
                        />
                        {applicationStrings.label_portion[language]}
                    </label>
                    {(rankingCategory === VITAMIN_INDEX || rankingCategory === MINERAL_INDEX) &&
                    <Form.Label className="form-elements">
                        <Form.Check inline={true}
                                    label= {applicationStrings.label_ranking_dietaryRequirements[language]}
                                    className="form-radiobutton"
                                    defaultChecked={dietaryRequirementTransform}
                                    onClick={handleDietaryRequirementsCheckbox}>
                        </Form.Check>
                    </Form.Label>
                    }
                </form>
            </div>
        );

    }

    const rankingList = getRankingCategoryList()
    console.log('RR:', rankingList)

    return (
        <div className="container">
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_category[language]}:</i>
                <Select options={getFoodCategoryList()}
                        value={selectedFoodCategory}
                        onChange={handleFoodCategoryChange}
                />
            </div>
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_group[language]}:</i>
                <Select options={rankingList}
                        value={selectedRankingCategory}
                        onChange={handleRankingCategoryChange}
                />
            </div>
            <div className="column select-menu form-section">
                <i>{applicationStrings.label_value[language]}:</i>
                <Select options={getValueList()}
                        value={selectedValue}
                        onChange={handleValueChange}
                />
            </div>
            {renderPortionForm()}
            <div className="text-center" style={{paddingTop: "36px"}}>
                <Button type="button"
                        className="btn btn-primary btn-sm button-apply"
                        style={{marginRight: "12px"}}
                        disabled={!selectedValue}
                        onClick={openChart}>
                    {applicationStrings.button_submit[language]}
                </Button>
            </div>
        </div>
    )


}