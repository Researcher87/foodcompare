import React, {ReactElement, useContext, useState} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import getName from "../../service/LanguageService";
import {getNameFromFoodNameList} from "../../service/nutrientdata/NameTypeService";
import {getFoodClassesOfCategory} from "../../service/nutrientdata/FoodClassService";
import {getFoodItemsSelectList} from "../../service/nutrientdata/FoodItemsService";
import {Form, Modal} from "react-bootstrap";

interface CategoryTreeModalProps {
    selectedCategory: number,
    closeModal: () => void
    selectFoodItemFromCategoryTree: (number) => void
}

export function CategoryTreeModal(props: CategoryTreeModalProps): ReactElement {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    const [separateByCategory, setSeparateByCategory] = useState(true)

    if(!applicationContext) {
        return <div>No content.</div>
    }

    const foodDataCorpus = applicationContext.foodDataCorpus
    const { foodNames, conditions, foodClasses, foodItems } = foodDataCorpus

    const onClickFoodItem = (foodItemId) => {
        props.selectFoodItemFromCategoryTree(foodItemId)
        props.closeModal()
    }

    const renderCategoryTree = () => {
        const categories = props.selectedCategory === 0
            ? foodDataCorpus.categories.slice(1)
            : foodDataCorpus.categories.filter(category => category.id === props.selectedCategory)

        if(props.selectedCategory !== 0 || separateByCategory) {  // Separate by category
            return categories.map((category, index) => {
                const name = getName(category, language)
                const categoryHeading = props.selectedCategory === 0
                    ? `${index+1}. ${name}`
                    : name;
                return <div style={{paddingBottom: "4ch"}} key={`tree-category-${index}`}>
                    <h4>{categoryHeading}</h4>
                    {renderFoodClasses(category.id)}
                </div>
            })
        } else {   // List all food classes
            return <div>
                {renderFoodClasses(0)}
            </div>
        }
    }

    const renderFoodClasses = (categoryId) => {
        const foodClassesOfCategory = getFoodClassesOfCategory(foodClasses, categoryId)
        foodClassesOfCategory.sort((obj1, obj2) => {
            const nameA = getNameFromFoodNameList(foodNames, obj1.nameKey, language, false) ?? ''
            const nameB = getNameFromFoodNameList(foodNames, obj2.nameKey, language, false) ?? ''
            return nameA.localeCompare(nameB)
        })

        return foodClassesOfCategory.map(foodClass => {
            const foodClassName = getNameFromFoodNameList(foodNames, foodClass.nameKey ?? -1, language, false)
            return <div style={{paddingLeft: "2ch", paddingBottom: "1ch"}} key={`tree-foodclass-${foodClass.id}`}>
                <div className={"form-text"} style={{fontWeight: "bold"}}>{foodClassName}</div>
                <div>{renderFoodItems(foodClass.id)}</div>
            </div>
        })
    }

    const renderFoodItems = (foodClassId) => {
        const foodItemsSelectList = getFoodItemsSelectList(foodItems, foodClassId, foodNames, conditions, language)

        return foodItemsSelectList.map(foodItemSelectOption => {
            const foodItemId = foodItemSelectOption.value.id
            return <div style={{paddingLeft: "4ch"}}  key={`tree-foodclass-${foodItemId}`}>
                <button className={"btn btn-link"}
                        onClick={() => onClickFoodItem(foodItemId)}>
                    {foodItemSelectOption.label}
                </button>
            </div>
        })
    }

    return (
        <Modal size={'lg'} show={true}>
            <Modal.Header>
                <h5 className="modal-title">{applicationStrings.label_categoryTree_title[language]}</h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body" style={{height: "70vh", overflowY: "auto"}}>
                    {renderCategoryTree()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className={"d-flex flex-row justify-content-between w-100"}>
                    <div>
                        {props.selectedCategory === 0 &&
                            <Form.Check inline className="form-radiobutton"
                                        checked={separateByCategory}
                                        label={applicationStrings.label_categoryTree_checkbox[language]}
                                        onClick={() => setSeparateByCategory(!separateByCategory)}>
                            </Form.Check>
                        }
                    </div>
                    <div>
                        <button type="button"
                                className="btn btn-primary"
                                onClick={props.closeModal}>
                            {applicationStrings.button_close[language]}
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}