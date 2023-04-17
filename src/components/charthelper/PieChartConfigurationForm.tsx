import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {CHART_TYPE_BAR, CHART_TYPE_PIE} from "../../config/Constants";
import {Form} from 'react-bootstrap';
import {PieChartConfigurationProps} from "../../types/livedata/ChartPropsData";
import {isMobileDevice} from "../../service/WindowDimension";

export function PieChartConfigurationForm(props: PieChartConfigurationProps) {
    const languageContext = useContext(LanguageContext)

    const legendLabel = isMobileDevice()
        ? applicationStrings.checkbox_chartoption_showLegend_m[languageContext.language]
        : applicationStrings.checkbox_chartoption_showLegend[languageContext.language]

    const detailsLabel = isMobileDevice()
        ? applicationStrings.checkbox_chartoption_showDetails_m[languageContext.language]
        : applicationStrings.checkbox_chartoption_showDetails[languageContext.language]

    return (
        <div className="container">
            <div className="row">
                <form className="form-inline form-group">
                    <Form.Label className="form-elements">
                        <b>{applicationStrings.label_charttype[languageContext.language]}:</b>
                    </Form.Label>
                    <Form.Check inline={true}
                                className="form-radiobutton"
                                label={applicationStrings.label_charttype_pie[languageContext.language]}
                                type="radio"
                                value={CHART_TYPE_PIE}
                                checked={props.chartType === CHART_TYPE_PIE}
                                onChange={props.handleRadioButtonClick}>
                    </Form.Check>
                    <Form.Check inline={true}
                                className="form-radiobutton form-horizontal-separation"
                                label={applicationStrings.label_charttype_bar[languageContext.language]}
                                type="radio"
                                value={CHART_TYPE_BAR}
                                checked={props.chartType === CHART_TYPE_BAR}
                                onChange={props.handleRadioButtonClick}>
                    </Form.Check>
                    <Form.Check inline={true}
                                className="form-radiobutton"
                                label={legendLabel}
                                defaultChecked={props.showLegend}
                                disabled={props.chartType === CHART_TYPE_BAR}
                                onClick={props.handleLegendCheckboxClick}>
                    </Form.Check>
                    {props.detailsCheckboxAvailable &&
                    <Form.Check inline={true}
                                className="form-radiobutton"
                                label={detailsLabel}
                                defaultChecked={props.showDetails}
                                onClick={props.handleDetailsCheckboxClick}>
                    </Form.Check>
                    }
                </form>
            </div>
        </div>
    )
}