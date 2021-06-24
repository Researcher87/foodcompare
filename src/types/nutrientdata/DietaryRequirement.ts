import Source from './Source'

export default interface DietaryRequirement {
	source: Source
	vitaminRequirementData: VitaminRequirementData
	mineralRequirementData: MineralRequirementData
	proteinRequirementData: ProteinRequirementData
}

export interface VitaminRequirementData {
	a: RequirementData
	b1: RequirementData
	b2: RequirementData
	b3: RequirementData
	b5: RequirementData
	b6: RequirementData
	b7: RequirementData
	b9: RequirementData
	b12: RequirementData
	c: RequirementData
	d: RequirementData
	e: RequirementData
	k: RequirementData
}

export interface MineralRequirementData {
	calcium: RequirementData
	iron: RequirementData
	magnesium: RequirementData
	phosphorus: RequirementData
	potassium: RequirementData
	sodium: RequirementData
	zinc: RequirementData
	selenium: RequirementData
	manganese: RequirementData
	copper: RequirementData
}

export interface ProteinRequirementData {
	tryptophan: number
	threonine: number
	isoleucine: number
	leucine: number
	lysine: number
	methionine: number
	cystine: number
	phenylalanine: number
	tyrosine: number | null
	valine: number
	arginine: number | null
	histidine: number
	alanine: number | null
	asparticAcid: number | null
	glutamicAcid: number | null
	glycine: number | null
	proline: number | null
	serine: number | null
}

export interface RequirementData {
	youth: RequirementAgeGroupData
	youngAdult: RequirementAgeGroupData
	midLifeAdult: RequirementAgeGroupData
	preSenior: RequirementAgeGroupData
	senior: RequirementAgeGroupData
	upperLimit: number | null
}

export interface RequirementAgeGroupData {
	male: number
	female: number
	femalePregnant: number | null
	femaleBreastFeeding: number | null
}

