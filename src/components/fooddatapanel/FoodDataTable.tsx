import FoodItem from "../../types/nutrientdata/FoodItem";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {minimal_table_height} from "../../config/ChartConfig";
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {defaultPanelHeight} from "../../config/ApplicationSetting";

interface FoodDataTableProps {
    tableData: Array<FoodTableDataObject>
}

export function FoodDataTable(props: FoodDataTableProps) {
    const dataExists = props.tableData && props.tableData.length > 0;
    const language = useContext(LanguageContext)

    return(
        <div style={{height: "418px", margin: "25px", overflowY: "auto" }}>
            {dataExists &&
            <BootstrapTable className="table-sm" data={props.tableData} striped hover>
                <TableHeaderColumn isKey dataField='label'>Element</TableHeaderColumn>
                <TableHeaderColumn dataField='value_100g'>per 100 g</TableHeaderColumn>
                <TableHeaderColumn dataField='value_portion'>per Portion</TableHeaderColumn>
            </BootstrapTable>
            }
            {!dataExists &&
            <div className="text-center">{applicationStrings.label_noData[language.language]}</div>
            }
        </div>
    );
}