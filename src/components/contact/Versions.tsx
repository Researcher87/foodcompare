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
                <li>Layout has been entirely revised.</li>
                <li>Several display bugs have been fixed.</li>
                <li>Import/Export of data tabs is now available.</li>
                <li>Selected food items in the food data panel can be edit now (including composite food items).</li>
                <li>New food items have been added to the database.</li>
            </ul>
        </p>

    </div>
}