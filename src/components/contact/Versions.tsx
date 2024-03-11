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
            <b>Changes in Version {release}</b>
            <ul>
                <li>Overall data view has been added.</li>
                <li>Unit conversion between US weights and gram is now possible in the food selector.</li>
                <li>Improved naming suggestions in the food selector typeahead field.</li>
                <li>Food items in larger food classes (e.g. cheese) are now sorted lexicographically.</li>
                <li>The calculation type of data calculation is now also shown on the info page of a selected food item.</li>
                <li>Fixes: supplementing was sometimes carried out even when the corresponding option was disabled.</li>
                <li>Several display bugs have been fixed.</li>
                <li>Food Compare will no longer supplement data between two data sources of a food item if they differ too much in key
                    parameters.</li>
            </ul>
        </p>

    </div>
}