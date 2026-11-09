import { ConveniaInputError } from './errors';

export interface CatalogDefinition {
	value: string;
	name: string;
	path: string;
	anchor: string;
}

export const CATALOGS: readonly CatalogDefinition[] = [
	{ value: 'ethnicities', name: 'Ethnicities', path: '/ethnicities', anchor: 'obter-dados-de-etnias' },
	{ value: 'nationalities', name: 'Nationalities', path: '/nationalities', anchor: 'obter-dados-de-nacionalidades' },
	{ value: 'relationships', name: 'Employment Relationships', path: '/relationships', anchor: 'obter-dados-de-vinculos-empregaticios' },
	{ value: 'marital-status', name: 'Marital Status', path: '/marital-status', anchor: 'obter-dados-de-estado-civil' },
	{ value: 'educations', name: 'Education Types', path: '/educations', anchor: 'obter-dados-de-tipo-de-escolaridade' },
	{ value: 'bank-accounts', name: 'Bank Account Types', path: '/bank-accounts', anchor: 'obter-dados-de-tipo-da-conta-bancaria' },
	{ value: 'banks', name: 'Banks', path: '/banks', anchor: 'obter-listagem-de-bancos' },
	{ value: 'states', name: 'States', path: '/states', anchor: 'obter-dados-de-estados' },
	{ value: 'cities', name: 'Cities', path: '/cities', anchor: 'obter-dados-de-cidades' },
	{ value: 'dismissal-types', name: 'Dismissal Types', path: '/dismissal-types', anchor: 'obter-listagem-de-tipos-de-desligamento' },
	{ value: 'termination-types', name: 'Termination Notice Types', path: '/termination-types', anchor: 'obter-listagem-de-tipos-de-aviso-previo' },
	{ value: 'gender-identities', name: 'Gender Identities', path: '/gender-identities', anchor: 'obter-listagem-de-identidade-de-genero' },
	{ value: 'relation-emergency-contacts', name: 'Emergency Contact Relations', path: '/relation-emergency-contacts', anchor: 'obter-listagem-dos-relacionamentos-de-contatos-de-emergencia' },
	{ value: 'admission-types', name: 'Admission Types', path: '/admission-types', anchor: 'obter-listagem-dos-tipos-de-admissao' },
	{ value: 'disabilities', name: 'Disability Types', path: '/disabilities', anchor: 'obter-listagem-dos-tipos-de-deficiencia' },
	{ value: 'payment-methods', name: 'Payment Methods', path: '/payment-methods', anchor: 'obter-listagem-dos-tipos-de-pagamento' },
	{ value: 'salary-types', name: 'Salary Types', path: '/salary-types', anchor: 'obter-listagem-dos-tipos-de-salario' },
	{ value: 'stability-types', name: 'Stability Types', path: '/stability-types', anchor: 'obter-tipos-de-estabilidade' },
	{ value: 'dependent-relations', name: 'Dependent Relations', path: '/dependent-relations', anchor: 'obter-listagem-dos-relacionamentos-de-dependentes' },
	{ value: 'genders', name: 'Document Genders', path: '/genders', anchor: 'obter-listagem-de-genero-no-documento' },
	{ value: 'visa', name: 'Visas', path: '/visa', anchor: 'obter-listagem-dos-tipos-de-visto-estrangeiro' },
	{ value: 'entry-conditions', name: 'Entry Conditions', path: '/entry-conditions', anchor: 'obter-listagem-das-condicoes-de-ingresso-estrangeiro' },
	{ value: 'residence-time', name: 'Residence Time', path: '/residence-time', anchor: 'obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro' },
	{ value: 'address-description', name: 'Address Descriptions', path: '/address-description', anchor: 'obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro' },
	{ value: 'countries', name: 'Countries', path: '/countries', anchor: 'obter-listagem-das-opcoes-de-paises-estrangeiro' },
	{ value: 'worker-categories', name: 'Worker Categories', path: '/worker-categories', anchor: 'obter-listagem-de-categoria-de-trabalhadores' },
] as const;

export function findCatalog(value: string): CatalogDefinition {
	const found = CATALOGS.find((catalog) => catalog.value === value);
	if (!found) {
		throw new ConveniaInputError(`Catálogo não documentado: ${value}`);
	}
	return found;
}

export interface OptionItem {
	name: string;
	value: string;
}

export function optionsFromCatalogPayload(payload: unknown): OptionItem[] {
	const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : undefined;
	const data = record && 'data' in record ? record.data : payload;
	const rows = Array.isArray(data) ? data : data ? [data] : [];
	const options: OptionItem[] = [];
	for (const row of rows) {
		if (!row || typeof row !== 'object') continue;
		const item = row as Record<string, unknown>;
		if (item.id === undefined || item.name === undefined) continue;
		options.push({ name: String(item.name), value: String(item.id) });
	}
	return options;
}
