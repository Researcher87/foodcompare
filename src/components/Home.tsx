import React, {useContext, useState} from "react";
import {LanguageContext} from "../contexts/LangContext";
import {Carousel} from 'react-responsive-carousel';
import {applicationStrings} from "../static/labels";

import homeText1 from "../static/hometext1.json";
import {FaExternalLinkAlt} from "react-icons/fa";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Link, useHistory} from 'react-router-dom';
import {
    PATH_DIRECT_COMPARE,
    PATH_FOODDATA_PANEL, PATH_INFO,
    PATH_RANKING
} from "../config/Constants";
import {isMobileDevice} from "../service/WindowDimension";

const carouselImages = require.context('../static/image/carousel-samples', true);
const startButtonImages = require.context('../static/image/start-buttons', true);

const startImg1 = startButtonImages(`./StartImg1.jpg`)
const startImg2 = startButtonImages(`./StartImg2.jpg`)
const startImg3 = startButtonImages(`./StartImg3.jpg`)
const startImg4 = startButtonImages(`./StartImg4.jpg`)

/**
 * Home component (not including Header or Info page).
 * @constructor
 */
export function Home() {
    const {language} = useContext(LanguageContext)
    const [displayedImage, setDisplayedImage] = useState<number>(0)
    const history = useHistory()

    const imageChanged = (image) => {
        setDisplayedImage(image)
    }

    const onClickCarouselImage = (index: number) => {
        let route: string | null = null;

        switch (index) {
            case 0:
                route = "datapanel?item=1;0;102_169;10;vitamindata;dct;075035175031000;01000000";
                break;
            case 1:
                route = "directcompare?item=124;0;200_136;10;123;0;202_167;10;vitamindata;075035175031000;02000001"
                break;
            case 2:
                route = "ranking?ranking=0;2;d_magnesium;11"
                break;
            case 3:
                route = "datapanel?item=63;0;300_180;10;juxtaposition;dct;075035175031000;00000000&group=2"
                break;
            case 4:
                route = `${PATH_FOODDATA_PANEL}?composite=1`
                break;
            case 5:
                route = "directcompare?item=159;0;999_100;10;194;0;999_150;10;lipidsdata;075035175031000;10000030"
                break;
        }

        if (route) {
            history.push(route);
        }
    }

    const renderCarousel = () => {
        const pic1 = carouselImages(`./img-1-${language}.png`);
        const pic2 = carouselImages(`./img-2-${language}.png`);
        const pic3 = carouselImages(`./img-3-${language}.png`);
        const pic4 = carouselImages(`./img-4-${language}.png`);
        const pic5 = carouselImages(`./img-5-${language}.png`);
        const pic6 = carouselImages(`./img-6-${language}.png`);

        const captionAttribute = `home_carousel_${displayedImage}`;
        const imageCaption = applicationStrings[captionAttribute][language];

        return (
            <div style={{height: "60%"}}>
                <Carousel className={"home-header-carousel"}
                          showArrows={false}
                          infiniteLoop={true}
                          autoPlay={true}
                          interval={8000}
                          transitionTime={1000}
                          selectedItem={displayedImage}
                          showThumbs={false}
                          showStatus={false}
                          showIndicators={false}
                          onClickItem={onClickCarouselImage}
                          onChange={imageChanged}>
                    <img src={pic1} alt={"Carousel 1"}/>
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
                </Carousel>
                <div style={{textAlign: "center", fontStyle: "oblique"}}
                     onClick={() => onClickCarouselImage(displayedImage)}>
                    <span style={{paddingRight: "1ch"}}>{imageCaption}</span>
                    <span>
                        <FaExternalLinkAlt/>
                    </span>
                </div>
            </div>
        );
    }


    const renderHomeHeaderDesktop = () => {
        return <div className={"d-flex flex-row home-header align-items-center"}>
            <div className={"d-flex flex-column w-50"}>
                <div style={{paddingLeft: "1vw"}}>
                    <div className={"home-header-slogan mb-2"}>{applicationStrings.label_home_slogan[language]}</div>
                    <div>{homeText1[language]}</div>
                </div>
            </div>
            <div className={"d-flex flex-column w-50"}>
                {renderCarousel()}
            </div>
        </div>
    }

    const renderHomeHeaderMobile = () => {
        return <div className={" home-header-mobile align-items-center"}>
            <div className={""}>
                <div className={"home-header-slogan mb-2"}>{applicationStrings.label_home_slogan[language]}</div>
                <div>{homeText1[language]}</div>
            </div>
        </div>
    }

    const renderStartButtonsDesktop = () => {
        return (
            <div>
                <div className={"d-flex flex-row justify-content-center"}>
                    <div className={"mr-5"}>
                        <Link to={PATH_FOODDATA_PANEL + "?add=1"}>
                            {renderStartButton(applicationStrings.button_getstarted_1[language], startImg1)}
                        </Link>
                    </div>
                    {!isMobileDevice() &&
                    <div>
                        <Link to={PATH_FOODDATA_PANEL + "?composite=1"}>
                            {renderStartButton(applicationStrings.button_getstarted_2[language], startImg2)}
                        </Link>
                    </div>
                    }
                    {!isMobileDevice() &&
                    <div>
                        <Link to={PATH_DIRECT_COMPARE}>
                            {renderStartButton(applicationStrings.button_getstarted_3[language], startImg3)}
                        </Link>
                    </div>
                    }
                    <div>
                        <Link to={PATH_RANKING}>
                            {renderStartButton(applicationStrings.button_getstarted_4[language], startImg4)}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const renderStartButton = (label: string, srcImage: string): any => {
        const buttonClass = !isMobileDevice() ? "home-startbutton" : "home-startbutton-mobile"
        return <button type="button" className={`btn btn-small btn-outline-dark ${buttonClass}`}>
            <div className={"d-flex flex-column h-100"}>
                <div className={"flex-row"}>
                    <img src={srcImage} style={{maxWidth: "95%"}} alt={"Start btn img"}/>
                </div>
                <div className="container d-flex flex-row align-items-center home-startbutton-label">
                    {label}
                </div>
            </div>
        </button>
    }

    const gotoInfoPage = () => {
        history.push(PATH_INFO);
    }

    return (
        <div>
            <div className="media">
                <div className={"container-fluid"}>
                    <div className="row">
                        {!isMobileDevice() ?
                            renderHomeHeaderDesktop()
                            :
                            renderHomeHeaderMobile()
                        }
                    </div>
                    {renderStartButtonsDesktop()}
                    <hr/>
                    <div className={"d-flex justify-content-center"}>
                        <button className={"btn btn-link"} onClick={() => {gotoInfoPage()}}>{applicationStrings.home_button_info[language]}</button>
                    </div>
                </div>
            </div>
        </div>
    );

}