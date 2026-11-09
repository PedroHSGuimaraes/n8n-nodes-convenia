import { ConveniaInputError, assertNever } from './errors';
import {
	absenceFields,
	admissionAdditional,
	admissionAddress,
	admissionBank,
	admissionDocuments,
	admissionEducation,
	bankUpdateFields,
	dependentUpdateFields,
	dismissalOptional,
	educationFields,
	emergencyUpdateFields,
	employeeUpdateFields,
	salaryOptional,
	stabilityFields,
	type ApiField,
} from '../spec/fields';
import {
	asRecord,
	assignNested,
	optionalDate,
	optionalDecimal,
	optionalInt,
	optionalString,
	requiredBool,
	requiredDate,
	requiredDecimal,
	requiredInt,
	requiredString,
	rowsOf,
	triBool,
	zipCode,
} from './values';

export { asRecord, rowsOf };

function convertField(field: ApiField, raw: unknown, nullWhenEmpty: boolean): unknown {
	switch (field.kind) {
		case 'string':
		case 'email': {
			const text = optionalString(raw);
			return text === undefined && nullWhenEmpty ? null : text;
		}
		case 'date': {
			const text = optionalDate(raw, field.displayName);
			return text === undefined && nullWhenEmpty ? null : text;
		}
		case 'int': {
			const parsed = optionalInt(raw, field.displayName);
			return parsed === undefined && nullWhenEmpty ? null : parsed;
		}
		case 'decimal': {
			const parsed = optionalDecimal(raw, field.displayName);
			return parsed === undefined && nullWhenEmpty ? null : parsed;
		}
		case 'zip': {
			const text = zipCode(raw, field.displayName);
			return text === undefined && nullWhenEmpty ? null : text;
		}
		case 'boolean':
			if (raw === undefined) return undefined;
			return requiredBool(raw, field.displayName);
		case 'tri':
			return triBool(raw);
		default:
			return assertNever(field.kind, 'Tipo de campo');
	}
}

export function applyFields(
	target: Record<string, unknown>,
	fields: readonly ApiField[],
	source: Record<string, unknown>,
	nullWhenEmpty = false,
): void {
	for (const field of fields) {
		assignNested(target, field.section, field.api, convertField(field, source[field.name], nullWhenEmpty));
	}
}

function assertHasFields(body: Record<string, unknown>, message: string): void {
	if (Object.keys(body).length === 0) throw new ConveniaInputError(message);
}

function requirePair(
	group: Record<string, unknown>,
	presentKey: string,
	requiredKey: string,
	message: string,
): void {
	if (group[presentKey] !== undefined && group[requiredKey] === undefined) {
		throw new ConveniaInputError(message);
	}
}

export function admissionBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {
		name: requiredString(params.name, 'Nome'),
		last_name: requiredString(params.lastName, 'Sobrenome'),
		relationship_id: requiredInt(params.relationshipId, 'Vínculo'),
	};
	const job = optionalString(params.job);
	const department = optionalString(params.department);
	const costCenter = optionalString(params.costCenterId);
	const team = optionalString(params.teamId);
	const hiringDate = optionalDate(params.hiringDate, 'Data de contratação');
	const salary = optionalDecimal(params.salary, 'Salário');
	const fillForm = triBool(params.employeeFillForm);
	const personalEmail = optionalString(params.personalEmail);
	if (job) body.job = job;
	if (department) body.department = department;
	if (costCenter) body.cost_center_id = costCenter;
	if (team) body.team_id = team;
	if (hiringDate) body.hiring_date = hiringDate;
	if (salary !== undefined) body.salary = salary;
	if (fillForm !== undefined) body.employee_fill_form = fillForm;
	if (personalEmail) body.personal_email = personalEmail;
	if (team && !department) {
		throw new ConveniaInputError('A documentação exige o departamento quando o time é enviado.');
	}
	if (fillForm === true && !personalEmail) {
		throw new ConveniaInputError('A documentação exige o e-mail pessoal quando o colaborador preenche o formulário.');
	}
	applyFields(body, admissionAdditional, asRecord(params.additionalFields));
	applyFields(body, admissionDocuments, asRecord(params.documents));
	applyFields(body, admissionAddress, asRecord(params.address));
	applyFields(body, admissionEducation, asRecord(params.education));
	applyFields(body, admissionBank, asRecord(params.bankAccount));
	const gender = optionalString(body.gender);
	if (gender && gender !== 'M' && gender !== 'F') {
		throw new ConveniaInputError('Sexo da admissão aceita M ou F.');
	}
	const hasNaturalCity = optionalString(body.natural_from_city) || body.natural_from_city_id !== undefined;
	if (hasNaturalCity && !optionalString(body.natural_from_state_uf) && body.natural_from_state_id === undefined) {
		throw new ConveniaInputError(
			'Cidade natal exige UF natal ou o ID do estado natal, conforme a documentação.',
		);
	}
	const address = asRecord(body.address);
	const hasCity = optionalString(address.city) || address.city_id !== undefined;
	if (hasCity && !optionalString(address.state) && address.state_id === undefined) {
		throw new ConveniaInputError('Cidade do endereço exige UF ou o ID do estado, conforme a documentação.');
	}
	return body;
}

