import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {DISPLAYMODE_TABLE, TAB_INFO, TAB_JUXTAPOSITION} from "../../config/Constants";
import {ChartPanel} from "./ChartPanel";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {FoodDataTable} from "./FoodDataTable";
import {InfoData} from "./charts/InfoData";
import {useContext} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";

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
            <div className="d-flex flex-column">
                {(displayMode === DISPLAYMODE_TABLE && selectedDataPage !== TAB_JUXTAPOSITION) ?
                <div >
                    <FoodDataTable tableData={props.tableData}
                                   portionSize={props.selectedFoodItem.portion.amount}
                                   dataPage={props.dataPage}
                    />
                </div>
                :
                <div>
                    <ChartPanel selectedFoodItem={props.selectedFoodItem} displayMode={displayMode} />
                </div>
                }
            </div>
        );
    }

    return (
        <div className={"food-analyzer-chartpanel"}>
            {selectedDataPage === TAB_INFO &&
                 <InfoData selectedFoodItem={props.selectedFoodItem}/>
            }
            {selectedDataPage !== TAB_INFO &&
                renderDataPage()
            }
        </div>
    )

}