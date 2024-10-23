import React, {useContext} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectedFoodItem from "../../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {getNameFromFoodNameList} from "../../../service/nutrientdata/NameTypeService";
import {applicationStrings} from "../../../static/labels";
import getName from "../../../service/LanguageService";
import {isMobileDevice} from "../../../service/WindowDimension";
import {canSupplementData, getNutrientData, getSourceName} from "../../../service/nutrientdata/NutrientDataRetriever";
import {Button} from "react-bootstrap";
import {getFoodItemName} from "../../../service/nutrientdata/FoodItemsService";
import {NutrientData} from "../../../types/nutrientdata/FoodItem";
import {round} from "../../../service/calculation/MathService";
import {countNumberOfAvailableValues} from "../../../service/nutrientdata/NutrientStatisticsService";

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

        const canSupplement = canSupplementData(props.selectedFoodItem.foodItem.nutrientDataList)
        let calculationLabel = applicationStrings.label_info_calculation_none;

        if(props.selectedFoodItem.supplementData && props.selectedFoodItem.combineData) {
            calculationLabel = applicationStrings.label_info_calculation_supplemented_combined
        } else {
            if(props.selectedFoodItem.supplementData) {
                if(canSupplement) {
                    calculationLabel = applicationStrings.label_info_calculation_supplemented
                } else {
                    calculationLabel = applicationStrings.label_info_calculation_supplement_impossible
                }
            }
            if(props.selectedFoodItem.combineData) {
                calculationLabel = applicationStrings.label_info_calculation_combined
            }
        }

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
        tableDataGeneral.push(
            createRow(`${applicationStrings.label_info_calculation[lang]}:`, calculationLabel[lang])
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


    const getDebugData = () => {
        const nutrientData = props.selectedFoodItem.foodItem.nutrientDataList
        const source1 = nutrientData[0]
        const source2 = nutrientData.length === 2 ? nutrientData[1] : null

        const makeNutrientValuesLine = (dataObj: NutrientData) => {
            return "E: " + round(dataObj.baseData.energy, 1) + ", "
                + "W: " + round(dataObj.baseData.water, 1) + ", "
                + "C: " + round(dataObj.baseData.carbohydrates, 1) + ", "
                + "L: " + round(dataObj.baseData.lipids, 1) + ", "
                + "P: " + round(dataObj.baseData.proteins, 1)
        }

        const makeAvailableNutrientValuesLine = (nutrientData: NutrientData) => {
            const valuesStatistics = countNumberOfAvailableValues(props.selectedFoodItem.foodItem, nutrientData.source.id)
            return `B: ${valuesStatistics.baseDataValues}, 
                L: ${valuesStatistics.lipidDataValues},
                C: ${valuesStatistics.carbDataValues},
                P: ${valuesStatistics.proteinDataValues},
                V: ${valuesStatistics.vitaminDataValues},
                M: ${valuesStatistics.mineralDataValues},
                SUM: ${valuesStatistics.getTotalNumberOfValues()}`
        }

        const tableDataDebug: Array<RowElement> = [];
        tableDataDebug.push(createRow(`Key data ${source1.source.name}`, makeNutrientValuesLine(source1)))
        if (source2) {
            tableDataDebug.push(createRow(`Key data ${source2.source.name}`, makeNutrientValuesLine(source2)))

        }

        if (source2) {  // Empty line between the two sources if two sources exist
            tableDataDebug.push(createRow(" ", " "))
        }

        tableDataDebug.push(createRow(`Avail. data ${source1.source.name}`, makeAvailableNutrientValuesLine(source1)))
        if (source2) {
            tableDataDebug.push(createRow(`Avail. data ${source2.source.name}`, makeAvailableNutrientValuesLine(source2)))
        }

        return tableDataDebug
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
                name += `(${conditionName})`
            }
            tableData.push(
                createRow(`${name}
        :
            `, `${portion}
            g`)
            )
        }

        return tableData;
    }

    const tableClass = isMobileDevice() ? "table-style-m" : "table-style"

    const renderSubTable = (data) => {
        return (
            <div>
                <BootstrapTable trClassName={tableClass} bordered={false} data={data}>
                    <TableHeaderColumn className="table-header-no-top-border" dataField='key' isKey width="20vw"/>
                    <TableHeaderColumn className="table-header-no-top-border" dataField='value'/>
                </BootstrapTable>
            </div>
        );
    }

    const onLinkClick = () => {
        const sourceItemId = getNutrientData(props.selectedFoodItem).sourceItemId
        const usdaLink = `
            https://fdc.nal.usda.gov/fdc-app.html#/food-details/${sourceItemId}/nutrients`
        const link = window.open(usdaLink, '_blank')
        if (link) {
            link.focus()
        } else {
            window.location.href = usdaLink
        }
    }

    const isCompositeFoodElement = props.selectedFoodItem.aggregated === true
    const containerClass = props.directCompare ? "tab-info-directcompare" : "tab-info"

    return (
        <div className={containerClass}>
            <div>
                {!isCompositeFoodElement &&
                <div>
                    <div>
                        {applicationContext?.debug &&
                        <div style={{paddingBottom: "4vh"}}>
                            {renderSubTable(getDebugData())}
                        </div>
                        }
                        <div>
                            {renderSubTable(getGeneralTableData())}
                        </div>
                        <div style={{paddingTop: "3vh"}}>
                            <h5>{applicationStrings.label_info_portion[lang]}</h5>
                            {renderSubTable(getTableDataPortion())}
                        </div>
                    </div>
                    <div style={{paddingTop: "2vh", paddingBottom: "1.2vh"}}>
                        <Button variant={'link'} active={true} onClick={onLinkClick}>
                            {applicationStrings.label_usda_reference[lang]}
                        </Button>
                    </div>
                </div>
                }
                {isCompositeFoodElement && props.selectedFoodItem?.compositeSubElements &&
                <div>
                    <h5>{applicationStrings.label_info_composite[lang]}</h5>
                    {renderSubTable(makeTableDataCombinedFood())}
                </div>
                }
                {isCompositeFoodElement && !props.selectedFoodItem?.compositeSubElements &&
                <div>
                    {applicationStrings.label_noData[lang]}
                </div>
                }
            </div>
        </div>
    );

}