export function dismissalBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {
		dismissal_date: requiredDate(params.dismissalDate, 'Data final'),
		dismissal_type_id: requiredInt(params.dismissalTypeId, 'Tipo de desligamento'),
		remove_access_date: requiredDate(params.removeAccessDate, 'Remoção de acesso'),
		termination_notice_type_id: requiredInt(params.terminationNoticeTypeId, 'Tipo de aviso prévio'),
	};
	applyFields(body, dismissalOptional, asRecord(params.additionalFields));
	return body;
}

export function employeeUpdateBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	applyFields(body, employeeUpdateFields, asRecord(params.updateFields));
	assertHasFields(body, 'Adicione ao menos um campo com valor para atualizar o colaborador.');
	const address = asRecord(body.address);
	requirePair(address, 'city_id', 'state_id', 'A documentação exige o estado quando a cidade do endereço é enviada.');
	const personal = asRecord(body.personal_information);
	requirePair(
		personal,
		'birth_city_id',
		'birth_state_id',
		'A documentação exige o estado natal quando a cidade natal é enviada.',
	);
	const electoral = asRecord(body.electoral_card);
	requirePair(
		electoral,
		'city_id',
		'state_id',
		'A documentação exige o estado do título quando a cidade do título é enviada.',
	);
	const foreign = asRecord(body.foreign);
	const foreignKeys = Object.keys(foreign).filter((key) => key !== 'lives_in_brazil');
	if (foreignKeys.length > 0 && foreign.lives_in_brazil === undefined) {
		throw new ConveniaInputError(
			'A documentação exige lives_in_brazil quando qualquer outro dado de estrangeiro é enviado.',
		);
	}
	return body;
}

export function collectionUpdate(
	params: Record<string, unknown>,
	fields: readonly ApiField[],
	message: string,
): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	applyFields(body, fields, asRecord(params.updateFields));
	assertHasFields(body, message);
	return body;
}

export function dependentBody(params: Record<string, unknown>): Record<string, unknown> {
	return collectionUpdate(params, dependentUpdateFields, 'Adicione ao menos um campo do dependente.');
}

export function emergencyBody(params: Record<string, unknown>): Record<string, unknown> {
	return collectionUpdate(params, emergencyUpdateFields, 'Adicione ao menos um campo do contato.');
}

export function bankBody(params: Record<string, unknown>): Record<string, unknown> {
	const body = collectionUpdate(params, bankUpdateFields, 'Adicione ao menos um campo da conta.');
	const modality = optionalString(body.modality);
	if (modality && modality !== 'PF' && modality !== 'PJ') {
		throw new ConveniaInputError('Modalidade aceita PF ou PJ.');
	}
	return body;
}

export function educationCreateBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	applyFields(body, educationFields, params, true);
	return body;
}

export function educationUpdateBody(params: Record<string, unknown>): Record<string, unknown> {
	return collectionUpdate(params, educationFields, 'Adicione ao menos um campo da formação.');
}

function assertDateOrder(from: unknown, to: unknown, label: string): void {
	if (typeof from === 'string' && typeof to === 'string' && to < from) {
		throw new ConveniaInputError(`${label}: a data final não pode ser anterior à data inicial.`);
	}
}

export function stabilityBody(params: Record<string, unknown>, create: boolean): Record<string, unknown> {
	const source = create ? params : asRecord(params.updateFields);
	const body: Record<string, unknown> = {};
	if (create) {
		body.stability_type_id = requiredInt(params.stabilityTypeId, 'Tipo de estabilidade');
		const dateFrom = optionalDate(params.dateFrom, 'Data inicial');
		const dateTo = optionalDate(params.dateTo, 'Data final');
		const observation = optionalString(params.observation);
		if (dateFrom) body.date_from = dateFrom;
		if (dateTo) body.date_to = dateTo;
		if (observation) body.observation = observation;
	} else {
		applyFields(body, stabilityFields, source);
		assertHasFields(body, 'Adicione ao menos um campo da estabilidade.');
	}
	const observation = optionalString(body.observation);
	if (observation && observation.length > 220) {
		throw new ConveniaInputError('Observação da estabilidade aceita no máximo 220 caracteres.');
	}
	assertDateOrder(body.date_from, body.date_to, 'Estabilidade');
	return body;
}

