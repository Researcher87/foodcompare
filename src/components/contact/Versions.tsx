import {buildDate, release} from "../../config/ApplicationSetting";

export function Versions() {
    return <div className={"container"}>
        <h1>
            Food Compare
        </h1>
        <h6>
            Version {release}
        </h6>
        <h6>
            Build time: {buildDate}
        </h6>

        <p style={{paddingTop: "24px"}}>
            <b>New features in Version 1.4</b>
            <ul>
                <li>Food ranking data panel</li>
                <li>Redesign of home menu</li>
                <li>New food data (now about 175 different food items)</li>
                <li>Extension and redesign of contact menu</li>
                <li>General layout update and fixing of style issues</li>
            </ul>
        </p>

    </div>
}