import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {applicationStrings} from "../../static/labels";
import Select from 'react-select';
import ReactSelectOption, {
    ReactSelectFoodClassOption,
    ReactSelectFoodItemOption,
    ReactSelectPortionOption
} from "../../types/ReactSelectOption";
import {getCategorySelectList} from "../../service/nutrientdata/CategoryService";
import {getFoodClassSelectList} from "../../service/nutrientdata/FoodClassService";
import {getFoodItemsSelectList} from "../../service/nutrientdata/FoodItemsService";
import FoodItem, {PortionData} from "../../types/nutrientdata/FoodItem";
import {getDefaultPortionData, getPortionReactSelectList} from "../../service/nutrientdata/PortionDataService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodClass from "../../types/nutrientdata/FoodClass";
import {LanguageContext} from "../../contexts/LangContext";

export interface FoodSelectorProps {
    updateSelectedFoodItem: (selectedFoodItem: SelectedFoodItem) => void
    compositeSelector: boolean
}

export default function FoodSelector(props: FoodSelectorProps): JSX.Element {
    const [selectedCategory, setSelectedCategory] = useState<ReactSelectOption | null>(null)
    const [selectdFoodClass, setSelectedFoodClass] = useState<ReactSelectFoodClassOption | null>(null)
    const [selectedFoodItem, setSelectedFoodItem] = useState<ReactSelectFoodItemOption | null>(null)
    const [selectedPortion, setSelectedPortion] = useState<ReactSelectPortionOption | null>(null)
    const [portionAmount, setPortionAmount] = useState<number>(0)

    const [categoriesList, setCategoriesList] = useState<Array<ReactSelectOption>>([])
    const [foodClassesList, setFoodClassesList] = useState<Array<ReactSelectFoodClassOption>>([])
    const [foodItemsList, setFoodItemsList] = useState<Array<ReactSelectFoodItemOption>>([])
    const [portionsList, setPortionsList] = useState<Array<ReactSelectPortionOption>>([])

    const applicationData = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    useEffect(() => {
        if (applicationData && applicationData.foodDataCorpus && categoriesList.length === 0) {
            const foodDataCorpus = applicationData.foodDataCorpus

            if (foodDataCorpus.categories) {
                const categoryItems = getCategorySelectList(foodDataCorpus.categories, language)
                setCategoriesList(categoryItems)
            }

            if (foodDataCorpus.foodClasses) {
                const foodClasses = getFoodClassSelectList(foodDataCorpus.foodClasses, 0, applicationData.foodDataCorpus.foodNames, language)
                setFoodClassesList(foodClasses)
                const foodClass = foodClasses[0]
                setSelectedFoodClass(foodClass)

                if (foodDataCorpus.foodItems && foodClasses) {
                    const foodItemsOfFoodClass = getFoodItemsSelectList(foodDataCorpus.foodItems, foodClasses[0].value.id, foodDataCorpus.foodNames,
                        foodDataCorpus.conditions, language)

                    setFoodItemsList(foodItemsOfFoodClass)
                    setSelectedFoodItem(foodItemsOfFoodClass[0])
                    const foodItem = foodItemsOfFoodClass[0].value

                    if (foodItem && foodItem.portionData) {
                        const portionDataList = getPortionReactSelectList(foodItem.portionData, foodDataCorpus.portionTypes, language)
                        setPortionsList(portionDataList)

                        const defaultPortion = getDefaultPortionData(foodItem, portionDataList)
                        setSelectedPortion(defaultPortion)
                        setPortionAmount(defaultPortion.value.amount)

                        makeSelectedFoodItemObject(foodItem, foodClass.value, defaultPortion.value)
                    }
                }
            }
        } else {
            // Update data for outer component whenever render is triggered
            makeSelectedFoodItemObject(selectedFoodItem?.value, selectdFoodClass?.value, selectedPortion?.value)
        }

    }, [selectedFoodItem, selectedPortion, selectdFoodClass, selectedCategory, portionAmount])

    if (!applicationData) {
        return <div/>
    }

    const handleCategoryChange = (category: ReactSelectOption) => {
        setSelectedCategory(category)
        updateFoodClasses(category)
    }

    const handleFoodClassChange = (foodClass: ReactSelectFoodClassOption) => {
        setSelectedFoodClass(foodClass)
        updateFoodItem(foodClass)
    }

    const handleFoodItemChange = (foodItem: ReactSelectFoodItemOption) => {
        setSelectedFoodItem(foodItem)
        updatePortionsList(foodItem.value)
    }

    const handlePortionChange = (portion: ReactSelectPortionOption) => {
        setSelectedPortion(portion)
        setPortionAmount(portion.value.amount)
    }

    const handlePortionAmountChange = (e) => {
        if (!e.target.value) {
            setPortionAmount(0)
            return
        }

        const amount = parseInt(e.target.value)

        if (!isNaN(amount)) {
            setPortionAmount(amount)
        }
    }

    const updateFoodClasses = (category: ReactSelectOption) => {
        const foodClasses = applicationData.foodDataCorpus.foodClasses

        if (foodClasses) {
            const foodClassItems = getFoodClassSelectList(foodClasses, category.value, applicationData.foodDataCorpus.foodNames, language)
            setFoodClassesList(foodClassItems)
            setSelectedFoodClass(foodClassItems[0])
            updateFoodItem(foodClassItems[0])
        }
    }

    const updateFoodItem = (foodClass: ReactSelectFoodClassOption) => {
        const foodItems = applicationData.foodDataCorpus.foodItems
        const foodNames = applicationData.foodDataCorpus.foodNames
        const conditions = applicationData.foodDataCorpus.conditions

        if (foodItems) {
            const foodClassItems = getFoodItemsSelectList(foodItems, foodClass.value.id, foodNames, conditions, language)
            setFoodItemsList(foodClassItems)
            setSelectedFoodItem(foodClassItems[0])

            const foodItem = foodClassItems[0].value
            if (foodItem) {
                updatePortionsList(foodItem)
            }
        }
    }

    const updatePortionsList = (foodItem: FoodItem) => {
        const portionDataList = getPortionReactSelectList(foodItem.portionData!!, applicationData.foodDataCorpus.portionTypes, language)
        setPortionsList(portionDataList)
        const defaultPortion = getDefaultPortionData(foodItem, portionDataList)
        setSelectedPortion(defaultPortion)
        setPortionAmount(defaultPortion.value.amount)
    }

    const makeSelectedFoodItemObject = (foodItem: FoodItem | undefined, foodClass: FoodClass | undefined, portion: PortionData | undefined) => {
        if (!foodItem || !foodClass || !portion) {
            return
        }

        if (portion.portionType === 0) {
            portion.amount = portionAmount
        }

        const newFoodItem: SelectedFoodItem = {
            foodItem: foodItem,
            foodClass: foodClass,
            portion: portion
        }

        props.updateSelectedFoodItem(newFoodItem)
    }

    const amount_label = props.compositeSelector ? `${applicationStrings.label_amount_short[language]}:` : `${applicationStrings.label_amount[language]}:`

    return <div>
        <div className="container">
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_category[language]}:</span>
                <Select options={categoriesList}
                        value={selectedCategory ? selectedCategory : categoriesList[0]}
                        onChange={(value) => handleCategoryChange(value)}
                />
            </div>
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_foodclass[language]}:</span>
                <Select options={foodClassesList}
                        value={selectdFoodClass ? selectdFoodClass : foodClassesList[0]}
                        onChange={(value) => handleFoodClassChange(value)}
                />
            </div>
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_fooditem[language]}:</span>
                <Select options={foodItemsList}
                        value={selectedFoodItem ? selectedFoodItem : foodItemsList[0]}
                        onChange={handleFoodItemChange}
                />
            </div>
            <div className="column select-menu form-section">
                <div className={"row"}>
                    <div className={"col-md-9"}>
                        <span
                            className={'form-label'}>{applicationStrings.label_fooditem[language]}:</span>
                        <Select options={portionsList}
                                value={selectedPortion ? selectedPortion : portionsList[0]}
                                onChange={(value) => handlePortionChange(value)}/>
                    </div>
                    <div className={"col-md-3"}>
                        <span
                            className={'form-label'}>{amount_label}</span>
                        <input className="form-control inputfield"
                               disabled={selectedPortion?.value.portionType !== 0}
                               value={portionAmount}
                               onChange={handlePortionAmountChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

}