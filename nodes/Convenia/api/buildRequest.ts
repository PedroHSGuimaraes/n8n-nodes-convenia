import { findCatalog } from './catalogs';
import { ConveniaInputError, assertNever } from './errors';
import { appendFilters } from './filters';
import { DEFAULT_MAX_PAGES, type PaginationMode } from './pagination';
import {
	absenceBody,
	admissionBody,
	bankBody,
	benefitDependentsBody,
	benefitEmployeesBody,
	customFieldsBody,
	dependentBody,
	dismissalBody,
	documentType,
	educationCreateBody,
	educationUpdateBody,
	emergencyBody,
	employeeUpdateBody,
	jobBody,
	salaryCreateBody,
	salaryUpdateBody,
	stabilityBody,
} from './payload';
import type { RetryClass } from './retry';
import { limitPage, optionalDate, optionalInt, optionalString, pathId, readOptions, requiredString } from './values';

export interface ConveniaRequest {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query: Record<string, string | number>;
	body?: Record<string, unknown>;
	retry: RetryClass;
	response: 'json' | 'binary' | 'empty';
	pagination: PaginationMode;
	multipart: boolean;
	includeEnvelope: boolean;
	binaryProperty: string;
	fileName?: string;
	maxPages?: number;
}

type Params = Record<string, unknown>;

function envelope(params: Params): boolean {
	return readOptions(params).includeEnvelope === true;
}

function base(params: Params, partial: Omit<ConveniaRequest, 'includeEnvelope' | 'multipart' | 'binaryProperty' | 'query'> & {
	query?: Record<string, string | number>;
	multipart?: boolean;
	binaryProperty?: string;
}): ConveniaRequest {
	return {
		query: partial.query ?? {},
		multipart: partial.multipart ?? false,
		binaryProperty: partial.binaryProperty ?? optionalString(params.binaryProperty) ?? 'data',
		fileName: partial.fileName,
		includeEnvelope: envelope(params),
		method: partial.method,
		path: partial.path,
		body: partial.body,
		retry: partial.retry,
		response: partial.response,
		pagination: partial.pagination,
		maxPages: partial.pagination === 'none' ? undefined : pageCap(params),
	};
}

function pageCap(params: Params): number {
	const parsed = optionalInt(params.maxPages, 'Max Pages');
	const cap = parsed ?? DEFAULT_MAX_PAGES;
	if (cap < 1) throw new ConveniaInputError('Max Pages deve ser um inteiro a partir de 1.');
	return cap;
}

function employeeId(params: Params): string {
	return pathId(params.employeeId, 'Colaborador');
}

function laravel(path: string, params: Params, extra: Record<string, string | number> = {}): ConveniaRequest {
	const page = limitPage(params);
	const query: Record<string, string | number> = { ...extra, paginate: page.paginate, page: page.page };
	appendFilters(query, params.filters);
	return base(params, {
		method: 'GET',
		path,
		query,
		retry: 'read',
		response: 'json',
		pagination: params.returnAll === true ? 'laravel' : 'none',
	});
}

function read(path: string, params: Params, query: Record<string, string | number> = {}): ConveniaRequest {
	return base(params, {
		method: 'GET',
		path,
		query,
		retry: 'read',
		response: 'json',
		pagination: 'none',
	});
}

function write(
	method: 'POST' | 'PUT' | 'DELETE',
	path: string,
	params: Params,
	body: Record<string, unknown> | undefined,
	response: ConveniaRequest['response'],
): ConveniaRequest {
	return base(params, { method, path, body, retry: 'write', response, pagination: 'none' });
}

function binaryDownload(path: string, params: Params): ConveniaRequest {
	return base(params, {
		method: 'GET',
		path,
		retry: 'read',
		response: 'binary',
		pagination: 'none',
		fileName: optionalString(params.fileName),
	});
}

