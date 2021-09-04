import {useContext, useState} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {Carousel} from 'react-responsive-carousel';
import {applicationStrings} from "../static/labels";

import homeText1 from "../static/hometext1.json";
import homeText2 from "../static/hometext2.json";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Link} from 'react-router-dom';
import {LANGUAGE_DE, PATH_DIRECT_COMPARE, PATH_FOODDATA_PANEL} from "../config/Constants";
import {FaAngleDoubleRight} from "react-icons/fa";

const images = require.context('../static/image/carousel', true);

interface HomeTextElement {
    type: string
    de: string
    en: string
}

export function Home() {
    const languageContext = useContext(LanguageContext)
    const [displayedImage, setDisplayedImage] = useState<number>(0)

    console.log('bug home: render with language:', languageContext.language)

    const imageChanged = (image) => {
        setDisplayedImage(image)
    }

    const renderCarousel = () => {
        let langKey = languageContext.language

        const pic1 = images(`./Img-${langKey}-1.png`).default;
        const pic2 = images(`./Img-${langKey}-2.png`).default;
        const pic3 = images(`./Img-${langKey}-3.png`).default;
        const pic4 = images(`./Img-${langKey}-4.png`).default;
        const pic5 = images(`./Img-${langKey}-5.png`).default;
        const pic6 = images(`./Img-${langKey}-6.png`).default;

        const captionAttribute = `home_carousel_${displayedImage}`;
        const imageCaption = applicationStrings[captionAttribute][languageContext.language];

        return (
            <div style={{ paddingBottom: "40px"}}>
                <Carousel showArrows={true}
                          infiniteLoop={true} autoPlay={true}
                          interval={6000}
                          transitionTime={800}
                          selectedItem={displayedImage}
                          showThumbs={false}
                          showStatus={false}
                          onChange={imageChanged}>
                    <div>
                        <img src={pic1}/>
                    </div>
                    <div>
                        <img src={pic2}/>
                    </div>
                    <div>
                        <img src={pic3}/>
                    </div>
                    <div>
                        <img src={pic4}/>
                    </div>
                    <div>
                        <img src={pic5}/>
                    </div>
                    <div>
                        <img src={pic6}/>
                    </div>
                </Carousel>
                <div style={{textAlign: "center", fontStyle: "oblique"}}>
                    {imageCaption}
                </div>
            </div>
        );
    }


    const renderStartButtons = () => {
        return (
            <div style={{paddingTop: "16px"}}>
                <b>{applicationStrings.label_getStarted[languageContext.language]}</b>
                <div className={"text-center"}>
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_FOODDATA_PANEL + "?add=1"}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: "#f9e79f"}}>
                                {applicationStrings.button_getstarted_1[languageContext.language]}
                            </button>
                        </Link>
                    </div>
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_FOODDATA_PANEL + "?composite=1"}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: "#d5f5e3"}}>
                                {applicationStrings.button_getstarted_2[languageContext.language]}
                            </button>
                        </Link>
                    </div>
                    <div style={{paddingTop: "20px"}}>
                        <Link to={PATH_DIRECT_COMPARE}>
                            <button type="button"
                                    className="btn btn-small"
                                    style={{width: "75%", backgroundColor: "#fadbd8"}}>
                                {applicationStrings.button_getstarted_3[languageContext.language]}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }


    const renderHomeText = (textElements: HomeTextElement[]): any => {
        return textElements.map(textElement => renderTextElement(textElement))
    }

    const renderTextElement = (textElement: HomeTextElement): JSX.Element => {
        const text = languageContext.language === LANGUAGE_DE ? textElement.de : textElement.en

        switch (textElement.type) {
            case "paragraph":
                return <p>{text}</p>
            case "subheading":
                return (
                    <>
                        <br/>
                        <h3>
                            {text}
                        </h3>
                        <hr/>
                    </>
                )
            case "paragraph-before-itemization":
                return <p><b>{text}</b></p>
            case "fancy-item":
                return (
                    <div>
                        <span style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <FaAngleDoubleRight/>
                        </span>
                        {text}
                    </div>
                )
            default:
                return <p>{text}</p>
        }
    }

    return (
        <div className="media home app" style={{margin: "0 auto"}}>
            <div className={"container-fluid"}>
                <div className="row">
                    <div className={"col-5"}>
                        {renderHomeText(homeText1)}
                        <div style={{paddingTop: "20px", paddingBottom: "60px"}}>
                            {renderStartButtons()}
                        </div>
                    </div>
                    <div className={"col-7"} style={{paddingLeft: "45px"}}>
                        {renderCarousel()}
                    </div>
                </div>
                <hr/>
                <div className="card-header" style={{maxWidth: "1000px", paddingBottom: "20px", marginBottom: "50px"}}>
                    {renderHomeText(homeText2)}
                </div>
            </div>
        </div>
    );

}