import {useContext, useState} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {Carousel} from 'react-responsive-carousel';
import {applicationStrings} from "../static/labels";

import homeText1 from "../static/hometext1.json";
import homeText2 from "../static/hometext2.json";
import homeText3 from "../static/hometext3.json";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Link} from 'react-router-dom';
import {LANGUAGE_DE, PATH_DIRECT_COMPARE, PATH_FOODDATA_PANEL, PATH_RANKING} from "../config/Constants";
import {FaAngleDoubleRight} from "react-icons/fa";
import {isMobileDevice} from "../service/WindowDimension";
import {callEvent} from "../service/GA_EventService";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {GA_ACTION_HOME_CLICK_START_BUTTON, GA_CATEGORY_HOME} from "../config/GA_Events";

const images = require.context('../static/image/carousel', true);

interface HomeTextElement {
    type: string
    de: string
    en: string
}

export function Home() {
    const {language} = useContext(LanguageContext)
    const [displayedImage, setDisplayedImage] = useState<number>(0)
    const applicationContext = useContext(ApplicationDataContextStore)

    const imageChanged = (image) => {
        setDisplayedImage(image)
    }

    const renderCarousel = () => {
        const pic1 = images(`./Img-${language}-1.png`).default;
        const pic2 = images(`./Img-${language}-2.png`).default;
        const pic3 = images(`./Img-${language}-3.png`).default;
        const pic4 = images(`./Img-${language}-4.png`).default;
        const pic5 = images(`./Img-${language}-5.png`).default;
        const pic6 = images(`./Img-${language}-6.png`).default;
        const pic7 = images(`./Img-${language}-7.png`).default;

        const captionAttribute = `home_carousel_${displayedImage}`;
        const imageCaption = applicationStrings[captionAttribute][language];

        return (
            <div style={{paddingBottom: "40px"}}>
                <Carousel showArrows={true}
                          infiniteLoop={true} autoPlay={true}
                          interval={6000}
                          transitionTime={800}
                          selectedItem={displayedImage}
                          showThumbs={false}
                          showStatus={false}
                          onChange={imageChanged}>
                    <div>
                        <img src={pic1} alt={"Carousel 1"}/>
                    </div>
                    <div>
                        <img src={pic2} alt={"Carousel 2"}/>
                    </div>
                    <div>
                        <img src={pic3} alt={"Carousel 3"}/>
                    </div>
                    <div>
                        <img src={pic4} alt={"Carousel 4"}/>
                    </div>
                    <div>
                        <img src={pic5} alt={"Carousel 5"}/>
                    </div>
                    <div>
                        <img src={pic6} alt={"Carousel 6"}/>
                    </div>
                    <div>
                        <img src={pic7} alt={"Carousel 7"}/>
                    </div>
                </Carousel>
                <div style={{textAlign: "center", fontStyle: "oblique"}}>
                    {imageCaption}
                </div>
            </div>
        );
    }

    // const buttonColors = ["#f9e79f", "#d5f5e3", "#fadbd8", "#aed6f1"];
    const buttonBgColor = "#2952a3"
    const buttonTextColor = "#FFFFFF"

    const onStartButtonClick = (id: number) => {
        let label = "";
        switch (id) {
            case 1:
                label = "Food Analyzer (Default Mode)"
                break;
            case 2:
                label = "Food Analyzer (Aggregated)"
                break;
            case 3:
                label = "Direct Compare"
                break;
            case 4:
                label = "Ranking"
                break;
        }

        callEvent(applicationContext?.debug, GA_ACTION_HOME_CLICK_START_BUTTON, GA_CATEGORY_HOME, label)
    }

    const renderStartButtons = () => {
        const buttonClass = isMobileDevice() ? "text-center d-flex flex-row" : "text-center"

        return (
            <div style={{paddingTop: "16px"}}>
                <b>{applicationStrings.label_getStarted[language]}</b>
                <div className={buttonClass}>
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_FOODDATA_PANEL + "?add=1"} onClick={() => onStartButtonClick(1)}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: buttonBgColor, color: buttonTextColor}}>
                                {applicationStrings.button_getstarted_1[language]}
                            </button>
                        </Link>
                    </div>
                    {!isMobileDevice() &&
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_FOODDATA_PANEL + "?composite=1"} onClick={() => onStartButtonClick(2)}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: buttonBgColor, color: buttonTextColor}}>
                                {applicationStrings.button_getstarted_2[language]}
                            </button>
                        </Link>
                    </div>
                    }
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_DIRECT_COMPARE} onClick={() => onStartButtonClick(3)}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: buttonBgColor, color: buttonTextColor}}>
                                {applicationStrings.button_getstarted_3[language]}
                            </button>
                        </Link>
                    </div>
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_RANKING} onClick={() => onStartButtonClick(4)}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: buttonBgColor, color: buttonTextColor}}>
                                {applicationStrings.button_getstarted_4[language]}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }


    const renderHomeText = (textElements: HomeTextElement[]): any => {
        return textElements.map((textElement, index) => renderTextElement(textElement, index))
    }

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


    const renderMobile = () => {
        return (
            <div className="media home app" style={{margin: "0 auto"}}>
                <div>
                    <div>
                        {renderHomeText(homeText1)}
                        <div style={{paddingTop: "20px", paddingBottom: "60px"}}>
                            {renderStartButtons()}
                        </div>
                        {renderHomeText(homeText2)}
                    </div>
                    <hr/>
                    <div style={{paddingTop: "30px"}}>
                        <h3>{applicationStrings.home_foodcompare_overview[language]}</h3>
                        <div className="card-header"
                             style={{maxWidth: "1000px", paddingBottom: "20px", marginBottom: "50px"}}>
                            {renderHomeText(homeText3)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderDesktop = () => {
        return (
            <div>
                <div className="media home app" style={{margin: "0 auto"}}>
                    <div className={"container-fluid"}>
                        <div className="row">
                            <div className={"col-5"}>
                                {renderHomeText(homeText1)}
                                <div style={{paddingTop: "20px", paddingBottom: "60px"}}>
                                    {renderStartButtons()}
                                </div>
                                {renderHomeText(homeText2)}
                            </div>
                            <div className={"col-7"} style={{paddingLeft: "45px"}}>
                                {renderCarousel()}
                            </div>
                        </div>
                        <hr/>
                        <div style={{paddingTop: "30px"}}>
                            <h3>{applicationStrings.home_foodcompare_overview[language]}</h3>
                            <div className="card-header"
                                 style={{maxWidth: "1000px", paddingBottom: "20px", marginBottom: "50px"}}>
                                {renderHomeText(homeText3)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return <div>
        {isMobileDevice()
            ? <div>{renderMobile()}</div>
            : <div>{renderDesktop()}</div>
        }
    </div>


}