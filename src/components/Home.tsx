import {useContext, useState} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {Carousel} from 'react-responsive-carousel';
import {applicationStrings} from "../static/labels";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Link} from 'react-router-dom';
import {PATH_DIRECT_COMPARE, PATH_FOODDATA_PANEL} from "../config/Constants";

const images = require.context('../static/image/carousel', true);


export function Home() {
    const languageContext = useContext(LanguageContext)
    const [displayedImage, setDisplayedImage] = useState<number>(0)

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
            <div style={{paddingTop: "20px", paddingBottom: "50px"}}>
                <Carousel showArrows={true}
                          infiniteLoop={true} autoPlay={true}
                          interval={6000}
                          transitionTime={800}
                          selectedItem={displayedImage}
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
            <div className="text-center" style={{paddingTop: "32px"}}>
                {applicationStrings.label_getStarted[languageContext.language]}
                <div style={{paddingTop: "20px"}}>
                    <Link to={PATH_FOODDATA_PANEL + "?add=1"}>
                        <button type="button"
                                className="btn btn-warning btn-small"
                                style={{minWidth: "150px"}}>
						{applicationStrings.button_getstarted_1[languageContext.language]}
                        </button>
                    </Link>
                </div>
                <div style={{paddingTop: "20px"}}>
                    <Link to={PATH_DIRECT_COMPARE}>
                        <button type="button"
                                className="btn btn-warning btn-small"
                                style={{minWidth: "150px"}}>
						{applicationStrings.button_getstarted_2[languageContext.language]}
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="media home app" style={{margin: "0 auto"}}>
            <div className={"container-fluid"}>
                <div className="row">
                    <div className={"col-5"}>
                        <p>{applicationStrings.home_text_1[languageContext.language]}</p>
                        <div style={{paddingTop: "20px", paddingBottom: "60px"}}>
                            {renderStartButtons()}
                        </div>
                        <p>{applicationStrings.home_text_2[languageContext.language]}</p>
                        <p>{applicationStrings.home_text_3[languageContext.language]}</p>
                    </div>
                    <div className={"col-7"} style={{paddingLeft: "45px"}}>
                        {renderCarousel()}
                    </div>
                </div>
            </div>
        </div>
    );

}