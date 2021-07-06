import {ReactElement} from "react";

interface CustomLegendProps {
    legendData: Array<any>
}

export function CustomLegend(props: CustomLegendProps) {

    const renderLegend = () => {
        let legend: Array<ReactElement> = [];

        for (let i = 0; i < props.legendData.length; i++) {
            const element = props.legendData[i];
            const indent = element.indent > 0 ? "25px" : "0px";
            const verticalSpace = element.separateNextElement ? "15px" : "0px";
            const id = `legendrow ${i}`;

            legend.push(
                <div key={id} className="row" style={{marginLeft: indent, marginBottom: verticalSpace}}>
                    <div style={{display: "flex"}}>
                        <div className="legendItem" style={{background: element.color}}></div>
                        <p style={{marginTop: "-3px"}}>{element.item}</p>
                    </div>
                </div>
            );
        }

        return legend;
    }


    return (
        <div className={"form-main"} style={{borderLeft: "1px solid #aaaaaa", paddingLeft: "5px"}}>
            <div style={{paddingTop: "4px"}}>
                {renderLegend()}
            </div>
        </div>
    )


}