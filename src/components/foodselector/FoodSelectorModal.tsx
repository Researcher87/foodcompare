import React, {useContext, useState} from 'react'

import {Button, Modal} from 'react-bootstrap'

import {NotificationManager} from 'react-notifications'
import 'react-notifications/lib/notifications.css';

import FoodSelector from "./FoodSelector";
import {applicationStrings} from "../../static/labels";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import SelectedFoodItem, {FilteredFoodItem} from "../../types/livedata/SelectedFoodItem";
import {LanguageContext} from "../../contexts/LangContext";
import {CompositeFoodList} from "./CompositeFoodList";
import {initialFoodClassId, maximalPortionSize} from "../../config/ApplicationSetting";
import combineFoodItems from "../../service/calculation/FoodDataAggregationService";
import {FaQuestionCircle, FaList, FaFilter} from "react-icons/fa";
import {HelpModal} from "../HelpModal";
import {getHelpText} from "../../service/HelpService";
import ReactSelectOption from "../../types/ReactSelectOption";
import {MODE_EDIT, SOURCE_FNDDS} from "../../config/Constants";
import {CategoryTreeModal} from "./CategoryTreeModal";
import {FilterModal} from "./filter/FilterModal";
import {makeSelectedFoodItemObject} from "../../service/nutrientdata/FoodItemsService";
import ReactTooltip from "react-tooltip";

export interface FoodSelectorModalProps {
    onHide: () => void,
    selectedFoodItemCallback: (selectedFoodItem: SelectedFoodItem) => void
    compositeSelector: boolean
    selectedFoodItem?: SelectedFoodItem,
    mode?: string
}


