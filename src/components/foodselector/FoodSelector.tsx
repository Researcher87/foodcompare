import React, {useContext, useEffect, useState} from "react";
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
import {isSmallScreen, useWindowDimension} from "../../service/WindowDimension";
import {SOURCE_FNDDS, SOURCE_SRLEGACY} from "../../config/Constants";
import {getSourceName} from "../../service/nutrientdata/NutrientDataRetriever";
import ReactTooltip from "react-tooltip";
import {Form} from "react-bootstrap";

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
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const initialCategory = applicationContext?.applicationData.foodSelector.selectedCategory
        ? applicationContext.applicationData.foodSelector.selectedCategory
        : null

    const initialSupplementValue = applicationContext?.applicationData.foodSelector.sourceSupplement || false
    const initialCombineValue = applicationContext?.applicationData.foodSelector.sourceCombine || false

    const [selectedCategory, setSelectedCategory] = useState<ReactSelectOption | null>(initialCategory)
    const [selectdFoodClass, setSelectedFoodClass] = useState<ReactSelectFoodClassOption | null>(null)
    const [selectedFoodItem, setSelectedFoodItem] = useState<ReactSelectFoodItemOption | null>(null)
    const [selectedPortion, setSelectedPortion] = useState<ReactSelectPortionOption | null>(null)
    const [portionAmount, setPortionAmount] = useState<number>(0)
    const [selectedSource, setSelectedSource] = useState<ReactSelectOption | null>(null)
    const [supplementData, setSupplementData] = useState<boolean>(initialSupplementValue)
    const [combineData, setCombineData] = useState<boolean>(initialCombineValue)
    const [initialized, setInitialized] = useState<boolean>(false)

    const [categoriesList, setCategoriesList] = useState<Array<ReactSelectOption>>([])
    const [foodClassesList, setFoodClassesList] = useState<Array<ReactSelectFoodClassOption>>([])
    const [foodItemsList, setFoodItemsList] = useState<Array<ReactSelectFoodItemOption>>([])
    const [portionsList, setPortionsList] = useState<Array<ReactSelectPortionOption>>([])
    const [sourcesList, setSourcesList] = useState<Array<ReactSelectOption>>([])

    const windowSize = useWindowDimension()

    useEffect(() => {
            if (applicationContext) {
                const currentSelectorSetting = applicationContext.applicationData.foodSelector
                if (selectedCategory !== currentSelectorSetting.selectedCategory || supplementData !== currentSelectorSetting.sourceSupplement
                    || combineData !== currentSelectorSetting.sourceCombine) {
                    applicationContext.setFoodSelectorConfig(selectedCategory, supplementData, combineData)
                }
            }

            const initialFoodClass = props.initialFoodClassToSet ? props.initialFoodClassToSet : 0

            if (applicationContext && applicationContext.foodDataCorpus && categoriesList.length === 0) {
                const foodDataCorpus = applicationContext.foodDataCorpus

                if (foodDataCorpus.categories) {
                    const categoryItems = getCategorySelectList(foodDataCorpus.categories, language)
                    setCategoriesList(categoryItems)
                }

                if (foodDataCorpus.foodClasses) {
                    const category = selectedCategory ? selectedCategory.value : 0
                    const foodClasses = getFoodClassSelectList(foodDataCorpus.foodClasses, category, applicationContext.foodDataCorpus.foodNames, language)
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

                            updateSourcesList(foodItem)

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

        }, [selectedFoodItem,
            selectedPortion,
            selectdFoodClass,
            selectedCategory,
            selectedSource,
            portionAmount,
            supplementData,
            combineData]
    )

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
        updateSourcesList(foodItem.value)
    }

    const handlePortionChange = (portion: ReactSelectPortionOption) => {
        setSelectedPortion(portion)
        setPortionAmount(portion.value.amount)
    }

    const handleSourceChange = (source: ReactSelectOption) => {
        setSelectedSource(source)
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
                updateSourcesList(foodItem)
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


    const updateSourcesList = (foodItem: FoodItem) => {
        const sourceNames = getSourceNames(foodItem)
        setSourcesList(sourceNames)

        if (sourceNames.length === 1) {
            setSelectedSource(sourceNames[0])
        } else {
            const preferredSource = applicationContext.applicationData.preferredSource
            const matchingSource = sourceNames.find(sourceObject => {
                if (sourceObject.value === 0 && preferredSource === SOURCE_SRLEGACY) {
                    return sourceObject
                } else if (sourceObject.value === 1 && preferredSource === SOURCE_FNDDS) {
                    return sourceObject
                }
            })
            if (matchingSource) {
                setSelectedSource(matchingSource)
            } else {
                setSelectedSource(sourceNames[0])
            }
        }
    }


    const getSourceNames = (foodItem: FoodItem) => {
        return foodItem.nutrientDataList.map(nutrientDataObject => {
            const SourceName = getSourceName(nutrientDataObject.source.id)
            return {label: SourceName, value: nutrientDataObject.source.id}
        })
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
            portion: portion,
            selectedSource: selectedSource ? selectedSource.value : foodItem.nutrientDataList[0].source.id,
            supplementData: supplementData,
            combineData: combineData
        }

        props.updateSelectedFoodItem(newFoodItem)
    }


    const setInitialFoodElement = () => {
        if (!foodClassesList || foodClassesList.length === 0) {
            return
        }

        if (!props.selectedFoodItem || !props.selectedFoodItem.foodClass) {
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

                    const sourceNames = getSourceNames(foodItem.value)
                    setSourcesList(sourceNames)
                    const selected = sourceNames.find(sourceElement => sourceElement.value === props.selectedFoodItem?.selectedSource)
                    if (selected) {
                        setSelectedSource(selected)
                    }

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

    const onCheckSupplementCheckbox = () => {
        setSupplementData(!supplementData)
    }

    const onCheckCombineCheckbox = () => {
        setCombineData(!combineData)
    }

    if (props.selectedFoodItem && !initialized) {
        setInitialFoodElement()
    }

    const renderSourceLine = () => {
        const sourceSelectBox = (
            <Select className={selectClass}
                    options={sourcesList}
                    isDisabled={sourcesList.length <= 1 || combineData === true}
                    value={selectedSource ? selectedSource : sourcesList[0]}
                    onChange={handleSourceChange}
            />
        )

        const checkboxes = (
            <div>
                <label className="form-elements"
                       data-tip={applicationStrings.label_source_supplement_tooltip[language]}>
                    <ReactTooltip/>
                    <Form.Check inline className="form-radiobutton"
                                label={applicationStrings.label_source_supplement[language]}
                                checked={supplementData === true}
                                disabled={sourcesList.length <= 1}
                                onClick={onCheckSupplementCheckbox}>
                    </Form.Check>
                </label>
                <label className="form-elements"
                       data-tip={applicationStrings.label_source_combine_tooltip[language]}>
                    <ReactTooltip/>
                    <Form.Check inline className="form-radiobutton"
                                label={applicationStrings.label_source_combine[language]}
                                checked={combineData === true}
                                disabled={sourcesList.length <= 1}
                                onClick={onCheckCombineCheckbox}>
                    </Form.Check>
                </label>
            </div>
        )

        return <div>
            <span className={'form-label'}>{applicationStrings.label_source[language]}:</span>
            {props.smallVariant !== true ?
                <div className={"row"}>
                    <div className="col-4 column select-menu form-section">
                        {sourceSelectBox}
                    </div>
                    <div className={"col-8"}>
                        {checkboxes}
                    </div>
                </div>
                :
                <div>
                    <div>
                        {sourceSelectBox}
                    </div>
                    <div style={{paddingLeft: "24px", paddingTop: "8px"}}>
                        {checkboxes}
                    </div>
                </div>
            }
        </div>
    }


    const amount_label = props.smallVariant
        ? `${applicationStrings.label_amount_short[language]}:`
        : `${applicationStrings.label_amount[language]}:`
    const initialFoodClass = props.initialFoodClassToSet ? props.initialFoodClassToSet : 0

    const selectClass = isSmallScreen(windowSize) ? "form-control-sm" : ""
    const inputClass = isSmallScreen(windowSize) ? "form-control form-control-sm input-sm" : "form-control input"

    return <div>
        <div className="container">
            {props.noCategorySelect !== true &&
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_category[language]}:</span>
                <Select className={selectClass}
                        options={categoriesList}
                        value={selectedCategory ? selectedCategory : categoriesList[0]}
                        onChange={(value) => handleCategoryChange(value)}
                />
            </div>
            }
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_foodclass[language]}:</span>
                <Select className={selectClass}
                        options={foodClassesList}
                        value={selectdFoodClass ? selectdFoodClass : foodClassesList[initialFoodClass]}
                        onChange={(value) => handleFoodClassChange(value)}
                />
            </div>
            <div className="column select-menu form-section">
                <span className={'form-label'}>{applicationStrings.label_fooditem[language]}:</span>
                <Select className={selectClass}
                        options={foodItemsList}
                        value={selectedFoodItem ? selectedFoodItem : foodItemsList[0]}
                        onChange={handleFoodItemChange}
                />
            </div>
            <div className="column select-menu form-section">
                <div className={"row"}>
                    <div className={"col-lg-8 col-xl-9"}>
                        <span
                            className={'form-label'}>{applicationStrings.label_portion[language]}:</span>
                        <Select className={selectClass}
                                options={portionsList}
                                value={selectedPortion ? selectedPortion : portionsList[0]}
                                onChange={(value) => handlePortionChange(value)}/>
                    </div>
                    <div className={"col-lg-4 col-xl-3"}>
                        <span
                            className={'form-label'}>{amount_label}</span>
                        <input className={inputClass}
                               disabled={selectedPortion?.value.portionType !== 0}
                               value={portionAmount}
                               onChange={handlePortionAmountChange}
                        />
                    </div>
                </div>
            </div>
            {renderSourceLine()}
        </div>
    </div>

}