export function salaryCreateBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {
		salary: requiredDecimal(params.salary, 'Salário'),
		relationship_id: requiredInt(params.relationshipId, 'Vínculo'),
		department_id: requiredString(params.departmentId, 'Departamento'),
		job_description_id: requiredString(params.jobId, 'Cargo'),
		cost_center_id: requiredString(params.costCenterId, 'Centro de custo'),
		motive_id: requiredInt(params.motiveId, 'Motivo'),
		date_from: requiredDate(params.dateFrom, 'Data inicial'),
	};
	const team = optionalString(params.teamId);
	if (team) body.team_id = team;
	if (params.activeRecord === false) {
		body.date_to = requiredDate(params.dateTo, 'Data final');
	} else {
		body.date_to = null;
	}
	applyFields(body, salaryOptional, asRecord(params.additionalFields));
	assertDateOrder(body.date_from, body.date_to, 'Vínculo e salário');
	return body;
}

export function salaryUpdateBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	const fields = [
		...employeeSalaryUpdateFields(),
	];
	applyFields(body, fields, asRecord(params.updateFields));
	const mode = optionalString(params.dateToMode) ?? 'omit';
	switch (mode) {
		case 'omit':
			break;
		case 'null':
			body.date_to = null;
			break;
		case 'date':
			body.date_to = requiredDate(params.dateTo, 'Data final');
			break;
		default:
			throw new ConveniaInputError('Modo de data final não suportado.');
	}
	assertHasFields(body, 'Adicione ao menos um campo do registro salarial.');
	assertDateOrder(body.date_from, body.date_to, 'Vínculo e salário');
	return body;
}

function employeeSalaryUpdateFields(): ApiField[] {
	return [
		{ name: 'salary', api: 'salary', displayName: 'Salary', description: 'Salary.', kind: 'decimal' },
		{ name: 'relationshipId', api: 'relationship_id', displayName: 'Relationship', description: 'relationship_id.', kind: 'int' },
		{ name: 'motiveId', api: 'motive_id', displayName: 'Motive', description: 'motive_id.', kind: 'int' },
		{ name: 'dateFrom', api: 'date_from', displayName: 'Start Date', description: 'date_from.', kind: 'date' },
		{ name: 'workerCategoryId', api: 'worker_category_id', displayName: 'Worker Category', description: 'worker_category_id.', kind: 'int' },
		{ name: 'departmentId', api: 'department_id', displayName: 'Department', description: 'department_id.', kind: 'string' },
		{ name: 'jobId', api: 'job_description_id', displayName: 'Job', description: 'job_description_id.', kind: 'string' },
		{ name: 'costCenterId', api: 'cost_center_id', displayName: 'Cost Center', description: 'cost_center_id.', kind: 'string' },
		{ name: 'teamId', api: 'team_id', displayName: 'Team', description: 'team_id.', kind: 'string' },
	];
}

export function absenceBody(params: Record<string, unknown>, create: boolean): Record<string, unknown> {
	const body: Record<string, unknown> = {};
	const dateTo = optionalDate(params.dateTo, 'date_to');
	const dateFrom = optionalDate(params.dateFrom, 'date_from');
	if (create) {
		body.date_to = requiredDate(params.dateTo, 'date_to');
		body.date_from = requiredDate(params.dateFrom, 'date_from');
	} else {
		if ((dateTo && !dateFrom) || (!dateTo && dateFrom)) {
			throw new ConveniaInputError('A documentação exige date_to e date_from juntos na atualização da falta.');
		}
		if (dateTo) body.date_to = dateTo;
		if (dateFrom) body.date_from = dateFrom;
	}
	applyFields(body, absenceFields, asRecord(params.additionalFields));
	if (!create) assertHasFields(body, 'Adicione ao menos um campo da falta.');
	return body;
}

export function customFieldsBody(params: Record<string, unknown>): Record<string, unknown> {
	const rows = rowsOf(params.customFields, 'field');
	if (rows.length === 0) throw new ConveniaInputError('Adicione ao menos um campo customizado.');
	const customFields = rows.map((row) => {
		const id = locatorText(row.customFieldId, 'Campo customizado');
		const mode = optionalString(row.valueMode) ?? 'text';
		if (mode === 'multiple') {
			const options = rowsOf(row.multipleValues, 'option')
				.map((option) => optionalString(option.value))
				.filter((value): value is string => !!value);
			if (options.length === 0) throw new ConveniaInputError('Informe ao menos uma opção da múltipla escolha.');
			return { custom_field_id: id, value: options };
		}
		if (mode !== 'text') throw new ConveniaInputError('Tipo de valor de campo customizado não suportado.');
		const text = optionalString(row.textValue);
		if (!text) throw new ConveniaInputError('Informe o valor do campo customizado.');
		return { custom_field_id: id, value: text };
	});
	return { custom_fields: customFields };
}

