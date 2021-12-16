import {Button, ButtonGroup} from "react-bootstrap";
import {
    TAB_BASE_DATA,
    TAB_CARBS_DATA,
    TAB_ENERGY_DATA,
    TAB_INFO,
    TAB_LIPIDS_DATA,
    TAB_MINERAL_DATA,
    TAB_PROTEINS_DATA,
    TAB_VITAMIN_DATA
} from "../../config/Constants";
import {applicationStrings} from "../../static/labels";
import {useContext} from "react";
import {LanguageContext} from "../../contexts/LangContext";

interface ChartMenuPanelProps {
    dataPage: string
    setDataPage: (id: string) => void
    verticalArrangement: boolean
}

export function ChartMenuPanel(props: ChartMenuPanelProps) {
    const languageContext = useContext(LanguageContext)

    const handlePageButtonClick = (value: string) => {
        props.setDataPage(value)
    }

    const variant = "link"

    const makeButtonLabel = (buttonText): JSX.Element => {
        const classNameSpan = props.verticalArrangement ? "float-start" : ""
        return <span className={classNameSpan}>{buttonText}</span>
    }

    const rowClass = props.verticalArrangement ? "d-flex" : "d-flex flex-row flex-wrap"

    return (
        <div>
            <ButtonGroup className={rowClass} vertical={props.verticalArrangement}>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_BASE_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_BASE_DATA}>
                    {makeButtonLabel(applicationStrings.label_overview[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_ENERGY_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_ENERGY_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_energy[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_VITAMIN_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_VITAMIN_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_vit[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_MINERAL_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_MINERAL_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_min[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_LIPIDS_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_LIPIDS_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_lipids[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_CARBS_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_CARBS_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_carbohydrates[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_PROTEINS_DATA)}
                        variant={variant}
                        active={props.dataPage === TAB_PROTEINS_DATA}>
                    {makeButtonLabel(applicationStrings.label_nutrient_proteins[languageContext.language])}
                </Button>
                <Button className="btn sidebar-link"
                        onClick={() => handlePageButtonClick(TAB_INFO)}
                        variant={variant}
                        active={props.dataPage === TAB_INFO}>
                    {makeButtonLabel(applicationStrings.label_info[languageContext.language])}
                </Button>
            </ButtonGroup>
        </div>
    );

}