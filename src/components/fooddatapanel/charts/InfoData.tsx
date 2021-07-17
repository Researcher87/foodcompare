import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../contexts/LangContext";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import SelectedFoodItem from "../../../types/livedata/SelectedFoodItem";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {getNameFromFoodNameList} from "../../../service/nutrientdata/NameTypeService";
import {applicationStrings} from "../../../static/labels";
import getName from "../../../service/LanguageService";
import {defaultPanelHeight} from "../../../config/ApplicationSetting";
import {direct_compare_chartheight} from "../../../config/ChartConfig";
import {calculateChartContainerHeight, calculateChartHeight} from "../../../service/nutrientdata/ChartSizeCalculation";
import {TAB_BASE_DATA} from "../../../config/Constants";
import {useWindowDimension} from "../../../service/WindowDimension";

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

    const createRow = (key, value): RowElement => {
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
        const foodName = foodNameId ? getNameFromFoodNameList(applicationContext.foodDataCorpus.foodNames, foodNameId, lang) : ''

        const foodClass = props.selectedFoodItem.foodClass;
        const foodClassNameId = foodClass ? foodClass.nameKey : null

        const sourceItemId = props.selectedFoodItem.foodItem.usdaId
        const source = `United States Department of Agriculture (USDA)`;
        const sourceLine2 = `ID = ${sourceItemId}`;
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


    const getTableDataCombinedFood = () => {
        // const individualList = props.foodItem.individualData;
        // const tableData = [];
        //
        // for(let i=0; i < individualList.length; i++) {
        //     tableData.push(
        //         createRow(`${individualList[i].name}:`, `${individualList[i].portion} g`)
        //     );
        // }
        //
        // return tableData;
    }


    const renderSubTable = (data) => {
        return (
            <div>
                <BootstrapTable bordered={false} data={data}>
                    <TableHeaderColumn className="tableHeaderClass" dataField='key' isKey width="200px"/>
                    <TableHeaderColumn className="tableHeaderClass" dataField='value'/>
                </BootstrapTable>
            </div>
        );
    }

    return (
        <div style={{height: containerHeight, maxHeight: containerHeight, overflowY: "auto", padding: "15px"}}>
            {props.selectedFoodItem.foodItem.foodClass !== 0 &&
            <div>
                <div>
                    {renderSubTable(getGeneralTableData())}
                </div>
                <div style={{paddingTop: "30px"}}>
                    <h5>{applicationStrings.label_info_portion[lang]}</h5>
                    {renderSubTable(getTableDataPortion())}
                </div>
            </div>
            }
            {props.selectedFoodItem.foodItem.foodClass === 0 &&
            <div>
                <h5>Individual</h5>
                {renderSubTable(getTableDataCombinedFood())}
            </div>
            }

        </div>
    );


}