export function locatorText(value: unknown, label: string): string {
	if (value && typeof value === 'object' && 'value' in (value as Record<string, unknown>)) {
		return requiredString((value as Record<string, unknown>).value, label);
	}
	return requiredString(value, label);
}

function optionalCost(value: unknown, label: string): number | undefined {
	return optionalInt(value, label);
}

function benefitRow(row: Record<string, unknown>, dependent: boolean): Record<string, unknown> {
	const item: Record<string, unknown> = {
		employee_id: requiredString(row.employeeId, 'Colaborador'),
		is_active: requiredBool(row.isActive, 'Ativo'),
	};
	if (dependent) item.dependent_id = requiredString(row.dependentId, 'Dependente');
	const company = optionalCost(row.companyCostValue, 'Custo da empresa');
	const employee = optionalCost(row.employeeCostValue, 'Custo do colaborador');
	const dependentCost = optionalCost(row.dependentCostValue, 'Custo do dependente');
	const plan = optionalString(row.planId);
	const card = optionalString(row.cardNumber);
	const coparticipation = triBool(row.coparticipation);
	if (company !== undefined) item.company_cost_value = company;
	if (!dependent && employee !== undefined) item.employee_cost_value = employee;
	if (dependent && dependentCost !== undefined) item.dependent_cost_value = dependentCost;
	if (plan) item.plan_id = plan;
	if (card) item.card_number = card;
	if (coparticipation !== undefined) item.coparticipation = coparticipation;
	return item;
}

export function benefitEmployeesBody(params: Record<string, unknown>): Record<string, unknown> {
	const rows = rowsOf(params.employees, 'employee');
	if (rows.length === 0) throw new ConveniaInputError('Adicione ao menos um colaborador.');
	return { employees: rows.map((row) => benefitRow(row, false)) };
}

export function benefitDependentsBody(params: Record<string, unknown>): Record<string, unknown> {
	const rows = rowsOf(params.dependents, 'dependent');
	if (rows.length === 0) throw new ConveniaInputError('Adicione ao menos um dependente.');
	return { dependents: rows.map((row) => benefitRow(row, true)) };
}

export function jobBody(params: Record<string, unknown>): Record<string, unknown> {
	const body: Record<string, unknown> = {
		name: requiredString(params.name, 'Nome'),
		cbo_code: requiredString(params.cboCode, 'CBO'),
	};
	const description = optionalString(params.description);
	const apprentice = triBool(params.apprenticeQuota);
	if (description) body.description = description;
	if (apprentice !== undefined) body.apprentice_quota = apprentice;
	return body;
}

export const DOCUMENT_TYPES = ['cpf', 'ctps', 'rg', 'driver-license', 'reservist', 'electoral-card'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export function documentType(value: unknown): DocumentType {
	const text = requiredString(value, 'Tipo de documento');
	const found = DOCUMENT_TYPES.find((item) => item === text);
	if (!found) throw new ConveniaInputError('Tipo de documento não documentado para upload.');
	return found;
}

export const DOCUMENT_EXTENSIONS = [
	'pdf',
	'doc',
	'docx',
	'xlsx',
	'xls',
	'ppt',
	'pptx',
	'txt',
	'gif',
	'jpeg',
	'jpg',
	'png',
	'zip',
	'rar',
	'gz',
] as const;

export function safeUploadName(fileName: string): string {
	const base = fileName.split(/[/\\]/).pop() ?? '';
	const cleaned = base.replace(/[\r\n"]/g, '').trim();
	if (!cleaned || cleaned === '.' || cleaned === '..') {
		throw new ConveniaInputError('Informe o nome do arquivo do anexo.');
	}
	const extension = cleaned.includes('.') ? cleaned.split('.').pop()?.toLowerCase() : '';
	if (!extension || !DOCUMENT_EXTENSIONS.includes(extension as (typeof DOCUMENT_EXTENSIONS)[number])) {
		throw new ConveniaInputError(
			`A documentação lista estas extensões para o anexo: ${DOCUMENT_EXTENSIONS.join(', ')}.`,
		);
	}
	return cleaned;
}
