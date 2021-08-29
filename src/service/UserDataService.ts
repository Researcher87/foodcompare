import { UserData } from "../types/livedata/UserData";

export const USERDATA_ERROR_AGE = "userdata error age"
export const USERDATA_ERROR_WEIGHT = "userdata error weight"
export const USERDATA_ERROR_SIZE = "userdata error size"
export const USERDATA_OK = "userdata ok"

export function checkUserDataValidity(userData: UserData): string {
	const {age, size, weight} = userData

	if (age != null && (age < 15 || age > 100)) {
		return USERDATA_ERROR_AGE
    } else if (size != null && (size < 80 || size > 225)) {
		return USERDATA_ERROR_SIZE
	} else if (weight != null && (weight < 30 || weight > 250)) {
		return USERDATA_ERROR_WEIGHT
    }

    return USERDATA_OK
}