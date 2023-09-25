import React, {useContext} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {applicationStrings} from "../static/labels";

import homeText3 from "../static/hometext3.json";
import {LANGUAGE_DE, PATH_HOME} from "../config/Constants";
import {isMobileDevice} from "../service/WindowDimension";
import {FaAngleDoubleRight} from "react-icons/fa";
import {useHistory} from 'react-router-dom';

interface HomeTextElement {
    type: string
    de: string
    en: string
}

interface HomeTextParagraph {
    id: string,
    img: string,
    text: HomeTextElement[]
}

/**
 * Site displaying general information about food compare
 */
export function InfoContainer() {
    const {language} = useContext(LanguageContext)
    const history = useHistory()

    const introImages = require.context('../static/image/intro-screens', true);

    const renderTextElement = (textElement: HomeTextElement, index: number): JSX.Element => {
        const text = language === LANGUAGE_DE ? textElement.de : textElement.en

        switch (textElement.type) {
            case "paragraph":
                return <p key={`homeitem ${index}`}>{text}</p>
            case "subheading":
                return (
                    <div key={`homeitem ${index}`}>
                        <br/>
                        <h4>
                            {text}
                        </h4>
                        <hr/>
                    </div>
                )
            case "paragraph-before-itemization":
                return <p key={`homeitem ${index}`}><b>{text}</b></p>
            case "fancy-item":
                return (
                    <div key={`homeitem ${index}`}>
                        {!isMobileDevice()
                            ? <span style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                    <FaAngleDoubleRight/>
                                </span>
                            : <span>
                                    <FaAngleDoubleRight/>
                            </span>
                        }
                        {text}
                    </div>
                )
            default:
                return <p>{text}</p>
        }
    }

    const renderHomeText = (textElements: HomeTextParagraph[]): any => {
        const renderImage = (index) => {
            const imageSrc = introImages(`./img-${index + 1}-${language}.png`).default;
            return <div className={"d-flex justify-content-center"}>

                <img src={imageSrc} style={{width: "90%", margin: "auto", maxHeight: "100%"}}
                     alt={`Intro Image ${index}`}/>
            </div>
        }

        return textElements.map((textParagraph, index) => {
            return <div className={"d-flex flex-row"} style={{paddingBottom: "15vh"}} key={`home-text-${textParagraph.id}`}>
                <div className={"w-50 pr-3"}>
                    {index % 2 === 0 ?
                        <div className={"d-flex align-items-center justify-content-center"}
                             style={{height: "100%"}}>{renderImage(index)}</div>
                        :
                        <div>{textParagraph.text.map((text, index) => renderTextElement(text, index))}</div>
                    }
                </div>
                <div className={"w-50 pl-3"}>
                    {index % 2 === 1 ?
                        <div className={"d-flex align-items-center justify-content-center"}
                             style={{height: "100%"}}>{renderImage(index)}</div>
                        :
                        <div>{textParagraph.text.map((text, index) => renderTextElement(text, index))}</div>
                    }
                </div>
            </div>
        })
    }

    const gotoHomePage = () => {
        history.push(PATH_HOME);
    }

    return <div style={{paddingTop: "5vh", paddingBottom: "5vh", paddingLeft: "2vw"}}>
        <div>
            <h3>{applicationStrings.home_foodcompare_overview[language]}</h3>
        </div>
        <div className="container-fluid" style={{maxWidth: "1600px"}}>
            <div  style={{paddingBottom: "20px", marginBottom: "50px", marginTop: "5vh"}}>
                {renderHomeText(homeText3)}
            </div>
        </div>
        <hr/>
        <div className={"d-flex justify-content-center"}>
            <button className={"btn btn-link"} onClick={() => {gotoHomePage()}}>{applicationStrings.info_button_back[language]}</button>
        </div>
    </div>
}