function cityQuery(params: Params): Record<string, string | number> {
	const filter = optionalString(params.cityFilter) ?? 'none';
	switch (filter) {
		case 'none':
			return {};
		case 'state_id': {
			const stateId = optionalString(params.stateId);
			if (!stateId) throw new ConveniaInputError('Informe o ID do estado para filtrar cidades.');
			if (!/^\d+$/.test(stateId)) throw new ConveniaInputError('ID do estado precisa ser inteiro.');
			return { state_id: Number(stateId) };
		}
		case 'state_abbreviation':
			return { state_abbreviation: requiredString(params.stateAbbreviation, 'Sigla do estado') };
		case 'state_name':
			return { state_name: requiredString(params.stateName, 'Nome do estado') };
		default:
			throw new ConveniaInputError('Filtro de cidade não documentado.');
	}
}

function dismissedQuery(params: Params): Record<string, string | number> {
	const query: Record<string, string | number> = {};
	const fromDate = optionalDate(params.fromDate, 'Desligado a partir de');
	const toDate = optionalDate(params.toDate, 'Desligado até');
	if (fromDate) query.from_date = fromDate;
	if (toDate) query.to_date = toDate;
	return query;
}

export function buildRequest(resource: string, operation: string, params: Params): ConveniaRequest {
	switch (resource) {
		case 'employee':
			return employeeRequest(operation, params);
		case 'vacation':
			return vacationRequest(operation, params);
		case 'absence':
			return absenceRequest(operation, params);
		case 'dependent':
			return dependentRequest(operation, params);
		case 'emergencyContact':
			return emergencyRequest(operation, params);
		case 'bankAccount':
			return bankRequest(operation, params);
		case 'education':
			return educationRequest(operation, params);
		case 'stability':
			return stabilityRequest(operation, params);
		case 'salaryRecord':
			return salaryRequest(operation, params);
		case 'benefit':
			return benefitRequest(operation, params);
		case 'department':
			return departmentRequest(operation, params);
		case 'costCenter':
			return costCenterRequest(operation, params);
		case 'job':
			return jobRequest(operation, params);
		case 'team':
			return teamRequest(operation, params);
		case 'payroll':
			return payrollRequest(operation, params);
		case 'customField':
			return customFieldRequest(operation, params);
		case 'catalog':
			return catalogRequest(operation, params);
		case 'token':
			return tokenRequest(operation, params);
		default:
			return assertNever(resource as never, 'Recurso');
	}
}

function employeeRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'getAll':
			return laravel('/employees', params);
		case 'getDismissed':
			return laravel('/employees/dismissed', params, dismissedQuery(params));
		case 'get':
			return read(`/employees/${id()}`, params);
		case 'getSalaryHistoric':
			return read(`/employees/${id()}/salaries-historic`, params);
		case 'getDependents':
			return read(`/employees/${id()}/dependents`, params);
		case 'getChangeHistories':
			return laravel(`/employees/${id()}/change-histories`, params);
		case 'getChangeHistory':
			return read(`/employees/${id()}/change-histories/${pathId(params.changeId, 'Alteração')}`, params);
		case 'startAdmission':
			return write('POST', '/employees/admission', params, admissionBody(params), 'json');
		case 'startDismissal':
			return write('POST', `/employees/${id()}/dismissal`, params, dismissalBody(params), 'json');
		case 'setCustomFieldValues':
			return write('POST', `/employees/${id()}/custom-field-value`, params, customFieldsBody(params), 'json');
		case 'update':
			return write('PUT', `/employees/${id()}`, params, employeeUpdateBody(params), 'empty');
		case 'getBenefits':
			return read(`/employees/${id()}/benefits`, params);
		case 'uploadDocument':
			return base(params, {
				method: 'POST',
				path: `/employees/${id()}/${documentType(params.documentType)}/${pathId(params.documentId, 'ID do documento')}/document-files`,
				retry: 'write',
				response: 'json',
				pagination: 'none',
				multipart: true,
				fileName: optionalString(params.fileName),
			});
		default:
			return assertNever(operation as never, 'Operação de colaborador');
	}
}

function vacationRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'getSolicitations':
			return laravel(`/employees/${id()}/vacations/solicitations`, params);
		case 'getSolicitation':
			return read(`/employees/${id()}/vacations/solicitations/${pathId(params.solicitationId, 'Solicitação')}`, params);
		case 'downloadSolicitationFile':
			return binaryDownload(
				`/employees/${id()}/vacations/solicitations/${pathId(params.solicitationId, 'Solicitação')}/files/${pathId(params.fileId, 'Arquivo')}`,
				params,
			);
		case 'getPeriods':
			return laravel(`/employees/${id()}/vacations/periods`, params);
		case 'getPeriod':
			return read(`/employees/${id()}/vacations/periods/${pathId(params.periodId, 'Período')}`, params);
		case 'getCollectiveVacations':
			return laravel('/companies/collective-vacations', params);
		case 'getCollectiveVacation':
			return read(`/companies/collective-vacations/${pathId(params.collectiveId, 'Coletiva')}`, params);
		default:
			return assertNever(operation as never, 'Operação de férias');
	}
}

function absenceRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'getMotives':
			return read('/employees/absences/motives', params);
		case 'getAll':
			return read(`/employees/${id()}/absences`, params);
		case 'get':
			return read(`/employees/${id()}/absences/${pathId(params.absenceId, 'Falta')}`, params);
		case 'create':
			return write('POST', `/employees/${id()}/absences`, params, absenceBody(params, true), 'json');
		case 'update':
			return write(
				'PUT',
				`/employees/${id()}/absences/${pathId(params.absenceId, 'Falta')}`,
				params,
				absenceBody(params, false),
				'json',
			);
		case 'delete':
			return write('DELETE', `/employees/${id()}/absences/${pathId(params.absenceId, 'Falta')}`, params, undefined, 'empty');
		default:
			return assertNever(operation as never, 'Operação de falta');
	}
}

function dependentRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'update':
			return write(
				'PUT',
				`/employees/${employeeId(params)}/dependents/${pathId(params.dependentId, 'Dependente')}`,
				params,
				dependentBody(params),
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de dependente');
	}
}

function emergencyRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'update':
			return write(
				'PUT',
				`/employees/${employeeId(params)}/emergency-contacts/${pathId(params.emergencyContactId, 'Contato')}`,
				params,
				emergencyBody(params),
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de contato de emergência');
	}
}

function bankRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'update':
			return write(
				'PUT',
				`/employees/${employeeId(params)}/bank-accounts/${pathId(params.bankAccountId, 'Conta')}`,
				params,
				bankBody(params),
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de conta bancária');
	}
}

function educationRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'create':
			return write('POST', `/employees/${id()}/educations`, params, educationCreateBody(params), 'json');
		case 'update':
			return write(
				'PUT',
				`/employees/${id()}/educations/${pathId(params.educationId, 'Formação')}`,
				params,
				educationUpdateBody(params),
				'empty',
			);
		case 'delete':
			return write('DELETE', `/employees/${id()}/educations/${pathId(params.educationId, 'Formação')}`, params, undefined, 'empty');
		default:
			return assertNever(operation as never, 'Operação de formação');
	}
}

function stabilityRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'create':
			return write('POST', `/employees/${id()}/stabilities`, params, stabilityBody(params, true), 'json');
		case 'update':
			return write(
				'PUT',
				`/employees/${id()}/stabilities/${pathId(params.stabilityId, 'Estabilidade')}`,
				params,
				stabilityBody(params, false),
				'empty',
			);
		case 'delete':
			return write('DELETE', `/employees/${id()}/stabilities/${pathId(params.stabilityId, 'Estabilidade')}`, params, undefined, 'empty');
		default:
			return assertNever(operation as never, 'Operação de estabilidade');
	}
}

function salaryRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => employeeId(params);
	switch (operation) {
		case 'create':
			return write('POST', `/employees/${id()}/salaries-history`, params, salaryCreateBody(params), 'json');
		case 'update':
			return write(
				'PUT',
				`/employees/${id()}/salaries-history/${pathId(params.salaryRecordId, 'Registro')}`,
				params,
				salaryUpdateBody(params),
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de vínculo e salário');
	}
}

function benefitRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => pathId(params.benefitId, 'Benefício');
	switch (operation) {
		case 'getAll':
			return read('/companies/benefits', params);
		case 'get':
			return read(`/benefits/${id()}`, params);
		case 'getEmployees':
			return base(params, {
				method: 'GET',
				path: `/benefits/${id()}/employees`,
				retry: 'read',
				response: 'json',
				pagination: params.returnAll === true ? 'benefitEmployees' : 'none',
			});
		case 'upsertEmployees':
			return write('PUT', `/companies/benefits/${id()}/upsert-employees`, params, benefitEmployeesBody(params), 'json');
		case 'upsertDependents':
			return write('PUT', `/companies/benefits/${id()}/upsert-dependents`, params, benefitDependentsBody(params), 'json');
		default:
			return assertNever(operation as never, 'Operação de benefício');
	}
}

function departmentRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getAll':
			return read('/companies/departments', params);
		case 'create':
			return write('POST', '/companies/departments', params, { name: requiredString(params.name, 'Nome') }, 'json');
		case 'update':
			return write(
				'PUT',
				`/companies/departments/${pathId(params.departmentId, 'Departamento')}`,
				params,
				{ name: requiredString(params.name, 'Nome') },
				'empty',
			);
		case 'delete':
			return write(
				'DELETE',
				`/companies/departments/${pathId(params.departmentId, 'Departamento')}`,
				params,
				{ transfer_to: requiredString(params.transferTo, 'Transferir para') },
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de departamento');
	}
}

function costCenterRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getAll':
			return read('/companies/cost-centers', params);
		case 'create':
			return write('POST', '/companies/cost-center', params, { name: requiredString(params.name, 'Nome') }, 'json');
		case 'update':
			return write(
				'PUT',
				`/companies/cost-centers/${pathId(params.costCenterId, 'Centro de custo')}`,
				params,
				{ name: requiredString(params.name, 'Nome') },
				'empty',
			);
		case 'delete':
			return write(
				'DELETE',
				`/companies/cost-centers/${pathId(params.costCenterId, 'Centro de custo')}`,
				params,
				{ name: requiredString(params.transferTo, 'Transferir para') },
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de centro de custo');
	}
}

function jobRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getAll':
			return read('/companies/jobs', params);
		case 'create':
			return write('POST', '/companies/jobs', params, jobBody(params), 'json');
		case 'update':
			return write('PUT', `/companies/jobs/${pathId(params.jobId, 'Cargo')}`, params, jobBody(params), 'empty');
		case 'delete':
			return write(
				'DELETE',
				`/companies/jobs/${pathId(params.jobId, 'Cargo')}`,
				params,
				{ transfer_to: requiredString(params.transferTo, 'Transferir para') },
				'empty',
			);
		default:
			return assertNever(operation as never, 'Operação de cargo');
	}
}

function teamRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getAll':
			return read('/companies/teams', params);
		default:
			return assertNever(operation as never, 'Operação de time');
	}
}

function payrollRequest(operation: string, params: Params): ConveniaRequest {
	const id = () => pathId(params.payrollId, 'Folha');
	switch (operation) {
		case 'getAll':
			return laravel('/payrolls', params);
		case 'get':
			return read(`/payrolls/${id()}`, params);
		case 'downloadFile':
			return binaryDownload(`/payrolls/${id()}/files/${pathId(params.fileId, 'Arquivo')}`, params);
		case 'getParticipants':
			return laravel(`/payrolls/${id()}/participants`, params);
		case 'getEvents':
			return laravel(`/payrolls/${id()}/events`, params);
		case 'getEntries':
			return laravel(`/payrolls/${id()}/entries`, params);
		default:
			return assertNever(operation as never, 'Operação de folha');
	}
}

function customFieldRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getAll':
			return read('/companies/custom-fields', params);
		default:
			return assertNever(operation as never, 'Operação de campo customizado');
	}
}

function catalogRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'get': {
			const catalog = findCatalog(requiredString(params.catalog, 'Catálogo'));
			const query = catalog.value === 'cities' ? cityQuery(params) : {};
			return read(catalog.path, params, query);
		}
		default:
			return assertNever(operation as never, 'Operação de catálogo');
	}
}

function tokenRequest(operation: string, params: Params): ConveniaRequest {
	switch (operation) {
		case 'getPermissions': {
			const page = limitPage(params);
			const query: Record<string, string | number> = { paginate: page.paginate, page: page.page };
			appendFilters(query, params.filters);
			return base(params, {
				method: 'GET',
				path: '/tokens/permissions',
				query,
				retry: 'read',
				response: 'json',
				pagination: params.returnAll === true ? 'tokenPermissions' : 'none',
			});
		}
		default:
			return assertNever(operation as never, 'Operação de token');
	}
}
