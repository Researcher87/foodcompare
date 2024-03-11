import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import React, {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {DISPLAYMODE_CHART, TAB_MINERAL_DATA, TAB_PROTEINS_DATA, TAB_VITAMIN_DATA} from "../../config/Constants";
import {isMobileDevice} from "../../service/WindowDimension";

interface FoodDataTableProps {
    tableData: Array<FoodTableDataObject>
    portionSize: number
    dataPage: string
}

export function FoodDataTable(props: FoodDataTableProps) {
    const dataExists = props.tableData && props.tableData.length > 0;
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext)

    const changeToChartMode = () => {
        applicationContext?.setFoodDataPanelData.setSelectedDisplayMode(DISPLAYMODE_CHART)
    }

    const formatDataCell = (cell, row) => {
        if(!cell) {
            return cell
        }

        if (!cell.includes("&&")) {
            return cell
        }

        const firstLineStype = {paddingBottom: "6px", display: 'block'}
        const indentStyle = {paddingLeft: "8px"}

        return <div>{cell.split("&&").map((element, index) => (
            <div key={`table-inner-cell-${row.label}-${index}`}>
                {index > 0 ?
                    <span style={indentStyle}>
                    {element}
                    </span>
                    :
                    <span style={firstLineStype}>
                    {element}
                </span>
                }
            </div>)
        )}</div>
    }

    const labelPortion = `${applicationStrings.label_per_portion[language.language]} (${props.portionSize} g)`
    const tableClass = isMobileDevice() ? "table-style-m" : "table-style"

    const shouldShowDietaryRequirements = props.dataPage === TAB_VITAMIN_DATA || props.dataPage === TAB_MINERAL_DATA
        || props.dataPage === TAB_PROTEINS_DATA

    return (
        <div className={"table-data"}>
            <div>
                {dataExists &&
                <BootstrapTable trClassName={tableClass} data={props.tableData} striped hover>
                    <TableHeaderColumn isKey dataField='label' dataFormat={formatDataCell}>Element</TableHeaderColumn>
                    <TableHeaderColumn dataField='value_100g'
                                       width={"9vw"}
                                       dataFormat={formatDataCell}>{applicationStrings.label_per_100g[language.language]}
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='value_portion'
                                       width={"10vw"}
                                       dataFormat={formatDataCell}>{labelPortion}
                    </TableHeaderColumn>
                    {shouldShowDietaryRequirements &&
                    <TableHeaderColumn dataField='dailyRequirement'
                                       width={"12vw"}
                                       dataFormat={formatDataCell}>{applicationStrings.label_requirement[language.language]}
                    </TableHeaderColumn>
                    }
                </BootstrapTable>
                }
                {!dataExists &&
                <div className="text-center">{applicationStrings.label_noData[language.language]}</div>
                }
            </div>
            <div style={{paddingTop: "25px"}}>
                <button className={"btn btn-link"} onClick={changeToChartMode}>
                    {applicationStrings.label_chart_view[language.language]}
                </button>
            </div>
        </div>
    );
}