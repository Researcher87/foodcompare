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
import {foodClassLabelSeparator, getFoodClassSelectList} from "../../service/nutrientdata/FoodClassService";
import {getFoodItemsSelectList} from "../../service/nutrientdata/FoodItemsService";
import FoodItem, {PortionData} from "../../types/nutrientdata/FoodItem";
import {getDefaultPortionData, getPortionReactSelectList} from "../../service/nutrientdata/PortionDataService";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import FoodClass from "../../types/nutrientdata/FoodClass";
import {LanguageContext} from "../../contexts/LangContext";
import {isMobileDevice, isSmallScreen, useWindowDimension} from "../../service/WindowDimension";
import {MODE_EDIT, PORTION_KEY_INDIVIDUAL, SOURCE_FNDDS, SOURCE_SRLEGACY} from "../../config/Constants";
import {getSourceName} from "../../service/nutrientdata/NutrientDataRetriever";
import ReactTooltip from "react-tooltip";
import {Button, Form} from "react-bootstrap";
import {
    COLOR_SELECTOR_CATEGORY,
    COLOR_SELECTOR_FOODCLASS, COLOR_SELECTOR_FOODITEM,
    correspondingSelectElementStyle,
    customSelectStyles,
    getCustomSelectStyle
} from "../../config/UI_Config";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import {FaQuestionCircle, FaSlidersH} from "react-icons/fa";
import {Unit, UnitConversionModal} from "../UnitConversionModal";
import {max_portion} from "../../config/ChartConfig";

export interface FoodSelectorProps {
    updateSelectedFoodItem: (selectedFoodItem: SelectedFoodItem) => void
    updateFoodSelectorConfig: (selectedCategory: ReactSelectOption | null, supplementData: boolean, combineData: boolean) => void
    updateCompositeTitle?: (compositeTitle: string) => void
    compositeSelector: boolean
    directCompareSelector?: boolean
    initialFoodClassToSet?: number
    selectedFoodItem?: SelectedFoodItem | null
    defaultFoodClass?: number
    defaultFoodItem?: number
    directCompareSelectorNumber?: number
    mode?: string
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

    const foodSelectorConfig = applicationContext?.applicationData.foodSelector
    const directCompareSelectorConfig1 = applicationContext?.applicationData.directCompareDataPanel.foodSelector1
    const directCompareSelectorConfig2 = applicationContext?.applicationData.directCompareDataPanel.foodSelector2

    const initialSupplementValue = props.directCompareSelectorNumber === undefined
        ? foodSelectorConfig?.sourceSupplement || false
        : props.directCompareSelectorNumber === 1
            ? directCompareSelectorConfig1?.sourceSupplement || false
            : directCompareSelectorConfig2?.sourceSupplement || false

    const initialCombineValue = props.directCompareSelectorNumber === undefined
        ? foodSelectorConfig?.sourceCombine || false
        : props.directCompareSelectorNumber === 1
            ? directCompareSelectorConfig1?.sourceCombine || false
            : directCompareSelectorConfig2?.sourceCombine || false

    const [selectedCategory, setSelectedCategory] = useState<ReactSelectOption | null>(initialCategory)
    const [selectedFoodClass, setSelectedFoodClass] = useState<ReactSelectFoodClassOption | null>(null)
    const [selectedFoodItem, setSelectedFoodItem] = useState<ReactSelectFoodItemOption | null>(null)
    const [selectedPortion, setSelectedPortion] = useState<ReactSelectPortionOption | null>(null)
    const [portionAmount, setPortionAmount] = useState<number>(0)
    const [title, setTitle] = useState<string>(applicationStrings.input_compositelist_title[language])
    const [selectedSource, setSelectedSource] = useState<ReactSelectOption | null>(null)
    const [supplementData, setSupplementData] = useState<boolean>(initialSupplementValue)
    const [combineData, setCombineData] = useState<boolean>(initialCombineValue)
    const [initialized, setInitialized] = useState<boolean>(false)

    const [categoriesList, setCategoriesList] = useState<Array<ReactSelectOption>>([])
    const [foodClassesList, setFoodClassesList] = useState<Array<ReactSelectFoodClassOption>>([])
    const [foodClassesTypeaheadList, setFoodClassesTypeaheadList] = useState<Array<ReactSelectFoodClassOption>>([])

