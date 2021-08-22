import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodDataPageHeader from "./FoodDataPageHeader";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {
    DISPLAYMODE_CHART, SOURCE_SRLEGACY,
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
    selectedFoodItem: SelectedFoodItem,
    dataPage?: string
}

export default function FoodDataPage(props: FoodDataPageProps) {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const selectedDataTab = applicationContext
        ? applicationContext.applicationData.foodDataPanel.selectedDataPage
        : TAB_BASE_DATA

    const selectedDisplayMode = applicationContext && applicationContext.applicationData.foodDataPanel.displayMode
        ? applicationContext.applicationData.foodDataPanel.displayMode
        : DISPLAYMODE_CHART

    const [displayMode, setDisplayMode] = useState<string>(selectedDisplayMode)
    const [tableData, setTableData] = useState<Array<FoodTableDataObject>>([])
    const [dataPage, setDataPage] = useState<string>(selectedDataTab)

    const updatePage = () => {   // Central update method when any (radio) button was clicked
        let tableDataList: Array<FoodTableDataObject> = [];
        const {portion} = props.selectedFoodItem

        const preferredSource = applicationContext ? applicationContext.applicationData.preferredSource : SOURCE_SRLEGACY

        if (selectedDataTab === TAB_BASE_DATA) {
            tableDataList = createBaseDataTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_ENERGY_DATA) {
            tableDataList = createEnergyTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_VITAMIN_DATA) {
            tableDataList = createVitaminTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_MINERAL_DATA) {
            tableDataList = createMineralTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_LIPIDS_DATA) {
            tableDataList = createLipidsTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_CARBS_DATA) {
            tableDataList = createCarbsTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        } else if (selectedDataTab === TAB_PROTEINS_DATA) {
            tableDataList = createProteinTable(props.selectedFoodItem, portion.amount, language, preferredSource);
        }

        setTableData(tableDataList)
    }

    useEffect(() => {
            updatePage()
        }, [displayMode,
            props.selectedFoodItem,
            applicationContext?.applicationData.preferredSource,
            applicationContext?.applicationData.foodDataPanel.selectedDataPage,
            applicationContext?.applicationData.foodDataPanel.displayMode,
            applicationContext?.userData]
    )

    if (!applicationContext) {
        return <div/>
    }

    const onNewDataPage = (datapage: string) => {
        applicationContext.setFoodDataPanelData.setSelectedDataPage(datapage)
        setDataPage(datapage)
        updatePage()
    }

    const onDisplayModeChange = (newMode: string) => {
        applicationContext.setFoodDataPanelData.setSelectedDisplayMode(newMode)
        setDisplayMode(newMode)
        updatePage()
    }

    if (applicationContext.debug) {
        console.log('FoodDataPage: Render, tabledata = ', tableData)
    }

    return <div>
        <FoodDataPageHeader displayMode={applicationContext.applicationData.foodDataPanel.displayMode}
                            setDisplayMode={onDisplayModeChange}
                            dataPage={dataPage}
                            setDataPage={onNewDataPage}
                            selectedFoodItem={props.selectedFoodItem}
                            tableData={tableData}
        />
    </div>

}