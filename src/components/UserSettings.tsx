import React, {useContext, useEffect, useState} from "react";
import {ApplicationDataContextStore} from "../contexts/ApplicationDataContext";
import {LanguageContext} from "../contexts/LangContext";
import {SEX_FEMALE, SEX_MALE} from "../config/Constants";
import {UserData} from "../types/livedata/UserData";
import {
    initialUserDataAge,
    initialUserDataBreastfeeding,
    initialUserDataLeisureSports,
    initialUserDataPregnant,
    initialUserDataSex,
    initialUserDataSize,
    initialUserDataWeight
} from "../config/ApplicationSetting";
import {applicationStrings} from "../static/labels";
import {NotificationManager} from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import {Form, FormControl, FormGroup} from "react-bootstrap";
import Select from 'react-select';
import {getPalCategories, getPalCategory} from "../service/calculation/EnergyService";
import ReactTooltip from "react-tooltip";
import ReactSelectOption from "../types/ReactSelectOption";
import {isMobileDevice, isSmallScreen, useWindowDimension} from "../service/WindowDimension";
import {
    checkUserDataValidity,
    USERDATA_ERROR_AGE,
    USERDATA_ERROR_SIZE,
    USERDATA_ERROR_WEIGHT
} from "../service/UserDataService";
import {customSelectStyles} from "../config/UI_Config";
import {FaLightbulb} from "react-icons/fa";

