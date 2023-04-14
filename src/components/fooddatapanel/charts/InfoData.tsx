import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectedFoodItem from "../../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {getNameFromFoodNameList} from "../../../service/nutrientdata/NameTypeService";
import {applicationStrings} from "../../../static/labels";
import getName from "../../../service/LanguageService";
import {calculateChartContainerHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {isMobileDevice, useWindowDimension} from "../../../service/WindowDimension";
import {getNutrientData, getSourceName} from "../../../service/nutrientdata/NutrientDataRetriever";
import {Button} from "react-bootstrap";
import {getFoodItem, getFoodItemName} from "../../../service/nutrientdata/FoodItemsService";

interface InfoDataProps {
    selectedFoodItem: SelectedFoodItem,
    directCompare?: boolean
}

interface RowElement {
    key: string,
    value: string
}

export function InfoData(props: InfoDataProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const windowSize = useWindowDimension()
    const [containerHeight, setContainerHeight] = useState<number>(calculateChartContainerHeight(windowSize, props.directCompare))

    useEffect(() => {
        setContainerHeight(calculateChartContainerHeight(windowSize, props.directCompare))
    }, [containerHeight])

    const createRow = (key: string, value: any): RowElement => {
        return {
            key: key,
            value: value
        }
    }

    const getGeneralTableData = (): Array<RowElement> => {
        if (!applicationContext) {
            return []
        }

        const foodNameId = props.selectedFoodItem.foodItem.nameId
        const foodName = foodNameId ? getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, foodNameId, lang, true) : ''

        const foodClass = props.selectedFoodItem.foodClass;
        const foodClassNameId = foodClass ? foodClass.nameKey : null

        const sourceName = getSourceName(props.selectedFoodItem.selectedSource)
        const sourceItemId = getNutrientData(props.selectedFoodItem).sourceItemId

        const source = `United States Department of Agriculture (USDA)`;
        const sourceLine2 = `${sourceName}, ID = ${sourceItemId}`;
        const foodClassName = foodClassNameId ? getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, foodClassNameId, lang) : null;

        const categoryId = foodClass ? foodClass.category : null
        const category = categoryId ? applicationContext.foodDataCorpus.categories.find(category => category.id === categoryId) : null
        const categoryName = category ? getName(category, lang) : null;

        const conditionId = props.selectedFoodItem.foodItem.conditionId
        const condition = applicationContext.foodDataCorpus.conditions.find(condition => condition.id === conditionId)
        const conditionName = condition ? getName(condition, lang) : null;

        const tableDataGeneral: Array<RowElement> = [];

        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_foodName[lang]}:`, foodName)
        );
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_preparation[lang]}:`, conditionName)
        );
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_foodId[lang]}:`, props.selectedFoodItem.foodItem.id)
        );
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_foodClass[lang]}:`, foodClassName)
        );
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_category[lang]}:`, categoryName)
        );
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_source[lang]}:`, source)
        );
        tableDataGeneral.push(
            createRow("", sourceLine2)
        );

        return tableDataGeneral;
    }

    const getTableDataPortion = () => {
        const foodPortion = props.selectedFoodItem.portion;
        const portionValue = `${foodPortion.amount} g`;

        const portionObject = applicationContext?.foodDataCorpus.portionTypes.find(portion => portion.id === foodPortion.portionType)
        if (portionObject) {
            const portionName = foodPortion.portionType !== 0 ? getName(portionObject, lang) : applicationStrings.portion_individual[lang];
            const tableDataPortion: Array<RowElement> = [];

            tableDataPortion.push(
                createRow(`${applicationStrings.label_info_portionType[lang]}:`, portionName)
            );

            tableDataPortion.push(
                createRow(`${applicationStrings.label_portion[lang]}:`, portionValue)
            );

            return tableDataPortion
        }


        return [];
    }


    const makeTableDataCombinedFood = () => {
        if (!applicationContext) {
            return
        }

        const compositeList = props.selectedFoodItem?.compositeSubElements ?? []
        const tableData: Array<RowElement> = []
        const {foodNames} = applicationContext.foodDataCorpus

        for (let i = 0; i < compositeList.length; i++) {
            const foodItem = compositeList[i].foodItem
            let name = getFoodItemName(foodItem, foodNames, lang)
            const portion = compositeList[i].portion.amount
            const conditionId = compositeList[i].foodItem.conditionId

            if (conditionId !== 100) {
                const condition = applicationContext.foodDataCorpus.conditions.find(condition => condition.id === conditionId)
                const conditionName = condition ? getName(condition, lang) : null;
                name += ` (${conditionName})`
            }
            tableData.push(
                createRow(`${name}:`, `${portion} g`)
            )
        }

        return tableData;
    }

    const tableClass = isMobileDevice() ? "table-style-m" : "table-style"

    const renderSubTable = (data) => {
        return (
            <div>
                <BootstrapTable trClassName={tableClass} bordered={false} data={data}>
                    <TableHeaderColumn className="table-header-no-top-border" dataField='key' isKey width="200px"/>
                    <TableHeaderColumn className="table-header-no-top-border" dataField='value'/>
                </BootstrapTable>
            </div>
        );
    }

    const onLinkClick = () => {
        const sourceItemId = getNutrientData(props.selectedFoodItem).sourceItemId
        const usdaLink = `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${sourceItemId}/nutrients`

        const link = window.open(usdaLink, '_blank')
        if (link) {
            link.focus()
        } else {
            window.location.href = usdaLink
        }
    }


    let height = containerHeight
    if (!props.directCompare) {
        height += 86
    }

    const isCompositeFoodElement = props.selectedFoodItem.aggregated === true

    return (
        <div>
            <div style={{height: height, maxHeight: height, overflowY: "auto", padding: "15px"}}>
                {!isCompositeFoodElement &&
                <div>
                    <div>
                        <div>
                            {renderSubTable(getGeneralTableData())}
                        </div>
                        <div style={{paddingTop: "30px"}}>
                            <h5>{applicationStrings.label_info_portion[lang]}</h5>
                            {renderSubTable(getTableDataPortion())}
                        </div>
                    </div>
                    <div style={{paddingTop: "20px", paddingBottom: "12px"}}>
                        <Button variant={'link'} active={true} onClick={onLinkClick}>
                            {applicationStrings.label_usda_reference[lang]}
                        </Button>
                    </div>
                </div>
                }
                {isCompositeFoodElement &&
                <div>
                    <h5>{applicationStrings.label_info_composite[lang]}</h5>
                    {renderSubTable(makeTableDataCombinedFood())}
                </div>
                }
            </div>
        </div>
    );

}