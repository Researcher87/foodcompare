import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {DISPLAYMODE_CHART} from "../../config/Constants";

interface FoodDataTableProps {
    tableData: Array<FoodTableDataObject>
    portionSize: number
}

export function FoodDataTable(props: FoodDataTableProps) {
    const dataExists = props.tableData && props.tableData.length > 0;
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext)

    const changeToChartMode = () => {
        applicationContext?.setFoodDataPanelData.setSelectedDisplayMode(DISPLAYMODE_CHART)
    }

    const formatDataCell = (cell, row) => {
        if (!cell.includes("&&")) {
            return cell
        }

        const firstLineStype = {paddingBottom: "6px", display: 'block'}
        const indentStyle = {paddingLeft: "8px"}

        return <div>{cell.split("&&").map((element, index) => (<div>
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

    return (
        <div style={{height: "418px", margin: "25px", overflowY: "auto"}}>
            <div>
                {dataExists &&
                <BootstrapTable className="table-sm" data={props.tableData} striped hover>
                    <TableHeaderColumn isKey dataField='label' dataFormat={formatDataCell}>Element</TableHeaderColumn>
                    <TableHeaderColumn dataField='value_100g'
                                       dataFormat={formatDataCell}>{applicationStrings.label_per_100g[language.language]}</TableHeaderColumn>
                    <TableHeaderColumn dataField='value_portion'
                                       dataFormat={formatDataCell}>{labelPortion}</TableHeaderColumn>
                </BootstrapTable>
                }
                {!dataExists &&
                <div className="text-center">{applicationStrings.label_noData[language.language]}</div>
                }
            </div>
            <div style={{paddingTop: "25px"}}>
                <button className={"btn btn-link"} onClick={changeToChartMode}>Zur Diagrammansicht wechseln</button>
            </div>
        </div>
    );
}