export function UserSettings() {
    const applicationContext = useContext(ApplicationDataContextStore)
    const languageContext = useContext(LanguageContext)
    const lang = languageContext.language

    const [age, setAge] = useState<number>(initialUserDataAge)
    const [size, setSize] = useState<number>(initialUserDataSize)
    const [weight, setWeight] = useState<number>(initialUserDataWeight)
    const [sex, setSex] = useState<string>(initialUserDataSex)
    const [pregnant, setPregnant] = useState<boolean>(initialUserDataPregnant)
    const [breastFeeding, setBreastFeeding] = useState<boolean>(initialUserDataBreastfeeding)
    const [palValue, setPalValue] = useState<ReactSelectOption | null>(null)
    const [leisureSport, setLeisureSport] = useState<boolean>(initialUserDataLeisureSports)

    const windowSize = useWindowDimension()

    useEffect(() => {
        if (applicationContext) {
            setAge(applicationContext.userData.age)
            setSize(applicationContext.userData.size)
            setWeight(applicationContext.userData.weight)
            setSex(applicationContext.userData.sex)
            setPregnant(applicationContext.userData.pregnant)
            setBreastFeeding(applicationContext.userData.breastFeeding)
            setLeisureSport(applicationContext.userData.leisureSports)
        }
    }, [applicationContext])

    const changeAge = (event: any) => {
        setAge(event.target.value)
    }

    const changeSize = (event: any) => {
        setSize(event.target.value)
    }

    const changeWeight = (event: any) => {
        setWeight(event.target.value)
    }

    const handleRadioButtonClick = (event: any) => {
        const value = event.target.value;
        const sex = value === SEX_MALE ? SEX_MALE : SEX_FEMALE;
        if (sex === SEX_MALE) {
            setPregnant(false)
            setBreastFeeding(false)
        }
        setSex(sex)
    }

    const changePregnant = (event: any) => {
        setPregnant(!pregnant)
    }

    const changeBreastFeeding = (event: any) => {
        setBreastFeeding(!breastFeeding)
    }

    const changeAdditionalPalPorts = (event: any) => {
        setLeisureSport(!leisureSport)
    }

    const changePalValue = (value: ReactSelectOption) => {
        setPalValue(value)
    }

    const submitUserData = () => {
        if (!applicationContext) {
            return
        }

        const userData: UserData = {
            age: age,
            size: size,
            weight: weight,
            sex: sex,
            pregnant: pregnant,
            breastFeeding: breastFeeding,
            palValue: palValue ? palValue.value : applicationContext.userData.palValue,
            leisureSports: leisureSport,
            initialValues: false
        }

        const inputOk = checkInputValidity(userData)

        if (inputOk) {
            applicationContext.setUserData(userData)
            NotificationManager.success(applicationStrings.message_userdata_success[lang])
        }
    }


    const checkInputValidity = (userData: UserData) => {
        const validationResult = checkUserDataValidity(userData)

        if (validationResult === USERDATA_ERROR_AGE) {
            showMessage(applicationStrings.message_userdata_error_age[lang]);
            return false;
        } else if (validationResult === USERDATA_ERROR_SIZE) {
            showMessage(applicationStrings.message_userdata_error_size[lang]);
            return false;
        } else if (validationResult === USERDATA_ERROR_WEIGHT) {
            showMessage(applicationStrings.message_userdata_error_weight[lang]);
            return false;
        }

        return true;
    }

    const showMessage = (message: string) => {
        NotificationManager.error(message)
    }

    const inputClass = isSmallScreen(windowSize) ? "form-control form-control-sm input-sm" : "form-control input"

    const renderTextField = (label, value, callback) => {
        const classRow = isMobileDevice() ? "form-row-m" : "form-row"

        return (
            <div className={classRow}>
                <Form.Label className="form-label">{label}:</Form.Label>
                <FormControl
                    className={inputClass}
                    type="text"
                    value={value}
                    onChange={callback}
                />
            </div>
        );
    }

    const renderSexRadioButtons = () => {
        const classRow = isMobileDevice() ? "form-row-indent-m" : "form-row-indent"

        return (
            <div className={classRow}>
                    <Form.Check type="radio"
                                inline={true}
                                label={applicationStrings.label_userSettings_sex_male[lang]}
                                value={SEX_MALE}
                                checked={(sex === SEX_MALE)}
                                onChange={handleRadioButtonClick}
                    />
                    <Form.Check type="radio"
                                inline={true}
                                label={applicationStrings.label_userSettings_sex_female[lang]}
                                value={SEX_FEMALE}
                                checked={(sex !== SEX_MALE)}
                                onChange={handleRadioButtonClick}
                    />
            </div>
        )
    }

    const renderFemaleCheckboxes = () => {
        return (
            <div className="form" style={{marginLeft: "100px"}}>
                <div>
                    <Form.Check inline className="form-radiobutton"
                                checked={pregnant === true}
                                disabled={sex === SEX_MALE}
                                label={applicationStrings.label_userSettings_pregnant[lang]}
                                onClick={changePregnant}>
                    </Form.Check>
                </div>
                <div>
                    <Form.Check inline className="form-radiobutton"
                                disabled={sex === SEX_MALE}
                                label={applicationStrings.label_userSettings_breastfeeding[lang]}
                                onClick={changeBreastFeeding}>
                    </Form.Check>
                </div>
            </div>
        );
    }


    const renderPalList = (userData: UserData) => {
        const palCategories = getPalCategories(lang);
        if (!palCategories) {
            return <div/>
        }

        if (!palValue) {   // Initialize pal value first time
            let userDataPalValue = palCategories.find(palObject => palObject.value === userData.palValue)
            if (!userDataPalValue) {
                userDataPalValue = palCategories[0]
            }
            setPalValue(userDataPalValue)
        }

        if (!palValue) {
            return <div/>
        }

        const descriptionCode = `palcat_desc_${getPalCategory(palValue.value)}`
        const description = applicationStrings[descriptionCode][lang];

        return (
            <div className="form-row">
                <div className={"usersettings-pal"}>
                    <label className="form-label">{applicationStrings.label_userSettings_palValue[lang]}:</label>
                    <Select className="form-control-sm"
                            options={palCategories}
                            value={palValue}
                            isSearchable={false}
                            styles={customSelectStyles}
                            onChange={(value) => changePalValue(value)}
                    />
                </div>
                <p className="usersettings-pal-text">
                    {description}
                </p>
            </div>
        )
    }


    const renderActivityCheckboxes = () => {
        return (
            <div className="form-row-indent" style={{marginTop: "-15px"}}>
                <label className="form-elements"
                       data-for={"us-leisure"}
                       data-tip={applicationStrings.label_userSettings_leisureSports_tooltip[lang]}>
                    <ReactTooltip id={"us-leisure"}/>
                    <Form.Check inline className="form-radiobutton"
                                label={applicationStrings.label_userSettings_leisureSports[lang]}
                                checked={leisureSport}
                                onChange={changeAdditionalPalPorts}>
                    </Form.Check>
                </label>
            </div>
        );
    }

    const renderSubmitButton = () => {
        return (
            <div className="text-center">
                <button type="button"
                        className="btn btn-primary"
                        style={{marginBottom: "5vh"}}
                        onClick={() => submitUserData()}>
                    {applicationStrings.button_submit[lang]}
                </button>
            </div>
        )
    }

    if (!applicationContext) {
        return <div/>
    }

    const value_age = (age != null) ? age : initialUserDataAge
    const value_size = (size != null) ? size : initialUserDataSize
    const value_weight = (weight != null) ? weight : initialUserDataWeight

    return (
        <div>
            <div className={"m-3"}>
               <FaLightbulb/> {applicationStrings.label_userSettings_intro[lang]}
            </div>
            <div className="container" style={{paddingTop: "24px"}}>
                <div className="row userDataSettings">
                    <div className="col-12">
                        <form>
                            <FormGroup controlId="formBasicText">
                                <div className="row">
                                    <div className="col-6">
                                        {renderTextField(applicationStrings.label_userSettings_age[lang], value_age, changeAge)}
                                        {renderTextField(applicationStrings.label_userSettings_size[lang], value_size, changeSize)}
                                        {renderTextField(applicationStrings.label_userSettings_weight[lang], value_weight, changeWeight)}
                                    </div>
                                    <div className="col-6">
                                        <Form.Label className="form-label" style={{paddingLeft: "20px"}}>
                                            {applicationStrings.label_userSettings_sex[lang]}
                                        </Form.Label>
                                        {renderSexRadioButtons()}
                                        {renderFemaleCheckboxes()}
                                    </div>
                                </div>
                                <div className="row">
                                    {renderPalList(applicationContext.userData)}
                                    {renderActivityCheckboxes()}
                                </div>
                            </FormGroup>
                            {renderSubmitButton()}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}