    const [foodItemsList, setFoodItemsList] = useState<Array<ReactSelectFoodItemOption>>([])
    const [portionsList, setPortionsList] = useState<Array<ReactSelectPortionOption>>([])
    const [sourcesList, setSourcesList] = useState<Array<ReactSelectOption>>([])

    const [unitModalOpen, setUnitModalOpen] = useState<boolean>(false)

    // The food class search key entered by the user:
    const [foodClassSearchTerm, setFoodClassSearchTerm] = useState<string>("")

    // The selected food item object, from which the selector has once been created.
    const initiallySetFoodItem = props.selectedFoodItem !== undefined ? props.selectedFoodItem : null
    const [initiallySetSelectedFoodItem, setInitiallySetSelectedFoodItem] = useState<SelectedFoodItem | null>(initiallySetFoodItem)

    const windowSize = useWindowDimension()

    const getInitialFoodClassNumber = (foodClassOptions: ReactSelectFoodClassOption[]): number => {
        if (props.initialFoodClassToSet !== undefined && props.initialFoodClassToSet !== null) {
            return props.initialFoodClassToSet
        }

        if (props.defaultFoodClass !== undefined) {
            const index = foodClassOptions.findIndex(foodClassOption => foodClassOption.value.id === props.defaultFoodClass)
            if (index !== -1) {
                return index
            }
        }

        return 0   // Use the first food class in the list if no other parameter indicates the food class to select
    }

