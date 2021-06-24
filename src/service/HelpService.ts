import {LANGUAGE_EN} from "../config/Constants";

export interface HelpText {
    title: string,
    content: string
}

export function getHelpText(helpModalId: number, languageId: string): HelpText | null {
    const helpFile = require("../static/help/help.json");

    let helpEntry = 0;
    const entry = helpFile.entries.find( (entry) => entry.id === helpModalId);

    if(entry) {
        const languageSection = languageId === LANGUAGE_EN ? entry.en : entry.de;
        const title = languageSection.title;
        const contentArray = languageSection.content;

        let content = "";
        for(let i=0; i < contentArray.length; i++) {
            content += contentArray[i];
            if(i < (contentArray.length-1)) {
                content += "<br />"
            }
        }

        return {
            title: title,
            content: content
        };
    }

    return null
}