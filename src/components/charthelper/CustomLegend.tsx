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
            const indent = element.indent > 0 ? "25px" : "0px";
            const verticalSpace = element.separateNextElement && !mobile ? "15px" : "0px";
            const id = `legendrow ${i}`;

            const legendItemLabelClass = mobile ? "legendItemLabel-mobile" : "legendItemLabel"
            const legendClassName = isMobileDevice() ? "align-items-baseline" : "align-items-middle"

            legend.push(
                <div key={id} className="row" style={{marginLeft: indent, marginBottom: verticalSpace}}>
                    <div style={{display: "flex"}} className={legendClassName}>
                        <div className="legendItem" style={{background: element.color}}></div>
                        <p className={legendItemLabelClass}>{element.item}</p>
                    </div>
                </div>
            );
        }

        return legend;
    }


    return (
        <div style={{borderLeft: "1px solid #aaaaaa", paddingLeft: "5px"}}>
            <div style={{paddingTop: "4px"}}>
                {renderLegend()}
            </div>
        </div>
    )


}