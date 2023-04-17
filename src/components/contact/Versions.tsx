import {buildDate, release} from "../../config/ApplicationSetting";
import {isMobileDevice} from "../../service/WindowDimension";

export function Versions() {
    return <div className={"container"}>
        {isMobileDevice() ?
            <h3>
                Food Compare
            </h3>
            :
            <h1>
                Food Compare
            </h1>
        }

        <h6>
            Version {release}
        </h6>
        <h6>
            Build time: {buildDate}
        </h6>

        <p style={{paddingTop: "24px"}}>
            <b>New features in Version {release}</b>
            <ul>
                <li>The layout of several menus has been revised</li>
                <li>Food Compare fits better on mobile devices now, though some functionality remains limited</li>
                <li>New food items have been added</li>
            </ul>
        </p>

    </div>
}