import {
	NodeOperationError,
	type ILoadOptionsFunctions,
	type INodeListSearchResult,
	type INodePropertyOptions,
} from 'n8n-workflow';

import { CATALOGS, optionsFromCatalogPayload } from './api/catalogs';
import { safeApiMessage } from './api/redact';
import {
	employeeSearchQuery,
	filterResults,
	namedLabel,
	pageNumber,
	pagedQuery,
	personLabel,
	plainQuery,
	toSearchPage,
} from './api/search';
import { assertBaseUrl, limiterFor, REQUEST_TIMEOUT_MS, type RawResponse } from './api/transport';

async function authedGet(this: ILoadOptionsFunctions, path: string, query?: Record<string, string | number>): Promise<unknown> {
	const credentials = await this.getCredentials('conveniaApi');
	const baseUrl = assertBaseUrl(credentials.baseUrl);
	const credentialId = this.getNode().credentials?.conveniaApi?.id;
	await limiterFor(typeof credentialId === 'string' ? credentialId : undefined).take();
	const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'conveniaApi', {
		method: 'GET',
		url: `${baseUrl}${path}`,
		qs: query,
		json: true,
		timeout: REQUEST_TIMEOUT_MS,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	})) as RawResponse;
	if (response.statusCode >= 400) {
		const retryAfter = response.headers?.['retry-after'];
		throw new NodeOperationError(
			this.getNode(),
			safeApiMessage(response.statusCode, response.body, Array.isArray(retryAfter) ? retryAfter[0] : retryAfter),
		);
	}
	return response.body;
}

async function loadCatalog(this: ILoadOptionsFunctions, catalog: string): Promise<INodePropertyOptions[]> {
	const definition = CATALOGS.find((item) => item.value === catalog);
	if (!definition) {
		throw new NodeOperationError(this.getNode(), `Catálogo não documentado: ${catalog}`);
	}
	const body = await authedGet.call(this, definition.path);
	return optionsFromCatalogPayload(body);
}

async function searchPath(
	this: ILoadOptionsFunctions,
	path: string,
	query: Record<string, string | number>,
	label: 'person' | 'named',
	paged: boolean,
	filter?: string,
): Promise<INodeListSearchResult> {
	const body = await authedGet.call(this, path, Object.keys(query).length > 0 ? query : undefined);
	const page = toSearchPage(body, label === 'person' ? personLabel : namedLabel, paged);
	return label === 'person' ? page : filterResults(page, filter);
}

export const loadOptions = {
	loadEthnicities(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'ethnicities');
	},
	loadNationalities(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'nationalities');
	},
	loadRelationships(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'relationships');
	},
	loadMaritalStatus(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'marital-status');
	},
	loadEducations(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'educations');
	},
	loadBankAccountTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'bank-accounts');
	},
	loadBanks(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'banks');
	},
	loadStates(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'states');
	},
	loadDismissalTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'dismissal-types');
	},
	loadTerminationTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'termination-types');
	},
	loadGenderIdentities(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'gender-identities');
	},
	loadEmergencyRelations(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'relation-emergency-contacts');
	},
	loadAdmissionTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'admission-types');
	},
	loadDisabilities(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'disabilities');
	},
	loadPaymentMethods(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'payment-methods');
	},
	loadSalaryTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'salary-types');
	},
	loadStabilityTypes(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'stability-types');
	},
	loadDependentRelations(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'dependent-relations');
	},
	loadGenders(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'genders');
	},
	loadVisa(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'visa');
	},
	loadEntryConditions(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'entry-conditions');
	},
	loadResidenceTime(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'residence-time');
	},
	loadAddressDescriptions(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'address-description');
	},
	loadCountries(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'countries');
	},
	loadWorkerCategories(this: ILoadOptionsFunctions) {
		return loadCatalog.call(this, 'worker-categories');
	},
};

export const listSearch = {
	async searchEmployees(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) {
		const query = employeeSearchQuery(filter, pageNumber(paginationToken));
		return searchPath.call(this, query.path, query.query, 'person', true);
	},
	async searchDepartments(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/departments');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchJobs(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/jobs');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchCostCenters(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/cost-centers');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchTeams(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/teams');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchBenefits(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/benefits');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchCustomFields(this: ILoadOptionsFunctions, filter?: string) {
		const query = plainQuery('/companies/custom-fields');
		return searchPath.call(this, query.path, query.query, 'named', false, filter);
	},
	async searchPayrolls(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) {
		const query = pagedQuery('/payrolls', pageNumber(paginationToken));
		return searchPath.call(this, query.path, query.query, 'named', true, filter);
	},
};
