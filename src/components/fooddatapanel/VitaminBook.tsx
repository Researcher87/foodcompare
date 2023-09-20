import React, {ReactElement, useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../contexts/LangContext";
import {applicationStrings} from "../../static/labels";
import {BookDataEntry, NamePair} from "../../types/BookData";
import {TAB_MINERAL_DATA, TAB_PROTEINS_DATA, TAB_VITAMIN_DATA} from "../../config/Constants";
import {isSmallScreen, useWindowDimension} from "../../service/WindowDimension";
import {customSelectStyles} from "../../config/UI_Config";
import Select from 'react-select';
import ReactSelectOption from "../../types/ReactSelectOption";
import {Modal} from "react-bootstrap";

interface VitaminBookModalProps {
    selectedDataTab: string
    bookData: BookDataEntry[]
    closeBookModal: () => void,
    initiallySelectedItem?: string
}

export function VitaminsBook(props: VitaminBookModalProps): ReactElement {
    const languageContext = useContext(LanguageContext)

    const initialIndex = props.initiallySelectedItem === undefined
        ? 0
        : props.bookData.findIndex(entry => entry.name[languageContext.language].endsWith(props.initiallySelectedItem)) ?? 0

    const [selectedEntry, setSelectedEntry] = useState<BookDataEntry>(props.bookData[initialIndex])

    const handleEntryChange = (entry: ReactSelectOption) => {
        const selection = props.bookData[entry.value]
        setSelectedEntry(selection)
    }

    const windowSize = useWindowDimension()
    const selectClass = isSmallScreen(windowSize) ? "form-control-sm" : ""

    if (selectedEntry === null) {
        setSelectedEntry(props.bookData[0])
    }

    const selectList = props.bookData.map((entry, index) => {
        return {
            label: entry.name[languageContext.language],
            value: index
        }
    })

    const renderSelectList = () => {
        return (
            <div className={"form-section"} style={{width: "90%"}}>
                <Select className={selectClass}
                        options={selectList}
                        defaultValue={selectList[initialIndex]}
                        onChange={handleEntryChange}
                        styles={customSelectStyles}
                />
            </div>
        )
    }


    const renderItemList = (items: NamePair[]) => {
        return items.map(item => <li key={item[languageContext.language]}>{item[languageContext.language]}</li>)
    }

    const renderDailyRequirements = (dailyRequirementsText: string) => {
        if(!dailyRequirementsText.includes("|")) {
            return <p>{dailyRequirementsText}</p>
        } else {
            const parts = dailyRequirementsText.split("|");
            if(parts[0].includes(":") && parts[1].includes(":")) {
                const malePartsPrefix = parts[0].substring(0, parts[0].indexOf(":")).trim()
                const malePartsData = parts[0].substring(parts[0].indexOf(":")+1).trim()
                const femalePartsPrefix = parts[1].substring(0, parts[1].indexOf(":")).trim()
                const femalePartsData = parts[1].substring(parts[1].indexOf(":")+1).trim()
                return <span>
                    <p>
                        <span style={{display: "inline-block", minWidth: "8ch"}}><b>{malePartsPrefix}:</b></span>
                        {malePartsData}
                        <br/>
                        <span style={{display: "inline-block", minWidth: "8ch"}}><b>{femalePartsPrefix}:</b></span>
                        {femalePartsData}
                    </p>
                </span>
            } else {
                return <p>{dailyRequirementsText}</p>
            }
        }
    }

    const renderDataContent = () => {
        if (!selectedEntry) {
            return <div/>
        }

        const lang = languageContext.language
        const title = selectedEntry.name[lang]
        const scientificTitle = selectedEntry.scientificName !== undefined ? selectedEntry.scientificName[lang] : null

        const hasFunctionality = selectedEntry.functionality?.length > 0
        const hasDeficiencies = selectedEntry.deficiencies?.length > 0
        const hasOverdose = selectedEntry.overdose !== undefined && selectedEntry.overdose !== null
        const hasDependencies = selectedEntry.dependencies !== undefined && selectedEntry.dependencies !== null
        const hasSources = selectedEntry.sources !== undefined && selectedEntry.sources !== null
        const hasStorage = selectedEntry.storage !== undefined && selectedEntry.storage !== null

        const hasDailyRequirements = selectedEntry.requirements !== undefined && selectedEntry.requirements !== null

        return (
            <div style={{margin: "16px", height: "50vh"}}>
                <h4>
                    {title}
                    {scientificTitle !== null &&
                    <i style={{marginLeft: "12px"}}>{`(${scientificTitle})`}</i>
                    }
                </h4>
                <p>
                    {selectedEntry.description[lang]}
                </p>
                {hasFunctionality &&
                <div>
                    <h5>{applicationStrings.book_heading_functionality[lang]}</h5>
                    <ul>
                        {renderItemList(selectedEntry.functionality)}
                    </ul>
                </div>
                }
                {hasDeficiencies &&
                <div>
                    <h5>{applicationStrings.book_heading_deficiencies[lang]}</h5>
                    <ul>
                        {renderItemList(selectedEntry.deficiencies)}
                    </ul>
                </div>
                }
                {hasOverdose && selectedEntry.overdose &&
                <div>
                    <h5>{applicationStrings.book_heading_overdose[lang]}</h5>
                    <p>{selectedEntry.overdose[lang]}</p>
                </div>
                }
                {hasDependencies && selectedEntry.dependencies &&
                <div>
                    <h5>{applicationStrings.book_heading_dependencies[lang]}</h5>
                    <p>{selectedEntry.dependencies[lang]}</p>
                </div>
                }
                {hasStorage && selectedEntry.storage &&
                <div>
                    <h5>{applicationStrings.book_heading_storage[lang]}</h5>
                    <p>{selectedEntry.storage[lang]}</p>
                </div>
                }
                {hasSources && selectedEntry.sources &&
                <div>
                    <h5>{applicationStrings.book_heading_sources[lang]}</h5>
                    <p>{selectedEntry.sources[lang]}</p>
                </div>
                }
                {hasDailyRequirements &&
                <div>
                    <h5>{applicationStrings.book_heading_requirements[lang]}</h5>
                    {renderDailyRequirements(selectedEntry.requirements[lang])}
                </div>
                }
                <div className={"pb-5"}/>
                <hr/>
                <div>
                    <p style={{fontWeight: 100, fontSize: "0.9rem", textAlign: "center"}}>{applicationStrings.vitamin_book_disclaimer[lang]}</p>
                </div>
            </div>
        )
    }

    let title = null
    switch (props.selectedDataTab) {
        case TAB_VITAMIN_DATA:
            title = applicationStrings.book_vitamins[languageContext.language]
            break;
        case TAB_MINERAL_DATA:
            title = applicationStrings.book_minerals[languageContext.language]
            break;
        case TAB_PROTEINS_DATA:
            title = applicationStrings.book_proteins[languageContext.language]
            break;
    }

    return (
        <Modal size={'lg'} show={true}>
            <Modal.Header>
                <h5 className="modal-title"><b>{title}</b></h5>
                <button type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={props.closeBookModal}>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div style={{overflowY: "auto"}}>
                    {renderSelectList()}
                    {renderDataContent()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button"
                        className="btn btn-primary"
                        onClick={props.closeBookModal}>
                    {applicationStrings.button_close[languageContext.language]}
                </button>
            </Modal.Footer>
        </Modal>
    );

}