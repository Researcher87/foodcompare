import React, {useContext, useState} from "react";
import {applicationStrings} from "../../static/labels";
import {LanguageContext} from "../../contexts/LangContext";
import {maxMessageCharacters} from "../../config/ApplicationSetting";
import {MailData} from "../../types/livedata/MailData";
import {checkMailValidity} from "../../service/MailService";
import {NotificationManager} from 'react-notifications'
import Recaptcha from 'react-recaptcha'

import {
    MAIL_CONTENT_TO_LONG,
    MAIL_INVALID_ADDRESS,
    MAIL_INVALID_NAME,
    MAIL_NO_CONTENT
} from "../../config/ErrorMessageCodes";
import {RECAPTCHA_KEY, SERVICE_ID, TEMPLATE_ID, USER_ID} from "../../config/ApplicationKeys";
import emailjs from "emailjs-com";
import {ApplicationDataContextStore} from "../../contexts/ApplicationDataContext";

export function ContactForm() {
    const language = useContext(LanguageContext).language
    const applicationContext = useContext(ApplicationDataContextStore)

    const [name, setName] = useState("")
    const [mailAddress, setMailAdress] = useState("")
    const [message, setMessage] = useState("")
    const [characters, setCharacters] = useState(0)

    const [userVerified, setUserVerified] = useState(false)

    const updateName = (event) => {
        setName(event.target.value)
    }

    const updateMailAddress = (event) => {
        setMailAdress(event.target.value)
    }

    const updateMessage = (event) => {
        setMessage(event.target.value)
        setCharacters(event.target.value.length)
    }

    const verifyCallBack = (response) => {
        if(response) {
            setUserVerified(true)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if(!userVerified) {
            NotificationManager.error(applicationStrings.label_mail_error_verification[language])
            return
        }

        const mailData: MailData = {
            name: name.trim(),
            address: mailAddress.trim(),
            message: message.trim()
        }

        const validationErrors = checkMailValidity(mailData)
        if(validationErrors.length > 0) {
            const firstError = validationErrors[0]
            let errorMessage = ''
            switch(firstError) {
                case MAIL_INVALID_NAME:
                    errorMessage = applicationStrings.label_mail_error_name[language]
                    break
                case MAIL_INVALID_ADDRESS:
                    errorMessage = applicationStrings.label_mail_error_mailaddress[language]
                    break
                case MAIL_NO_CONTENT:
                    errorMessage = applicationStrings.label_mail_error_nocontent[language]
                    break
                case MAIL_CONTENT_TO_LONG:
                    errorMessage = applicationStrings.label_mail_error_content_too_long[language]
                    break
            }

            NotificationManager.error(errorMessage)
            return
        }

        sendMail(mailData, language)
    }

    const sendMail = (mail: MailData, language: string) => {
        const options = {
            reply_to: mail.address,
            from_name: mail.name,
            message: mail.message,
        }

        emailjs.send(SERVICE_ID, TEMPLATE_ID, options, USER_ID)
            .then((result) => {
                NotificationManager.info(applicationStrings.message_email_success[language])
                setName("")
                setMessage("")
                setMailAdress("")
                setCharacters(0)
            }, (error) => {
                if(applicationContext?.debug) {
                    console.log(error.text);
                }
                NotificationManager.info(applicationStrings.message_email_error[language])
            });
    }

    const charactersLeft = maxMessageCharacters - characters
    const charactersMessage = maxMessageCharacters >= 0
        ? applicationStrings.label_mail_characters_left[language].replace("/xx/", charactersLeft)
        : applicationStrings.label_mail_too_long[language]

    return (
        <form onSubmit={handleSubmit}>
            <div className={"container"}>
                <p>{applicationStrings.text_contact_form[language]}</p>
                <div>
                    <span className={'form-label'}>{applicationStrings.label_mail_name[language]}</span>
                    <input className={"form-control input"}
                           value={name}
                           onChange={updateName}
                    />
                </div>
                <div>
                    <span className={'form-label'}>{applicationStrings.label_mail_address[language]}</span>
                    <input className={"form-control input"}
                           value={mailAddress}
                           onChange={updateMailAddress}
                    />
                </div>
                <div>
                    <span className={'form-label'}>{applicationStrings.label_mail_message[language]}</span>
                    <textarea className={"form-control input"}
                              rows={8}
                              value={message}
                              onChange={updateMessage}
                    />
                </div>
                <div><p style={{fontSize: "0.8em"}}>{charactersMessage}</p></div>

                <div style={{paddingTop: "12px", paddingBottom: "36px"}}>
                    <Recaptcha
                        sitekey={RECAPTCHA_KEY}
                        render="explicit"
                        verifyCallback={verifyCallBack}
                    />
                </div>

                <button className={"btn btn-primary"} type="submit">{applicationStrings.button_send[language]}</button>
            </div>
        </form>
    );
};