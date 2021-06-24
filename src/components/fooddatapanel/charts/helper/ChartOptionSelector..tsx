import {useContext} from "react";
import {LanguageContext} from "../../../../contexts/LangContext";
import {applicationStrings} from "../../../../static/labels";
import {CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../../../config/Constants";
import {Form, FormCheck} from 'react-bootstrap';

interface ChartProps {
    chartType: string
    showLegend: boolean
    showDetails?: boolean
    detailsCheckboxAvailable?: boolean
    handleRadioButtonClick: (event: any) => void
    handleLegendCheckboxClick: (event: any) => void
    handleDetailsCheckboxClick?: (event: any) => void
}

export function ChartOptionSelector(props: ChartProps) {
    const languageContext = useContext(LanguageContext)

    return (
        <div className="container" style={{paddingTop: "32px"}}>
            <div className="row">
                <form className="form-inline form-group">
                    <Form.Label className="form-elements">
                        <b>{applicationStrings.label_charttype[languageContext.language]}:</b>
                    </Form.Label>
                    <Form.Check inline={true}
                                label={applicationStrings.label_charttype_pie[languageContext.language]}
                                type="radio"
                                value={CHART_TYPE_PIE}
                                checked={props.chartType === CHART_TYPE_PIE}
                                onChange={props.handleRadioButtonClick}>
                    </Form.Check>
                    <Form.Check inline={true}
                                style={{paddingRight: "48px"}}
                                label={applicationStrings.label_charttype_bar[languageContext.language]}
                                type="radio"
                                value={CHART_TYPE_BAR}
                                checked={props.chartType === CHART_TYPE_BAR}
                                onChange={props.handleRadioButtonClick}>
                    </Form.Check>
                    <Form.Check inline={true}
                                label={applicationStrings.checkbox_chartoption_showLegend[languageContext.language]}
                                defaultChecked={props.showLegend}
                                disabled={props.chartType === CHART_TYPE_BAR}
                                onClick={props.handleLegendCheckboxClick}>
                    </Form.Check>
                    {props.detailsCheckboxAvailable &&
                    <Form.Check inline={true}
                                label={applicationStrings.checkbox_chartoption_showDetails[languageContext.language]}
                                defaultChecked={props.showDetails}
                                onClick={props.handleDetailsCheckboxClick}>
                    </Form.Check>
                    }
                </form>
            </div>
        </div>
    )
}