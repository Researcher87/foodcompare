import {ReactElement} from "react";
import {isMobileDevice} from "../../service/WindowDimension";

interface CustomLegendProps {
    legendData: Array<any>
}

export function CustomLegend(props: CustomLegendProps) {

    const renderLegend = () => {
        let legend: Array<ReactElement> = [];
        const mobile = isMobileDevice()

        for (let i = 0; i < props.legendData.length; i++) {
            const element = props.legendData[i];
            const indent = element.indent > 0 ? "2ch" : "0ch";
            const id = `legendrow ${i}`;

            const legendItemLabelClass = mobile ? "legend-item-label" : "legend-item-label"
            const legendClassName = isMobileDevice() ? "align-items-baseline" : "align-items-middle"

            legend.push(
                <div key={id} className="row" style={{marginLeft: indent}}>
                    <div style={{display: "flex", alignItems: "baseline"}} className={legendClassName}>
                        <div className="legend-item" style={{background: element.color}}></div>
                        <span className={legendItemLabelClass}>{element.item}</span>
                    </div>
                </div>
            );
        }

        return legend;
    }


    return (
        <div style={{borderLeft: "1px solid #aaaaaa"}}>
            <div>
                {renderLegend()}
            </div>
        </div>
    )


}