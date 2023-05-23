import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";
import {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {LanguageContext} from "../../contexts/LangContext";
import FoodDataPageHeader from "./FoodDataPageHeader";
import {FoodTableDataObject} from "../../types/livedata/SelectedFoodItemData";
import {
    SOURCE_SRLEGACY,
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
    createVitaminTable, TableCalculationParams
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

    const [tableData, setTableData] = useState<Array<FoodTableDataObject>>([])

    const updatePage = () => {   // Central update method when any (radio) button was clicked
        let tableDataList: Array<FoodTableDataObject> = [];
        const {portion} = props.selectedFoodItem

        const preferredSource = applicationContext ? applicationContext.applicationData.preferredSource : SOURCE_SRLEGACY
        const dietaryRequirement = applicationContext?.foodDataCorpus.dietaryRequirements ?? undefined
        const userData = applicationContext?.userData

        const tableCalculationParams: TableCalculationParams = {
            selectedFoodItem: props.selectedFoodItem,
            portion: portion.amount,
            language: language,
            preferredSource: preferredSource
        }

        const extendedParams = {...tableCalculationParams,
            dietaryRequirement: dietaryRequirement,
            userData: userData
        }

        if (selectedDataTab === TAB_BASE_DATA) {
            tableDataList = createBaseDataTable(tableCalculationParams);
        } else if (selectedDataTab === TAB_ENERGY_DATA) {
            tableDataList = createEnergyTable(tableCalculationParams);
        } else if (selectedDataTab === TAB_VITAMIN_DATA) {
            tableDataList = createVitaminTable(extendedParams);
        } else if (selectedDataTab === TAB_MINERAL_DATA) {
            tableDataList = createMineralTable(extendedParams);
        } else if (selectedDataTab === TAB_LIPIDS_DATA) {
            tableDataList = createLipidsTable(tableCalculationParams);
        } else if (selectedDataTab === TAB_CARBS_DATA) {
            tableDataList = createCarbsTable(tableCalculationParams);
        } else if (selectedDataTab === TAB_PROTEINS_DATA) {
            tableDataList = createProteinTable(extendedParams);
        }

        setTableData(tableDataList)
    }

    useEffect(() => {
            updatePage()
        }, [props.selectedFoodItem,
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
        updatePage()
    }

    const onDisplayModeChange = (newMode: string) => {
        applicationContext.setFoodDataPanelData.setSelectedDisplayMode(newMode)
        updatePage()
    }

    if (applicationContext.debug) {
        console.log('FoodDataPage: Render, tabledata = ', tableData)
    }

    return <div>
        <FoodDataPageHeader setDisplayMode={onDisplayModeChange}
                            setDataPage={onNewDataPage}
                            selectedFoodItem={props.selectedFoodItem}
                            tableData={tableData}
        />
    </div>

}