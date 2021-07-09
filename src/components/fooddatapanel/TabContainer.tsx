import React, {useContext} from "react";
import CloseableTabs from 'react-closeable-tabs';
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";

interface TabContainerProps {
    onTabChange: (id: number) => void
    indexToSet: number
}

// Origin: Vinus Online
export default function TabContainer(props: TabContainerProps) {
    const applicationData = useContext(ApplicationDataContextStore)

    const style = {
        buttonTab: {
            border: "border border-secondary",
            background: "none",
            display: "inline-flex",
            verticalAlign: "middle",
            minHeight: "30px",
            alignItems: "center",
            cursor: "pointer",
            marginTop: "-12px",
            borderBottom: "2px solid transparent"
        }
    }

    if(applicationData?.debug) {
        console.log('TabContainer: Render, food panel data = ', applicationData.applicationData.foodDataPanel.selectedFoodItems)
    }

    if (!applicationData || !applicationData.applicationData.foodDataPanel.selectedFoodItems) {
        return <div/>
    }

    return (
        <div>
            <CloseableTabs
                data={applicationData.applicationData.foodDataPanel.selectedFoodItems}
                tabPanelClass="tab-panel"
                tabContentClass="tab-content mainPanel"
                style={style}
                onTabClick={(id) => props.onTabChange(id)}
                activeIndex={applicationData.applicationData.foodDataPanel.selectedFoodItemIndex}
            />
        </div>
    )
}