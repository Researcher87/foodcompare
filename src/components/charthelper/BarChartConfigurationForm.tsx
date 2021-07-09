import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {Form} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {AMOUNT_PORTION, GRAM} from "../../config/Constants";
import SelectedFoodItem from "../../types/livedata/SelectedFoodItem";

interface BarChartConfigurationProps {
    selectedFoodItem?: SelectedFoodItem
    portionType: string
    expand100: boolean
    synchronize?: boolean
    handleRadioButtonClick: (event: any) => void
    handleExpandCheckboxClick: (event: any) => void
    handleSynchronize?: () => void
}

export function BarChartConfigurationForm(props: BarChartConfigurationProps) {
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const label_portion = props.selectedFoodItem
        ?`${applicationStrings.label_portion[lang]} (${props.selectedFoodItem.portion.amount} g)`
        : applicationStrings.label_portion[lang]

    return (
        <div className="container-fluid form-main">
            <div className="row foodDataPageHeader">
                <form className="form-inline form-group">
                    <Form.Label className={"form-elements"}>
                        <b>{applicationStrings.label_reference[lang]}:</b>
                    </Form.Label>
                    <Form.Check type="radio"
                                inline={true}
                                label={"100g"}
                                value={GRAM}
                                checked={(props.portionType === GRAM)}
                                onChange={props.handleRadioButtonClick}
                    />
                    <Form.Check type="radio"
                                inline={true}
                                style={{paddingRight: "48px"}}
                                label={label_portion}
                                value={AMOUNT_PORTION}
                                checked={props.portionType === AMOUNT_PORTION}
                                onChange={props.handleRadioButtonClick}
                    />
                    <Form.Check className="form-radiobutton"
                                inline={true}
                                label={applicationStrings.checkbox_expand100g[lang]}
                                checked={props.expand100}
                                onChange={props.handleExpandCheckboxClick}>
                    </Form.Check>
                    {props.handleSynchronize !== undefined && props.synchronize !== undefined &&
                    < Form.Check className="form-radiobutton"
                        inline={true}
                        label={applicationStrings.checkbox_synchronize[lang]}
                        checked={props.synchronize}
                        onChange={props.handleSynchronize}>
                        </Form.Check>
                    }
                </form>
            </div>
        </div>
    )

}