const FoodSelectorModal: React.FC<FoodSelectorModalProps> = (props: FoodSelectorModalProps) => {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const initialFoodItem = props.selectedFoodItem ? props.selectedFoodItem : null
    const initialCompositeList = props.selectedFoodItem && props.selectedFoodItem.compositeSubElements
        ? props.selectedFoodItem.compositeSubElements
        : []

    const [selectedFoodItem, setSelectedFoodItem] = useState<SelectedFoodItem | null>(initialFoodItem)
    const [compositeTitle, setCompositeTitle] = useState<string | null>(null)
    const [compositeList, setCompositeList] = useState<Array<SelectedFoodItem>>(initialCompositeList ?? [])
    const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
    const [showCategoryTreeModal, setShowCategoryTreeModal] = useState<boolean>(false)
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)

    if (!applicationContext) {
        return <div/>
    }

    const {foodItems, foodClasses} = applicationContext.foodDataCorpus

    const updateSelectedFoodItem = (selectedFoodItem: SelectedFoodItem): void => {
        setSelectedFoodItem(selectedFoodItem)
    }

    const updateCompositeTitle = (title: string): void => {
        setCompositeTitle(title)
    }

    const addCompositeElement = () => {
        if (selectedFoodItem !== null) {
            if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
                NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
                return;
            }

            const newList: Array<SelectedFoodItem> = [...compositeList]
            newList.push(selectedFoodItem)
            setCompositeList(newList)
        }
    }

    const deleteCompositeElement = (index: number) => {
        const newList: Array<SelectedFoodItem> = [...compositeList]
        newList.splice(index, 1)
        setCompositeList(newList)
    }

    const editCompositeElement = (index: number, newPortionAmount: number) => {
        const newList = compositeList.map((item, iteratorIndex) => {
                if(index !== iteratorIndex) {
                    return item
                } else {
                    return {...item, portion: {
                        ...item.portion, portionType: 0, amount: newPortionAmount
                    }}
                }
            })
        setCompositeList(newList)
    }

    const onSubmit = () => {
        if (props.compositeSelector) {
            onSubmitComposite()
        } else {
            onSubmitSingleItem()
        }
    }

    const onSubmitSingleItem = () => {
        if (props.mode === MODE_EDIT) {
            if (selectedFoodItem) {
                if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
                    NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
                    return
                }
                props.selectedFoodItemCallback(selectedFoodItem)
                props.onHide()
            }
            return;
        }

        const foodItemId = selectedFoodItem ? selectedFoodItem.foodItem.id : null
        if (foodItemId) {
            const existingItemInList = applicationContext?.applicationData.foodDataPanel.selectedFoodItems.find(foodItem => foodItem.id === foodItemId)

            if (existingItemInList) {
                NotificationManager.error(applicationStrings.message_error_existing_element[language])
                return
            }
        }

        if (!selectedFoodItem || !selectedFoodItem.foodItem || !selectedFoodItem.foodClass || !selectedFoodItem.portion) {
            NotificationManager.error(applicationStrings.message_error_incomplete_form[language])
        } else if (selectedFoodItem.portion.amount < 1 || selectedFoodItem.portion.amount > maximalPortionSize) {
            NotificationManager.error(applicationStrings.message_error_invalid_portion[language])
        } else {
            props.selectedFoodItemCallback(selectedFoodItem)
            props.onHide()
        }
    }

    const onSubmitComposite = () => {
        let aggregatedSelectedFoodItem = combineFoodItems(compositeList)

        if (compositeTitle !== null && compositeTitle.trim().length > 0) {
            aggregatedSelectedFoodItem.title = compositeTitle.length < 24
                ? compositeTitle.trim()
                : compositeTitle.substring(0, 21).trim() + "..."
        } else {
            aggregatedSelectedFoodItem.title = applicationStrings.input_compositelist_title[language]
        }

        if (!aggregatedSelectedFoodItem) {
            return
        }

        aggregatedSelectedFoodItem = {...aggregatedSelectedFoodItem, aggregated: true}
        props.selectedFoodItemCallback(aggregatedSelectedFoodItem)
        props.onHide()
    }

    const updateFoodSelectorConfig = (selectedCategory: ReactSelectOption | null, supplementData: boolean, combineData: boolean) => {
        if (applicationContext) {
            const currentSelectorSetting = applicationContext.applicationData.foodSelector
            if (selectedCategory !== currentSelectorSetting.selectedCategory || supplementData !== currentSelectorSetting.sourceSupplement
                || combineData !== currentSelectorSetting.sourceCombine) {
                applicationContext.setFoodSelectorConfig(selectedCategory, supplementData, combineData)
            }
        }
    }

    const onCancel = () => {
        props.onHide()
    }

    const onOpenHelpModal = () => {
        setShowHelpModal(true)
    }

    const onOpenCategoryTreeModal = () => {
        setShowCategoryTreeModal(true)
    }

    const onOpenFilterModal = () => {
        setShowFilterModal(true)
    }

    const title = props.compositeSelector
        ? applicationStrings.label_foodselector_composite[language]
        : applicationStrings.label_foodselector[language]
    const helpText = props.compositeSelector ? getHelpText(10, language) : getHelpText(9, language)

    const selectFoodItemFromCategoryTree = (foodItemId) => {
        const foodItemToSelect = foodItems.find(foodItem => foodItem.id === foodItemId)

        if (foodItemToSelect && foodItemToSelect.portionData && foodItemToSelect.portionData.length > 0) {
            let selectedSource = 0;  // SR Legacy = Default source
            if (applicationContext.applicationData.preferredSource === SOURCE_FNDDS && foodItemToSelect.fnddsId) {
                selectedSource = 1;
            }

            const foodClass = foodClasses.find(foodClass => foodClass.id === foodItemToSelect.foodClass)

            const selectedObject: SelectedFoodItem = {
                foodClass: foodClass,
                foodItem: foodItemToSelect,
                portion: foodItemToSelect.portionData[0],
                selectedSource,
                supplementData: applicationContext.applicationData.foodSelector.sourceSupplement,
                combineData: applicationContext.applicationData.foodSelector.sourceCombine,
            }

            setSelectedFoodItem(selectedObject)
        }
    }

    const selectFoodItemFromFilterModal = (selectedFilterResult: FilteredFoodItem): void => {
        console.log('STUB: I will set', selectedFilterResult)

        const {foodItem} = selectedFilterResult
        const foodClass = applicationContext.foodDataCorpus.foodClasses.find(foodClass => foodClass.id === foodItem.foodClass)
        const portionData = foodItem.portionData ? foodItem.portionData[0] : undefined

        const selectedFoodItem = makeSelectedFoodItemObject(foodItem, foodClass, portionData, 0, false, false,
            selectedFilterResult.source)

        setSelectedFoodItem(selectedFoodItem)
    }

    const category = applicationContext.applicationData.foodSelector.selectedCategory
        ? applicationContext.applicationData.foodSelector.selectedCategory.value : 0

    const canAccessCategoryTree = !props.compositeSelector && props.mode !== MODE_EDIT
    const size = props.compositeSelector ? "xl" : "lg"

    return (
        <Modal size={size} show={true} onHide={props.onHide} backdrop="static">
            <Modal.Header>
                <b>{title}</b>
            </Modal.Header>
            <Modal.Body>
                {showHelpModal && helpText !== null &&
                <HelpModal helpText={helpText}
                           size={"lg"}
                           closeHelpModal={() => setShowHelpModal(false)}/>
                }
                {showCategoryTreeModal &&
                <CategoryTreeModal selectedCategory={category}
                                   closeModal={() => setShowCategoryTreeModal(false)}
                                   selectFoodItemFromCategoryTree={selectFoodItemFromCategoryTree}
                />
                }
                {showFilterModal &&
                <FilterModal closeModal={() => setShowFilterModal(false)}
                             selectFoodItemFromFilterModal={selectFoodItemFromFilterModal}/>
                }
                <div>
                    {!props.compositeSelector ?
                        <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                      defaultFoodClass={initialFoodClassId}
                                      compositeSelector={false}
                                      selectedFoodItem={selectedFoodItem}
                                      updateFoodSelectorConfig={updateFoodSelectorConfig}
                                      mode={props.mode}
                        />
                        :
                        <div className={"container"}>
                            <div className={"row"}>
                                <div className={"col-6"}>
                                    <FoodSelector updateSelectedFoodItem={updateSelectedFoodItem}
                                                  updateFoodSelectorConfig={updateFoodSelectorConfig}
                                                  defaultFoodClass={initialFoodClassId}
                                                  updateCompositeTitle={updateCompositeTitle}
                                                  compositeSelector={true}
                                    />
                                </div>
                                <div className={"col-6"}>
                                    <CompositeFoodList selectedFoodItems={compositeList}
                                                       deleteItem={deleteCompositeElement}
                                                       editCompositeElement={editCompositeElement}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className={"justify-content-between"}>
                <div>
                    <span style={{paddingRight: "2ch"}}>
                        <Button className={"btn btn-secondary"} onClick={onOpenHelpModal}>
                            <FaQuestionCircle/>
                        </Button>
                    </span>
                    {canAccessCategoryTree &&
                    <span style={{paddingRight: "2ch"}}>
                        <Button className={"btn btn-secondary"}
                                onClick={onOpenCategoryTreeModal}
                                data-for={"fa-btn-categorytree"}
                                data-tip={applicationStrings.tooltip_category_tree[language]}>
                            <FaList/>
                               <ReactTooltip id={"fa-btn-categorytree"}/>
                        </Button>
                    </span>
                    }
                    {canAccessCategoryTree &&
                    <Button className={"btn btn-secondary"}
                            onClick={onOpenFilterModal}
                            data-for={"fa-btn-filter"}
                            data-tip={applicationStrings.tooltip_filter[language]}>
                        <FaFilter/>
                        <ReactTooltip id={"fa-btn-filter"}/>
                    </Button>
                    }
                </div>
                <div className={"d-flex d-row justify-content-end"}>
                    <Button className={"btn-secondary form-button"} onClick={onCancel}>
                        {applicationStrings.button_cancel[language]}
                    </Button>
                    {props.compositeSelector ?
                        <Button className={"form-button"}
                                onClick={onSubmit}
                                disabled={!compositeList || compositeList.length < 1}>
                            {applicationStrings.button_show[language]}
                        </Button>
                        :
                        <Button className={"form-button"} onClick={onSubmit}>
                            {applicationStrings.button_select[language]}
                        </Button>
                    }

                    {props.compositeSelector &&
                    <Button className={"form-button"} onClick={addCompositeElement}>
                        {applicationStrings.button_add[language]}
                    </Button>
                    }
                </div>
            </Modal.Footer>
        </Modal>
    )

}

export default FoodSelectorModal