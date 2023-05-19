import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {DISPLAYMODE_CHART, DISPLAYMODE_TABLE, TAB_INFO} from "../../config/Constants";
import {ChartPanel} from "./ChartPanel";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {FoodDataTable} from "./FoodDataTable";
import {InfoData} from "./charts/InfoData";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {calculateMinimalDataPanelWidth} from "../../service/ChartSizeCalculation";

interface FoodDataPageBodyProps {
    tableData: Array<FoodTableDataObject>
    selectedFoodItem: SelectedFoodItem,
    dataPage: string
}

export default function FoodDataPageBody(props: FoodDataPageBodyProps) {
    const applicationContext = useContext(ApplicationDataContextStore)

    if(!applicationContext) {
        return <div/>
    }

    const {displayMode, selectedDataPage}  = applicationContext.applicationData.foodDataPanel

    const renderDataPage = () => {
        return (
            <div>
                {displayMode === DISPLAYMODE_TABLE &&
                <div className="col">
                    <FoodDataTable tableData={props.tableData}
                                   portionSize={props.selectedFoodItem.portion.amount}
                                   dataPage={props.dataPage}
                    />
                </div>
                }
                {displayMode === DISPLAYMODE_CHART &&
                <div className="col">
                    <ChartPanel selectedFoodItem={props.selectedFoodItem} />
                </div>
                }
            </div>
        );
    }

    return (
        <div style={{maxWidth: "1200px", minWidth: calculateMinimalDataPanelWidth()}}>
            {selectedDataPage === TAB_INFO &&
                 <InfoData selectedFoodItem={props.selectedFoodItem}/>
            }
            {selectedDataPage !== TAB_INFO &&
                renderDataPage()
            }
        </div>
    )

}