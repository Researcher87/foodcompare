import Source from './Source'

export default interface FoodItem {
	id: number
	foodClass?: number
	srLegacyId?: string
	fnddsId?: string
	conditionId?: number
	nameId?: number
	defaultPortionId?: number
	portionData?: Array<PortionData>
	nutrientDataList: Array<NutrientData>
	aggregated?: Boolean
}

export interface PortionData {
	portionType: number
	amount: number
}

export interface NutrientData {
	source: Source
	sourceItemId: string
	baseData: BaseData
	vitaminData: VitaminData
	mineralData: MineralData
	proteinData: ProteinData
	carbohydrateData: CarbohydrateData
	lipidData: LipidData
}

export interface BaseData {
	energy: number | null
	water: number
	carbohydrates: number
	lipids: number
	proteins: number
	dietaryFibers: number | null
	ash: number | null
	alcohol: number | null
}

export interface VitaminData {
	a: number | null
	b1: number | null
	b2: number | null
	b3: number | null
	b5: number | null
	b6: number | null
	b7: number | null
	b9: number | null
	b12: number | null
	c: number | null
	d: number | null
	e: number | null
	k: number | null
	carotenoidData: CarotenoidData | null
}

export interface CarotenoidData {
	caroteneAlpha: number | null
	caroteneBeta: number | null
	cryptoxanthin: number | null
	lycopene: number | null
	lutein: number | null
}

export interface MineralData {
	calcium: number | null
	iron: number | null
	magnesium: number | null
	phosphorus: number | null
	potassium: number | null
	sodium: number | null
	zinc: number | null
	selenium: number | null
	manganese: number | null
	copper: number | null
}

export interface ProteinData {
	tryptophan: number | null
	threonine: number | null
	isoleucine: number | null
	leucine: number | null
	lysine: number | null
	methionine: number | null
	cystine: number | null
	phenylalanine: number | null
	tyrosine: number | null
	valine: number | null
	arginine: number | null
	histidine: number | null
	alanine: number | null
	asparticAcid: number | null
	glutamicAcid: number | null
	glycine: number | null
	proline: number | null
	serine: number | null
}

export interface CarbohydrateData {
	sugar: number | null
	sucrose: number | null
	glucose: number | null
	lactose: number | null
	fructose: number | null
	galactose: number | null
	maltose: number | null
	starch: number | null
}

export interface LipidData {
	unsaturatedMono: number | null
	unsaturatedPoly: number | null
	transFattyAcids: number | null
	cholesterol: number | null
	omegaData: OmegaData | null
	saturated: number | null
}

export interface OmegaData {
	omega3: number | null
	omega6: number | null
	uncertain: number | null
	uncertainRatio: number | null
}