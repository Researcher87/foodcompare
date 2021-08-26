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
            <b>New features in Version 1.3</b>
            <ul>
                <li>Direct comparison between two food elements</li>
                <li>Forward from front page to the food selector modal within the food data panel</li>
                <li>New data sources added for some fruits and vegetables (FNDDS)</li>
                <li>Restyling of contact menu</li>
                <li>New data settings: Supplementing or combining data if two data sources are available</li>
                <li>Storing display mode temporarily when data tabs or menus are changed</li>
                <li>General layout update and fixing of styling issues</li>
            </ul>
        </p>

    </div>
}