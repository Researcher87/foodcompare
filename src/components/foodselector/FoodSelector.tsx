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
import {getFoodItem, getFoodItemsSelectList} from "../../service/nutrientdata/FoodItemsService";
import FoodItem, {PortionData} from "../../types/nutrientdata/FoodItem";
import {getDefaultPortionData, getPortionReactSelectList} from "../../service/nutrientdata/PortionDataService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodClass from "../../types/nutrientdata/FoodClass";
import {LanguageContext} from "../../contexts/LangContext";

export interface FoodSelectorProps {
    updateSelectedFoodItem: (selectedFoodItem: SelectedFoodItem) => void
    smallVariant: boolean
    noCategorySelect?: boolean
    initialFoodClassToSet?: number
    selectedFoodItem?: SelectedFoodItem | null
}

/**
 * Component to select a food element. The component can optionally show the category list and can be initialized
 * with an already existing selected food item (in case of component re-rendering).
 */
export default function FoodSelector(props: FoodSelectorProps): JSX.Element {
    const [selectedCategory, setSelectedCategory] = useState<ReactSelectOption | null>(null)
    const [selectdFoodClass, setSelectedFoodClass] = useState<ReactSelectFoodClassOption | null>(null)
    const [selectedFoodItem, setSelectedFoodItem] = useState<ReactSelectFoodItemOption | null>(null)
    const [selectedPortion, setSelectedPortion] = useState<ReactSelectPortionOption | null>(null)
    const [portionAmount, setPortionAmount] = useState<number>(0)
    const [initialized, setInitialized] = useState<boolean>(false)

    const [categoriesList, setCategoriesList] = useState<Array<ReactSelectOption>>([])
    const [foodClassesList, setFoodClassesList] = useState<Array<ReactSelectFoodClassOption>>([])
    const [foodItemsList, setFoodItemsList] = useState<Array<ReactSelectFoodItemOption>>([])
    const [portionsList, setPortionsList] = useState<Array<ReactSelectPortionOption>>([])

    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    useEffect(() => {
        const initialFoodClass = props.initialFoodClassToSet ? props.initialFoodClassToSet : 0

        if (applicationContext && applicationContext.foodDataCorpus && categoriesList.length === 0) {
            const foodDataCorpus = applicationContext.foodDataCorpus

            if (foodDataCorpus.categories) {
                const categoryItems = getCategorySelectList(foodDataCorpus.categories, language)
                setCategoriesList(categoryItems)
            }

            if (foodDataCorpus.foodClasses) {
                const foodClasses = getFoodClassSelectList(foodDataCorpus.foodClasses, 0, applicationContext.foodDataCorpus.foodNames, language)
                setFoodClassesList(foodClasses)
                const foodClass = foodClasses[initialFoodClass]
                setSelectedFoodClass(foodClass)

                if (foodDataCorpus.foodItems && foodClasses) {
                    const foodItemsOfFoodClass = getFoodItemsSelectList(foodDataCorpus.foodItems, foodClasses[initialFoodClass].value.id, foodDataCorpus.foodNames,
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

                        if (!props.selectedFoodItem) {
                            makeSelectedFoodItemObject(foodItem, foodClass.value, defaultPortion.value)
                        }
                    }
                }
            }
        } else {
            // Update data for outer component whenever render is triggered
            makeSelectedFoodItemObject(selectedFoodItem?.value, selectdFoodClass?.value, selectedPortion?.value)
        }

    }, [selectedFoodItem, selectedPortion, selectdFoodClass, selectedCategory, portionAmount])

    if (!applicationContext) {
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
        const foodClasses = applicationContext.foodDataCorpus.foodClasses

        if (foodClasses) {
            const foodClassItems = getFoodClassSelectList(foodClasses, category.value, applicationContext.foodDataCorpus.foodNames, language)
            setFoodClassesList(foodClassItems)
            setSelectedFoodClass(foodClassItems[0])
            updateFoodItem(foodClassItems[0])
        }
    }

    const updateFoodItem = (foodClass: ReactSelectFoodClassOption) => {
        const {foodItems, foodNames, conditions} = applicationContext.foodDataCorpus

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
        const portionDataList = getPortionReactSelectList(foodItem.portionData!!, applicationContext.foodDataCorpus.portionTypes, language)
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


    const setInitialFoodElement = () => {
        if (!foodClassesList || foodClassesList.length === 0) {
            return
        }

        if(!props.selectedFoodItem || !props.selectedFoodItem.foodClass) {
            return
        }

        const predefinedFoodObject = props.selectedFoodItem

        // @ts-ignore
        const foodClassOption = foodClassesList.find(foodClass => foodClass.value.id === predefinedFoodObject.foodClass.id)
        const {foodItems, foodNames, conditions, portionTypes} = applicationContext.foodDataCorpus

        if (foodClassOption) {
            setSelectedFoodClass(foodClassOption)
            const foodClassItems = getFoodItemsSelectList(foodItems, foodClassOption.value.id, foodNames, conditions, language)

            if (foodClassItems) {
                setFoodItemsList(foodClassItems)
                const foodItem = foodClassItems.find(foodItem => foodItem.value.id === predefinedFoodObject.foodItem.id)

                if (foodItem && foodItem.value && foodItem.value.portionData) {
                    setSelectedFoodItem(foodItem)

                    const portionDataList = getPortionReactSelectList(foodItem.value.portionData, portionTypes, language)
                    setPortionsList(portionDataList)

                    const portionType = predefinedFoodObject.portion.portionType
                    const portionObject = portionDataList.find(portion => portion.value.portionType === portionType)
                    if (portionObject) {
                        setSelectedPortion(portionObject)

                        //@ts-ignore
                        const amount = predefinedFoodObject.portion.amount
                        setPortionAmount(amount)
                    }
                }
            }

        }

        setInitialized(true)
    }

    if (props.selectedFoodItem && !initialized) {
        setInitialFoodElement()
    }

    const amount_label = props.smallVariant ? `${applicationStrings.label_amount_short[language]}:` : `${applicationStrings.label_amount[language]}:`
    const initialFoodClass = props.initialFoodClassToSet ? props.initialFoodClassToSet : 0

    return <div>
        <div className="container">
            {props.noCategorySelect !== true &&
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_category[language]}:</span>
                <Select options={categoriesList}
                        value={selectedCategory ? selectedCategory : categoriesList[0]}
                        onChange={(value) => handleCategoryChange(value)}
                />
            </div>
            }
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_foodclass[language]}:</span>
                <Select options={foodClassesList}
                        value={selectdFoodClass ? selectdFoodClass : foodClassesList[initialFoodClass]}
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
                    <div className={"col-lg-8 col-xl-9"}>
                        <span
                            className={'form-label'}>{applicationStrings.label_fooditem[language]}:</span>
                        <Select options={portionsList}
                                value={selectedPortion ? selectedPortion : portionsList[0]}
                                onChange={(value) => handlePortionChange(value)}/>
                    </div>
                    <div className={"col-lg-4 col-xl-3"}>
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