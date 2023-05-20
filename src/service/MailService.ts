import {MailData} from "../types/livedata/MailData";
import {
    MAIL_INVALID_ADDRESS,
    MAIL_CONTENT_TO_LONG,
    MAIL_INVALID_NAME,
    MAIL_NO_CONTENT
} from "../config/ErrorMessageCodes";
import {maxMessageCharacters} from "../config/ApplicationSetting";


const mailRegex = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'

export function checkMailValidity(mail: MailData): string[] {
    const errors: string[] = []

    if (!checkName(mail.name)) {
        errors.push(MAIL_INVALID_NAME)
    }

    if (!checkMailAddress(mail.address)) {
        errors.push(MAIL_INVALID_ADDRESS)
    }

    if (!checkContent(mail.message)) {
        errors.push(MAIL_NO_CONTENT)
    }

    if (!checkLength(mail.message)) {
        errors.push(MAIL_CONTENT_TO_LONG)
    }

    return errors
}

function checkName(name: string): boolean {
    return name.length >= 3 && name.length <= 50
}

function checkContent(content: string): boolean {
    return content.length >= 30
}

function checkLength(content: string): boolean {
    return content.length <= maxMessageCharacters
}

function checkMailAddress(mailAddress: string): boolean {
    return mailAddress.match(mailRegex) !== null
}
