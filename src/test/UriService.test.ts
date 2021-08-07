import { SEX_FEMALE, TAB_LIPIDS_DATA } from "../config/Constants"
import { getPalCategory } from "../service/calculation/EnergyService"
import { getNumberOfFixedLength } from "../service/calculation/MathService"
import { convertPortionDataObjectToString, convertPortionDataStringToObject, convertUserDataObjectToString, convertUserDataStringToObject, makeFoodDataPanelDefaultUri, parseFoodDataPanelDefaultUri } from "../service/UriService"
import { UserData } from "../types/livedata/UserData"
import { PortionData } from "../types/nutrientdata/FoodItem"
import { userData } from "./TestHelper"

describe('Parsing of sub-elements in the URI', () => {
		
	it('should correctly convert the user data object in a string', () => {				
		const userDataString = convertUserDataObjectToString(userData)
		const reconvertedObject = convertUserDataStringToObject(userDataString)
		
		expect(reconvertedObject).not.toBe(null)
		expect(userData).toMatchObject(reconvertedObject ? reconvertedObject : {})	
	})
	
	
	it('should correctly convert the portion data object in a string', () => {		
		const portionData: PortionData = {
			portionType: 120,
			amount: 55,
		}
		
		const portionDataString = convertPortionDataObjectToString(portionData)
		const reconvertedObject = convertPortionDataStringToObject(portionDataString)
		
		expect(reconvertedObject).not.toBe(null)
		expect(portionData).toMatchObject(reconvertedObject ? reconvertedObject : {})	
	})
	
	it('should correctly convert fooddata panel data into a corresponding URI', () => {
		const foodItemId = 5
		const source = 2
		const portionData: PortionData = {
			portionType: 300,
			amount: 55
		}
		
		const uriString = makeFoodDataPanelDefaultUri(foodItemId, source, portionData, userData, true, false, TAB_LIPIDS_DATA)
		const uriObject = parseFoodDataPanelDefaultUri(uriString)
		
		expect(uriObject).not.toBe(null)
		expect(uriObject?.foodItemId).toBe(foodItemId)
		expect(uriObject?.source).toBe(source)
		expect(uriObject?.portionData).toMatchObject(portionData)
		expect(uriObject?.userData).toMatchObject(userData)
	})
	
})