import {JuxtapositionChartProps} from "../../../types/livedata/ChartPropsData";
import {applicationStrings} from "../../../static/labels";
import {isMobileDevice} from "../../../service/WindowDimension";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../../contexts/LangContext";
import {JuxtapositionTableEntry} from "../../../types/livedata/JuxtapositionTableEntry";
import {
    createChartDataForJuxtapostionChart, createJuxtapositionTableData,
    getFoodItemsForComparison, JuxtapostionChartData
} from "../../../service/chartdata/JuxtapositionDataService";

export function JuxtapositionTable(props: JuxtapositionChartProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const language = useContext(LanguageContext).language

    if (applicationContext === null) {
        throw new Error("Application context is unavailable.")
    }

    const [tableData, setTableData] = useState<Array<JuxtapositionTableEntry>>([])

    useEffect(() => {
        updateTable()
    }, [applicationContext.applicationData.foodDataPanel.juxtapositionConfigData])

    const updateTable = () => {
        const selectedFoodItemsInPanel = applicationContext.applicationData.foodDataPanel.selectedFoodItems
        const foodDataCorpus = applicationContext.foodDataCorpus
        const {selectedReference, selectedFoodItem} = props
        const referenceData = getFoodItemsForComparison(selectedReference, foodDataCorpus, selectedFoodItem,
            selectedFoodItemsInPanel)

        const newTableData = createJuxtapositionTableData(props, foodDataCorpus, referenceData, language)
        setTableData(newTableData)
    }

    const dataExists = tableData.length > 0
    const tableClass = isMobileDevice() ? "table-style-m" : "table-style"

    return (
        <div>
            <div style={{height: "428px", margin: "12px"}}>
                <div>
                    {dataExists &&
                    <BootstrapTable trClassName={tableClass} data={tableData} striped hover>
                        <TableHeaderColumn isKey dataField='label' width={"220px"}>Element</TableHeaderColumn>
                        <TableHeaderColumn dataField='value'>{applicationStrings.label_juxtaposition_table_value[language]}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='rank'>
                            {applicationStrings.label_juxtaposition_table_rank[language]}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='min'>
                            {applicationStrings.label_juxtaposition_table_min[language]}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='max'>
                            {applicationStrings.label_juxtaposition_table_max[language]}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='average'>
                            {applicationStrings.label_juxtaposition_table_avg[language]}
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='median'>
                            {applicationStrings.label_juxtaposition_table_median[language]}
                        </TableHeaderColumn>
                    </BootstrapTable>
                    }
                    {!dataExists &&
                    <div className="text-center">{applicationStrings.label_noData[language]}</div>
                    }
                </div>
            </div>
        </div>
    )
}