    useEffect(() => {
            if (applicationContext && applicationContext.foodDataCorpus && categoriesList.length === 0) {
                const foodDataCorpus = applicationContext.foodDataCorpus

                if (foodDataCorpus.categories) {
                    const categoryItems = getCategorySelectList(foodDataCorpus.categories, language)
                    setCategoriesList(categoryItems)
                }

                if (foodDataCorpus.foodClasses) {
                    const category = selectedCategory ? selectedCategory.value : 0
                    const foodClasses = getFoodClassSelectList(foodDataCorpus, category, applicationContext.foodDataCorpus.foodNames, language)
                    setFoodClassesList(foodClasses)
                    setFoodClassesTypeaheadList(foodClasses)  // Initially, the typeahead-list is identical with the food classes list

                    const initialFoodClass = getInitialFoodClassNumber(foodClasses)
                    const foodClass = foodClasses[initialFoodClass]
                    setSelectedFoodClass(foodClass)

                    if (foodDataCorpus.foodItems && foodClasses) {
                        const foodItemsOfFoodClass = getFoodItemsSelectList(
                            foodDataCorpus.foodItems,
                            foodClasses[initialFoodClass].value.id,
                            foodDataCorpus.foodNames,
                            foodDataCorpus.conditions, language
                        )

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
                if (selectedFoodItem && selectedFoodClass && selectedPortion) {
                    const newFoodItem = makeSelectedFoodItemObject(selectedFoodItem.value, selectedFoodClass.value, selectedPortion.value)
                    if (newFoodItem) {
                        props.updateSelectedFoodItem(newFoodItem)
                        props.updateFoodSelectorConfig(selectedCategory, supplementData, combineData)
                    }
                } else if (props.selectedFoodItem) {
                    const {foodItem, foodClass, portion} = props.selectedFoodItem
                    makeSelectedFoodItemObject(foodItem, foodClass, portion)
                }
            }

        }, [selectedFoodItem,
            selectedPortion,
            selectedFoodClass,
            selectedCategory,
            selectedSource,
            portionAmount,
            title,
            supplementData,
            combineData
        ]
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
        resetTypeaheadFilter()
    }

    const resetTypeaheadFilter = () => {
        setFoodClassesTypeaheadList(foodClassesList)
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

    const handleTitleChange = (event) => {
        setTitle((event.target.value))
        if (props.updateCompositeTitle !== undefined) {
            props.updateCompositeTitle(event.target.value)
        }
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
        const foodDataCorpus = applicationContext.foodDataCorpus

        if (foodDataCorpus) {
            const foodClassItems = getFoodClassSelectList(foodDataCorpus, category.value, applicationContext.foodDataCorpus.foodNames, language)
            setFoodClassesList(foodClassItems)
            setFoodClassesTypeaheadList(foodClassItems)
            setSelectedFoodClass(foodClassItems[0])
            updateFoodItem(foodClassItems[0])
        }
    }

    const updateFoodItem = (foodClass: ReactSelectFoodClassOption) => {
        const {foodItems, foodNames, conditions} = applicationContext.foodDataCorpus

        if (foodItems) {
            let selectedFoodItemIndex;

            const foodClassItems = getFoodItemsSelectList(foodItems, foodClass.value.id, foodNames, conditions, language)
            setFoodItemsList(foodClassItems)

            if (foodClassItems && foodClassItems.length > 0) {
                const firstFoodClassItem = foodClassItems[0]
                const nameId = firstFoodClassItem.value.nameId ?? -1
                const firstFoodItemName = getNameFromFoodNameList(foodNames, nameId, language, false)

                // The first food item in the list starts with the food class search string entered by the user
                if (firstFoodItemName
                    && (firstFoodItemName.startsWith(foodClassSearchTerm)
                        || firstFoodItemName.includes(" " + foodClassSearchTerm))) {
                    selectedFoodItemIndex = 0;
                } else {   // Search for a food item in the list that starts with the food class search string
                    const matchingIndex = foodClassItems.findIndex(item => {
                        const nameId = item.value.nameId ?? -1
                        const foodItemName = getNameFromFoodNameList(foodNames, nameId, language, false)
                        return foodItemName && foodItemName.startsWith(foodClassSearchTerm)
                    })
                    if (matchingIndex >= 0) {  // Found one item in the list -> Select this item
                        selectedFoodItemIndex = matchingIndex
                    } else {   // Found no item in the list -> Just select the first food item
                        selectedFoodItemIndex = 0
                    }
                }
            }

            const foodItemToSelect = foodClassItems[selectedFoodItemIndex]
            setSelectedFoodItem(foodItemToSelect)

            const foodItemValue = foodItemToSelect.value
            if (foodItemValue) {
                updatePortionsList(foodItemValue)
                updateSourcesList(foodItemValue)
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
                } else {
                    return null
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


    const makeSelectedFoodItemObject = (foodItem: FoodItem | undefined, foodClass: FoodClass | undefined,
                                        portion: PortionData | undefined): SelectedFoodItem | null => {
        if (!foodItem || !foodClass || !portion) {
            return null
        }

        if (portion.portionType === 0) {
            portion.amount = portionAmount
        }

        return {
            foodItem: foodItem,
            foodClass: foodClass,
            portion: {...portion},
            selectedSource: selectedSource ? selectedSource.value : foodItem.nutrientDataList[0].source.id,
            supplementData: supplementData,
            combineData: combineData
        }
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

    /**
     * Manually creates a sorted typeahead list which will favor food classes starting with the search term
     * against food classes not starting (but including) the search term. Also, the food class is favored
     * against the food items of it, which may also include the search term (like "Cheese" is shown if "Gouda"
     * is entered).
     * @param value The value entered in the select input field
     * @param action The event action
     */
    const handleFoodClassInputChange = (value, {action}) => {
        if (action === 'input-change') {
            setFoodClassSearchTerm(value.trim())

            if (value.trim().length === 0) {
                setFoodClassesTypeaheadList(foodClassesList)
                return
            }

            let resultList: ReactSelectFoodClassOption[] = []
            let dictionary: string[] = []

            value = value.toLowerCase().trim()

            // Find all food class elements to the typeahead list that start with the search term
            foodClassesList.forEach(entry => {
                let label = entry.label.toLowerCase()
                if (label.includes(foodClassLabelSeparator)) {
                    label = label.substring(0, label.indexOf(foodClassLabelSeparator)).trim()
                }
                if (label.startsWith(value)) {
                    resultList.push(entry)
                    dictionary.push(entry.label)
                }
            })

            // Now add all food class elements to the typeahead list that match the search term (yet do not start with it)
            foodClassesList.forEach(entry => {
                let label = entry.label.toLowerCase()
                if (label.includes(foodClassLabelSeparator)) {
                    label = label.substring(0, label.indexOf(foodClassLabelSeparator)).trim()
                }
                if (label.includes(value) && !label.startsWith(value)) {
                    resultList.push(entry)
                    dictionary.push(entry.label)
                }
            })

            // Finally add all labels (class or items) that contain the search term
            foodClassesList.forEach(entry => {
                const label = entry.label.toLowerCase()
                if (label.includes(value) && !dictionary.includes(entry.label)) {
                    resultList.push(entry)
                }
            })

            setFoodClassesTypeaheadList(resultList)
        }
    }

    if (props.selectedFoodItem) {
        if (!initialized) {
            setInitialFoodElement()
        } else {
            if (initiallySetSelectedFoodItem === null && props.selectedFoodItem !== null
                || (initiallySetSelectedFoodItem !== null
                    && initiallySetSelectedFoodItem.foodItem.id !== props.selectedFoodItem.foodItem.id)
            ) {  // Selecting an element from the category tree => reset category to "all" and load all food classes
                setInitiallySetSelectedFoodItem(props.selectedFoodItem)
                setInitialFoodElement()
            }
        }
    }

    const renderSourceLine = () => {
        const sourceSelectBox = (
            <Select className={selectClass}
                    options={sourcesList}
                    isDisabled={sourcesList.length <= 1 || combineData}
                    value={selectedSource ? selectedSource : sourcesList[0]}
                    onChange={handleSourceChange}
                    styles={customSelectStyles}
            />
        )

        const checkboxes = (
            <div>
                <label className="form-elements"
                       data-for={"selector-supplement"}
                       data-tip={applicationStrings.label_source_supplement_tooltip[language]}>
                    <ReactTooltip/>
                    <Form.Check inline className="form-radiobutton"
                                label={applicationStrings.label_source_supplement[language]}
                                checked={supplementData}
                                disabled={sourcesList.length <= 1}
                                onClick={onCheckSupplementCheckbox}>
                    </Form.Check>
                    <ReactTooltip id={"selector-supplement"}/>
                </label>
                <label className="form-elements"
                       data-for={"selector-combine"}
                       data-tip={applicationStrings.label_source_combine_tooltip[language]}>
                    <ReactTooltip id={"selector-combine"}/>
                    <Form.Check className="form-radiobutton"
                                style={{minHeight: "1rem"}}
                                label={applicationStrings.label_source_combine[language]}
                                checked={combineData}
                                disabled={sourcesList.length <= 1}
                                onClick={onCheckCombineCheckbox}>
                    </Form.Check>
                </label>
            </div>
        )

        if (props.directCompareSelector && !isMobileDevice()) {  // Direct Compare Selector uses column layout for Checkboxes/Source box
            return <div>
                <span className={'form-label'}>{applicationStrings.label_source[language]}:</span>
                <div className={"d-flex row"}>
                    <div className="col-4 column select-menu form-section-small">
                        {sourceSelectBox}
                    </div>
                    <div className={"col-8"}>
                        {checkboxes}
                    </div>
                </div>
            </div>
        } else {
            return <div>
                <span className={'form-label'}>{applicationStrings.label_source[language]}:</span>
                <div className="select-menu form-section">
                    {sourceSelectBox}
                </div>
                <div>
                    {checkboxes}
                </div>
            </div>
        }
    }


    const amount_label = props.compositeSelector
        ? `${applicationStrings.label_amount_short[language]}:`
        : `${applicationStrings.label_amount[language]}:`
    const initialFoodClass = getInitialFoodClassNumber(foodClassesList)

    const selectClass = isSmallScreen(windowSize) ? "form-control-sm" : ""
    const inputClass = isSmallScreen(windowSize) ? "form-control form-control-sm" : "form-control"

    const formClass = props.directCompareSelector ? "form-section-small" : "form-section"

    // Remove hidden food class information in the label, which is only used to facilitate user search (e.g. find 'Cheese' for term 'Gouda')
    const foodclassFormatter = (option) => {
        let label = option.label

        if (label.includes(foodClassLabelSeparator)) {
            const pos = label.indexOf(foodClassLabelSeparator)
            label = label.substring(0, pos)
        }

        if (label.includes("[")) {
            const pos = label.indexOf("[")
            label = label.substring(0, pos)
        }

        return label
    }

    const stylesCategory = !props.directCompareSelector
        ? getCustomSelectStyle(COLOR_SELECTOR_CATEGORY)
        : customSelectStyles
    const stylesFoodClass = !props.directCompareSelector
        ? getCustomSelectStyle(COLOR_SELECTOR_FOODCLASS)
        : customSelectStyles
    const stylesFoodItem = !props.directCompareSelector
        ? getCustomSelectStyle(COLOR_SELECTOR_FOODITEM)
        : customSelectStyles

    const onSubmitUnit = (value) => {
        setPortionAmount(value)
    }


    const sourceUnits: Array<Unit> = [
        {
            labelKey: "_ounces",
            factor: 28.413062
        },
        {
            labelKey: "_fl_ounces",
            factor: 29.573529
        },
        {
            labelKey: "_pounds",
            factor: 453.59237
        },
    ]

    return <div>
        <div className="container">
            {props.compositeSelector &&
            <div>
                <span className={'form-label'}>{applicationStrings.label_title[language]}:</span>
                <input className={inputClass}
                       value={title}
                       style={correspondingSelectElementStyle}
                       onChange={handleTitleChange}
                />
            </div>
            }
            {props.directCompareSelector !== true &&
            <div className={formClass}>
                <span className={'form-label'}>{applicationStrings.label_category[language]}:</span>
                <Select className={selectClass}
                        options={categoriesList}
                        isDisabled={props.mode === MODE_EDIT}
                        value={selectedCategory ? selectedCategory : categoriesList[0]}
                        onChange={(value) => handleCategoryChange(value)}
                        styles={stylesCategory}
                />
            </div>
            }
            {unitModalOpen &&
                <UnitConversionModal sourceUnits={sourceUnits}
                                     targetUnitLabelKey={"_gram"}
                                     allowedMinimumTargetValue={1}
                                     allowedMaximumTargetValue={max_portion}
                                     initialValue={1}
                                     onSubmit={onSubmitUnit}
                                     closeModal={() => setUnitModalOpen(false)}>
                </UnitConversionModal>
            }
            <div className={formClass}>
                <span className={'form-label'}>{applicationStrings.label_foodclass[language]}:</span>
                <Select className={selectClass}
                        options={foodClassesTypeaheadList}
                        isDisabled={props.mode === MODE_EDIT}
                        onInputChange={handleFoodClassInputChange}
                        formatOptionLabel={foodclassFormatter}
                        value={selectedFoodClass ? selectedFoodClass : foodClassesList[initialFoodClass]}
                        onChange={(value) => handleFoodClassChange(value)}
                        onMenuClose={() => resetTypeaheadFilter()}
                        styles={stylesFoodClass}
                />
            </div>
            <div className={formClass}>
                <span className={'form-label'}>{applicationStrings.label_fooditem[language]}:</span>
                <Select className={selectClass}
                        isDisabled={props.mode === MODE_EDIT}
                        options={foodItemsList}
                        value={selectedFoodItem ? selectedFoodItem : foodItemsList[0]}
                        onChange={handleFoodItemChange}
                        styles={stylesFoodItem}
                />
            </div>
            <div className={formClass}>
                <div className={"row"}>
                    <div className={"col-8"}>
                        <span
                            className={'form-label'}>{applicationStrings.label_portion[language]}:</span>
                        <Select className={selectClass}
                                options={portionsList}
                                styles={customSelectStyles}
                                value={selectedPortion ? selectedPortion : portionsList[0]}
                                onChange={(value) => handlePortionChange(value)}/>
                    </div>
                    <div className={"col-4"}>
                        <div className={"d-flex flex-row align-items-end"}>
                            <div>
                                <span className={'form-label'}>{amount_label}</span>
                                <input className={inputClass}
                                       disabled={selectedPortion?.value.portionType !== 0}
                                       value={portionAmount}
                                       style={correspondingSelectElementStyle}
                                       onChange={handlePortionAmountChange}
                                />
                            </div>
                            <Button className={"btn btn-secondary"}
                                    disabled={!selectedPortion || selectedPortion.value.portionType !== PORTION_KEY_INDIVIDUAL}
                                    style={{marginLeft: "1vw"}}
                                    onClick={() => setUnitModalOpen(true)}>
                                <FaSlidersH/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {renderSourceLine()}
        </div>
    </div>

}