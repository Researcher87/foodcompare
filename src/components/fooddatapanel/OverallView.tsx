import React, {useContext, useEffect, useRef, useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {customSelectStyles} from "../../config/UI_Config";
import {getElementsOfRankingGroup, getNutrientGroups, getValueOfFoodItem} from "../../service/RankingService";
import ReactSelectOption from "../../types/ReactSelectOption";
import Select from 'react-select';
import {
    HIGHLIGHTING_MIN_MAX,
    HIGHLIGHTING_NONE, HIGHLIGHTING_SHARE_ALL, HIGHLIGHTING_SHARE_SELECTION, NUTRIENT_VITAMIN_INDEX,
} from "../../config/Constants";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";
import {getFoodItemName} from "../../service/nutrientdata/FoodItemsService";
import {calculatePortionData} from "../../service/TableService";
import {autoRound} from "../../service/calculation/MathService";
import {getUnit} from "../../service/calculation/NutrientCalculationService";
import {getStatisticalNutrientInformation} from "../../service/nutrientdata/NutrientStatisticsService";
import {shortenName} from "../../service/nutrientdata/NameTypeService";
import getName from "../../service/LanguageService";
import {FaQuestionCircle} from "react-icons/fa";
import {HelpModal} from "../HelpModal";
import {getHelpText} from "../../service/HelpService";

const WEIGHT_PORTION = 0
const WEIGHT_100 = 1

const TABLE_CELL_PADDING = "0.75ch"

const COLOR_MIN = "rgb(255, 200, 200)"
const COLOR_MAX = "rgb(255, 0, 0)"
const COLOR_EMPTY = "#fff"

/**
 * Calculates the color linearly between the minimum and maximum value. This function is used if only a few
 * items are compared with each other (i.e. the mode 'compare to tabs in data panel'), since otherwise outliers
 * could totally distort the color scheme (like values 1, 1, 2, 5, 40).
 */
const getColorCodeForMinMaxRange = (min: number | null, max: number | null, value: number) => {
    if (min === null || max === null || !value) {
        return COLOR_EMPTY
    }

    const rgbStep = (max - min) / 256
    let redValue = 255 - ((value - min) / rgbStep)
    let greenValue = 127 + (redValue / 2)

    if (redValue < 0) {
        redValue = 0
    }
    if (greenValue > 255) {
        greenValue = 255
    }
    return `rgb(${redValue}, ${greenValue}, 255)`;
}

/**
 * Calculates the color linearly based on the sorted list of all values. In this case, the higher the position
 * of the value is in the sorted list, the darker the color would be. This approach is rather stable against
 * outliers and deviating medians or averages. It is used to calculate the colors in the mode of comparing the
 * value to the whole Food Compare database, where we often have a min of 0 and a max of 100, but a median like 2.
 */
const getColorCodeForFoodCompareRange = (sortedValues: Array<number>, value: number) => {
    if (sortedValues.length <= 2 || !value) {
        return COLOR_EMPTY
    }

    const index = sortedValues.findIndex(val => val === value);
    const position = index / sortedValues.length

    let redValue = 255 - (position * 255);
    let greenValue = 127 + (redValue / 2);
    if (redValue < 0) {
        redValue = 0
    }
    if (greenValue > 255) {
        greenValue = 255
    }

    return `rgb(${redValue}, ${greenValue}, 255)`;
}


export const OverallView = (props) => {
    const applicationContext = useContext(ApplicationDataContextStore)
    const {language} = useContext(LanguageContext)

    const nutrientGroups = getNutrientGroups(language)
    let highlighters: Array<ReactSelectOption> = [
        {value: HIGHLIGHTING_NONE, label: applicationStrings.label_highlighting_none[language]},
        {value: HIGHLIGHTING_MIN_MAX, label: applicationStrings.label_highlighting_minmax[language]},
    ]

    const weightReferences = [
        {value: WEIGHT_PORTION, label: applicationStrings.label_per_portion[language]},
        {value: WEIGHT_100, label: applicationStrings.label_per_100g[language]}
    ]

    const [selectedGroup, setSelectedGroup] = useState<ReactSelectOption>(nutrientGroups[0])
    const [selectedHighlighter, setSelectedHighlighter] = useState<ReactSelectOption | null>(null)
    const [selectedWeightReference, setSelectedWeightReference] = useState<ReactSelectOption>(weightReferences[0])

    const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
    const [showToolTips, setShowToolTips] = useState<boolean>(true)

    // Canvas for drawing legend
    const canvas = useRef<HTMLCanvasElement | null>(null);

    // Draw color highlighting legend
    useEffect(() => {
        const canvasElement = canvas.current;
        if (canvasElement) {
            canvasElement.width = canvasElement.clientWidth;
            canvasElement.height = canvasElement.clientHeight;

            const startPointX = 50
            const ctx = canvasElement.getContext("2d");
            if (ctx) {
                const grd = ctx.createLinearGradient(0, 0, 200, 0);
                grd.addColorStop(0, getColorCodeForMinMaxRange(0, 255, 0));
                grd.addColorStop(1, getColorCodeForMinMaxRange(0, 255, 255));
                ctx.fillStyle = grd;
                ctx.fillRect(50, 35, 255, 30);
                ctx.strokeStyle = "#000";
                ctx.strokeText("Min", startPointX - 5, 80);
                ctx.strokeText("Max", startPointX + 240, 80);
                if (selectedHighlighter && selectedHighlighter.value === HIGHLIGHTING_SHARE_SELECTION) {
                    const offset = language === "de" ? 115 : 110
                    ctx.strokeText(applicationStrings.label_juxtaposition_table_avg[language], startPointX + offset, 80);
                } else {
                    ctx.strokeText(applicationStrings.label_juxtaposition_table_median[language], startPointX + 115, 80);
                }
            }
        }
    }, [selectedHighlighter]);

    useEffect(() => {
        if (selectedHighlighter === null) {
            // @ts-ignore
            if (applicationContext?.applicationData.foodDataPanel.selectedFoodItems.length > 3) {
                setSelectedHighlighter(highlighters[HIGHLIGHTING_SHARE_SELECTION])
            } else {
                setSelectedHighlighter(highlighters[HIGHLIGHTING_MIN_MAX])
            }
        }
    }, [])

    if (!applicationContext) {
        return <div/>
    }

    const foodItems = applicationContext.applicationData.foodDataPanel.selectedFoodItems


    const buildHighlightSelectOptions = () => {
        // Range coloring is only reasonable for at least 3 selected foods
        if (foodItems.length > 2) {
            highlighters.push({
                value: HIGHLIGHTING_SHARE_SELECTION,
                label: applicationStrings.label_highlighting_share_selection[language]
            })
        }

        // Range coloring compared to FC database is only possible if a 100 g basis is selected
        if (selectedWeightReference.value === WEIGHT_100) {
            highlighters.push({
                value: HIGHLIGHTING_SHARE_ALL,
                label: applicationStrings.label_highlighting_share_database[language]
            })
        } else {
            highlighters = highlighters.filter(highlighter => highlighter.value !== HIGHLIGHTING_SHARE_ALL)
            if (selectedHighlighter && selectedHighlighter.value === HIGHLIGHTING_SHARE_ALL) {
                const altOption = highlighters.find(highlighter => highlighter.value === HIGHLIGHTING_SHARE_SELECTION)
                setSelectedHighlighter(altOption!!)
            }
        }
    }

    buildHighlightSelectOptions()

    const handleGroupChange = (selectedOption) => {
        setSelectedGroup(selectedOption)
    }

    const handleHighlighterChange = (selectedOption) => {
        setSelectedHighlighter(selectedOption)
    }

    const handleWeightReferenceChange = (selectedOption) => {
        setSelectedWeightReference(selectedOption)
    }

    const makeFormHeader = () => {
        return <div className={"d-flex flex-row justify-content-between"}>
            <div style={{width: "25%"}}>
                <span className={"form-label"}>{applicationStrings.label_group[language]}:</span>
                <Select className="form-control-sm"
                        options={nutrientGroups}
                        value={selectedGroup}
                        styles={customSelectStyles}
                        onChange={handleGroupChange}
                />
            </div>
            <div style={{width: "15%"}}>
                <span className={"form-label"}>{applicationStrings.label_reference[language]}:</span>
                <Select className="form-control-sm"
                        options={weightReferences}
                        value={selectedWeightReference}
                        styles={customSelectStyles}
                        onChange={handleWeightReferenceChange}
                />
            </div>
            <div style={{width: "55%"}}>
                <span className={"form-label"}>{applicationStrings.label_highlighting[language]}:</span>
                <Select className="form-control-sm"
                        options={highlighters}
                        value={selectedHighlighter}
                        styles={customSelectStyles}
                        onChange={handleHighlighterChange}
                />
            </div>
        </div>
    }

    const makeTableHead = () => {
        const thStyle = {padding: TABLE_CELL_PADDING}

        return (
            <thead>
            <tr>
                <th/>
                <th/>
                {
                    foodItems.map(foodItem => {
                        const foodName = foodItem.aggregated
                            ? foodItem.title
                            : getFoodItemName(foodItem.foodItem, applicationContext.foodDataCorpus.foodNames, language)
                        const shortenedFoodName = shortenName(foodName, 15)
                        const portion = selectedWeightReference.value === WEIGHT_100
                            ? "100 g"
                            : `${foodItem.portion.amount} g`
                        const conditionId = foodItem.foodItem.conditionId
                        const condition = applicationContext.foodDataCorpus.conditions.find(
                            condition => condition.id === conditionId
                        )
                        const conditionName = condition ? getName(condition, language) : null;
                        return (
                            <th key={`tab-head-${foodItem.id}`}
                                style={{padding: TABLE_CELL_PADDING}}
                                className={"toolTipTableCell"}>
                                {shortenedFoodName}
                                <span style={{fontSize: "0.9rem", fontWeight: "normal"}}>
                                    <br/>
                                    <span style={{fontStyle: "italic"}}>
                                        {conditionName}
                                    </span>
                                    <br/>
                                    {portion}
                                    </span>
                                {showToolTips &&
                                <span className={"toolTipCellContentHeader"}>
                                    {foodName}
                                    <br/>
                                    {conditionName}
                                    <br/>
                                    {portion}
                                    </span>
                                }
                            </th>
                        )
                    })
                }
                <th style={thStyle}/>
                <th style={thStyle}>{applicationStrings.label_overallview_min_short[language]}</th>
                <th style={thStyle}>{applicationStrings.label_overallview_max_short[language]}</th>
                <th style={thStyle}>{applicationStrings.label_overallview_avg_short[language]}</th>
                <th style={thStyle}>{applicationStrings.label_overallview_sum[language]}</th>
            </tr>
            </thead>
        )
    }

    const makeTableBody = () => {
        const elements = getElementsOfRankingGroup(selectedGroup.value, language)
        if (!elements) {
            return <tbody/>
        }

        const aggregatedColumnStyle = {
            minWidth: "3vw",
            background: "#ffe6e6",
            padding: TABLE_CELL_PADDING
        }

        return (
            <tbody>
            {
                elements.map(element => {
                    let min: number | null = null;
                    let max: number | null = null;
                    let sum: number | null = null;

                    const foodItemValues = foodItems.map(foodItem => {
                        let value = getValueOfFoodItem(foodItem.foodItem, element.value, foodItem.selectedSource)
                        const portion = foodItem.portion.amount
                        if (selectedWeightReference.value === WEIGHT_PORTION) {
                            value = calculatePortionData(value, portion)
                        }

                        if (value !== null) {
                            if (min === null || value < min) {
                                min = value
                            }
                            if (max === null || value > max) {
                                max = value
                            }
                            if (sum === null) {
                                sum = value
                            } else {
                                sum += value
                            }
                        }
                        return value
                    })

                    const avg = sum
                        ? sum / foodItemValues.length
                        : null

                    const nutrientStatData = getStatisticalNutrientInformation(
                        element.value,
                        applicationContext.foodDataCorpus.foodItems,
                        applicationContext.applicationData.preferredSource
                    )

                    const getCellColor = (value) => {
                        let bgColor = COLOR_EMPTY

                        const colorSelection = selectedHighlighter ? selectedHighlighter.value : HIGHLIGHTING_NONE

                        if (colorSelection === HIGHLIGHTING_MIN_MAX) {
                            if (value === min) {
                                bgColor = COLOR_MIN
                            } else if (value === max) {
                                bgColor = COLOR_MAX
                            }
                        } else if (colorSelection === HIGHLIGHTING_SHARE_SELECTION) {
                            if (max === null || min === null || value === null) {
                                bgColor = COLOR_EMPTY
                            } else {
                                bgColor = getColorCodeForMinMaxRange(min, max, value)
                            }
                        } else if (colorSelection === HIGHLIGHTING_SHARE_ALL) {
                            if (value === null) {
                                bgColor = COLOR_EMPTY
                            } else {
                                if (nutrientStatData.allValuesSorted.length > 2) {
                                    bgColor = getColorCodeForFoodCompareRange(nutrientStatData.allValuesSorted, value)
                                }
                            }
                        }
                        return bgColor
                    }

                    let nutrientName = element.label

                    // Remove the scientific name from the vitamin labels
                    if (selectedGroup.value === NUTRIENT_VITAMIN_INDEX && nutrientName.includes("(")) {
                        nutrientName = nutrientName.substring(0, nutrientName.indexOf("(") - 1).trim()
                    }

                    const unit = getUnit(element.value);

                    const makeToolTipLine = (value) => {
                        return <span><b>{nutrientName}: </b>{value} {unit}</span>
                    }

                    const makeAggegrationCell = (value) => {
                        return <td style={aggregatedColumnStyle}
                                   className={"toolTipTableCell"}>
                            {value !== null ? autoRound(value) : ""}
                            {showToolTips &&
                            <span className={"toolTipCellContentTable"} style={{left: "-14.5vw"}}>
                                {makeToolTipLine(
                                    value !== null ? autoRound(value) : applicationStrings.label_na[language]
                                )}
                            </span>
                            }
                        </td>
                    }

                    return <tr key={`tab-cont-tr-${element.value}`}>
                        <td style={{minWidth: "8vw", padding: TABLE_CELL_PADDING}}>{nutrientName}</td>
                        <td style={{minWidth: "3.5vw", padding: TABLE_CELL_PADDING}}>{unit}</td>
                        {foodItemValues.map((value, index) => {
                            const tdStyle = {
                                minWidth: "8vw",
                                padding: TABLE_CELL_PADDING,
                                background: getCellColor(value)
                            }
                            const valueTable = value !== null ? autoRound(value) : ""
                            const valueToolTip = value !== null ? valueTable : applicationStrings.label_na[language]
                            return <td className={"toolTipTableCell"}
                                       key={`tab-cont-${element.value}-${index}`}
                                       style={tdStyle}>
                                {valueTable}
                                {showToolTips &&
                                <span className={"toolTipCellContentTable"}
                                      style={{top: selectedWeightReference.value === WEIGHT_100 ? "-8vh" : "-2.5vh"}}>
                                    {makeToolTipLine(valueToolTip)}
                                    {selectedWeightReference.value === WEIGHT_100 &&
                                    <span>
                                        <hr/>
                                        {applicationStrings.label_overallview_compared[language]}:
                                        <br/>
                                        <span className={"tooltipKeyWord"}>
                                            {applicationStrings.label_overallview_min[language]}:
                                        </span>
                                        {autoRound(nutrientStatData.minimumAmount)} {unit}
                                        <br/>
                                        <span className={"tooltipKeyWord"}>
                                            {applicationStrings.label_overallview_max[language]}:
                                        </span>
                                        {autoRound(nutrientStatData.maximumAmount)} {unit}
                                        <br/>
                                        <span className={"tooltipKeyWord"}>
                                            {applicationStrings.label_overallview_avg[language]}:
                                        </span>
                                        {autoRound(nutrientStatData.averageAmount)} {unit}
                                        <span className={"tooltipKeyWord"}>
                                            {applicationStrings.label_juxtaposition_table_median[language]}:
                                        </span>
                                        {autoRound(nutrientStatData.median)} {unit}
                                    </span>
                                    }
                                </span>
                                }
                            </td>
                        })
                        }
                        <td/>
                        {makeAggegrationCell(min)}
                        {makeAggegrationCell(max)}
                        {makeAggegrationCell(avg)}
                        {makeAggegrationCell(sum)}
                    </tr>
                })
            }
            </tbody>
        )
    }

    const makeTable = () => {
        return (
            <div className={"overallview-table"}>
                <table>
                    {makeTableHead()}
                    {makeTableBody()}
                </table>
                {makeColorLegend()}
            </div>
        )
    }

    const onOpenHelpModal = () => {
        setShowHelpModal(true)
    }

    const helpText = getHelpText(12, language)

    const selection = selectedHighlighter ? selectedHighlighter.value : HIGHLIGHTING_NONE
    const makeColorLegend = () => {
        const showCanvas = canvas && (selection === HIGHLIGHTING_SHARE_SELECTION || selection === HIGHLIGHTING_SHARE_ALL)
        return <div className={"d-flex flex-row justify-content-center"} style={{height: "110px"}}>
            {showCanvas &&
            <canvas ref={canvas} width={400} height={110} style={{border: "1x solid #000000"}}/>
            }
        </div>
    }

    return (
        <Modal size={'xl'}
               show={true}
               onHide={props.onHide}
               backdrop="static"
        >
            {showHelpModal && helpText &&
            <HelpModal helpText={helpText}
                       size={"lg"}
                       closeHelpModal={() => setShowHelpModal(false)}
            />
            }
            <Modal.Header>
                <h5 className="modal-title"><b>{applicationStrings.label_overallview_title[language]}</b></h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.onHide}>
                </button>
            </Modal.Header>
            <Modal.Body style={{minHeight: "75vh", maxHeight: "75vh", overflowY: "auto"}}>
                <div>
                    {makeFormHeader()}
                </div>
                <div className={"m-4"}>
                    {makeTable()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className={"d-flex flex-row justify-content-between w-100"}>
                    <div>
                        <Form.Check inline={true}
                                    className="form-radiobutton"
                                    label={applicationStrings.label_tooltips[language]}
                                    type="checkbox"
                                    checked={showToolTips}
                                    onChange={() => setShowToolTips(!showToolTips)}>
                        </Form.Check>
                    </div>
                    <div>
                        <Button className={"btn btn-primary"} onClick={onOpenHelpModal}>
                            <FaQuestionCircle/>
                        </Button>
                        <Button className={"btn-secondary form-button"} onClick={props.onHide}>
                            {applicationStrings.button_close[language]}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )

}