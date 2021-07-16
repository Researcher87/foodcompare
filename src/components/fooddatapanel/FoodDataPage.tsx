import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodDataPageHeader from "./FoodDataPageHeader";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {
    DISPLAYMODE_CHART,
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {
    createBaseDataTable,
    createCarbsTable,
    createEnergyTable,
    createLipidsTable,
    createMineralTable,
    createProteinTable,
    createVitaminTable
} from "../../service/TableService";

interface FoodDataPageProps {
    selectedFoodItem: SelectedFoodItem
}

export default function FoodDataPage(props: FoodDataPageProps) {
    const applicationData = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const initialDataPage = applicationData?.applicationData.foodDataPanel.selectedDataPage
        ? applicationData.applicationData.foodDataPanel.selectedDataPage
        : TAB_BASE_DATA

    const [displayMode, setDisplayMode] = useState<string>(DISPLAYMODE_CHART)
    const [selectedDataTab, setSelectedDataTab] = useState<string>(initialDataPage)
    const [tableData, setTableData] = useState<Array<FoodTableDataObject>>([])

    useEffect(() => {
        updatePage()
    }, [displayMode, selectedDataTab, props.selectedFoodItem])

    if (!applicationData) {
        return <div/>
    }

    const onNewDataPage = (datapage: string) => {
        setSelectedDataTab(datapage)
        applicationData.applicationData.foodDataPanel.setSelectedDataPage(datapage)
        updatePage()
    }

    const onDisplayModeChange = (newMode: string) => {
        setDisplayMode(newMode)
        updatePage()
    }

    const updatePage = () => {   // Central update method when any (radio) button was clicked
        let tableDataList: Array<FoodTableDataObject> = [];
        const {foodItem, portion} = props.selectedFoodItem

        if (selectedDataTab === TAB_BASE_DATA) {
            tableDataList = createBaseDataTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_ENERGY_DATA) {
            tableDataList = createEnergyTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_VITAMIN_DATA) {
            tableDataList = createVitaminTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_MINERAL_DATA) {
            tableDataList = createMineralTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_LIPIDS_DATA) {
            tableDataList = createLipidsTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_CARBS_DATA) {
            tableDataList = createCarbsTable(foodItem, portion.amount, language);
        } else if (selectedDataTab === TAB_PROTEINS_DATA) {
            tableDataList = createProteinTable(foodItem, portion.amount, language);
        }

        setTableData(tableDataList)
    }

    if (applicationData.debug) {
        console.log('FoodDataPage: Render, tabledata = ', tableData)
    }

    return <div>
        <FoodDataPageHeader displayMode={displayMode}
                            setDisplayMode={onDisplayModeChange}
                            dataPage={selectedDataTab}
                            setDataPage={onNewDataPage}
                            selectedFoodItem={props.selectedFoodItem}
                            tableData={tableData}
                            selectedDataTab={selectedDataTab}
        />
    </div>

}