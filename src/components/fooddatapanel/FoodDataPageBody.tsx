import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {DISPLAYMODE_CHART, DISPLAYMODE_TABLE, TAB_INFO} from "../../config/Constants";
import {ChartPanel} from "./ChartPanel";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {FoodDataTable} from "./FoodDataTable";
import {InfoData} from "./charts/InfoData";

interface FoodDataPageBodyProps {
    tableData: Array<FoodTableDataObject>
    displayMode: string
    selectedDataTab: string
    selectedFoodItem: SelectedFoodItem
}

export default function FoodDataPageBody(props: FoodDataPageBodyProps) {

    const renderDataPage = () => {
        return (
            <div>
                {props.displayMode === DISPLAYMODE_TABLE &&
                <div className="col">
                    <FoodDataTable tableData={props.tableData}/>
                </div>
                }
                {props.displayMode === DISPLAYMODE_CHART &&
                <div className="col">
                    <ChartPanel selectedFoodItem={props.selectedFoodItem} selectedDataTab={props.selectedDataTab}/>
                </div>
                }
            </div>
        );
    }

    return (
        <div className={"form-main"} style={{maxWidth: "1200px", minWidth: "850px"}}>
            {props.selectedDataTab === TAB_INFO &&
            <InfoData selectedFoodItem={props.selectedFoodItem}/>
            }
            {props.selectedDataTab !== TAB_INFO &&
            renderDataPage()
            }
        </div>
    )

}