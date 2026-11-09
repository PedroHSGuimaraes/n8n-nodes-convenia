const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { buildRequest } = require('../dist/nodes/Convenia/api/buildRequest');
const { appendFilters } = require('../dist/nodes/Convenia/api/filters');
const { CATALOGS } = require('../dist/nodes/Convenia/api/catalogs');
const { zipCode, pathId } = require('../dist/nodes/Convenia/api/values');

const E = '11111111-1111-4111-8111-111111111111';
const A = '22222222-2222-4222-8222-222222222222';

const admission = { name: 'Ana', lastName: 'Souza', relationshipId: 1 };

describe('validação de campos documentados', () => {
	it('exige departamento quando o time é enviado na admissão', () => {
		assert.throws(
			() => buildRequest('employee', 'startAdmission', { ...admission, teamId: A }),
			/departamento/,
		);
	});

	it('exige e-mail pessoal quando o colaborador preenche o formulário', () => {
		assert.throws(
			() => buildRequest('employee', 'startAdmission', { ...admission, employeeFillForm: 'true' }),
			/e-mail pessoal/,
		);
		const request = buildRequest('employee', 'startAdmission', {
			...admission,
			employeeFillForm: 'true',
			personalEmail: 'pessoa@example.com',
			department: 'Pessoas',
			teamId: A,
		});
		assert.equal(request.body.employee_fill_form, true);
		assert.equal(request.body.personal_email, 'pessoa@example.com');
		assert.equal(request.body.department, 'Pessoas');
		assert.equal(request.body.team_id, A);
	});

	it('aceita somente M ou F no sexo da admissão e exige UF da cidade', () => {
		assert.throws(
			() =>
				buildRequest('employee', 'startAdmission', {
					...admission,
					additionalFields: { gender: 'X' },
				}),
			/M ou F/,
		);
		assert.throws(
			() =>
				buildRequest('employee', 'startAdmission', {
					...admission,
					additionalFields: { naturalFromCity: 'Campinas' },
				}),
			/Cidade natal/,
		);
		assert.throws(
			() =>
				buildRequest('employee', 'startAdmission', {
					...admission,
					address: { city: 'Campinas' },
				}),
			/Cidade do endereço/,
		);
		const request = buildRequest('employee', 'startAdmission', {
			...admission,
			additionalFields: { gender: 'F', naturalFromCity: 'Campinas', naturalFromStateUf: 'SP' },
			address: { city: 'Campinas', state: 'SP', zipCode: '01310-100' },
		});
		assert.equal(request.body.gender, 'F');
		assert.equal(request.body.address.zip_code, '01310100');
		assert.equal(request.body.address.city, 'Campinas');
	});

	it('omite atualização vazia e envia false quando o booleano foi adicionado', () => {
		assert.throws(
			() => buildRequest('employee', 'update', { employeeId: E, updateFields: { name: '   ' } }),
			/ao menos um campo/,
		);
		const request = buildRequest('employee', 'update', {
			employeeId: E,
			updateFields: { firstJob: false, zipCode: '01310-100' },
		});
		assert.equal(request.body.professional_information.first_job, false);
		assert.equal(request.body.address.zip_code, '01310100');
		assert.equal(request.body.employee, undefined);
	});

	it('não inventa a chave dependentes no upsert de benefício', () => {
		const request = buildRequest('benefit', 'upsertDependents', {
			benefitId: A,
			dependents: {
				dependent: [{ employeeId: E, dependentId: A, isActive: 'true', dependentCostValue: 15 }],
			},
		});
		assert.equal(request.body.dependentes, undefined);
		assert.equal(request.body.dependents[0].dependent_cost_value, 15);
	});

	it('cria centro de custo no caminho singular e transfere com a chave name', () => {
		assert.equal(buildRequest('costCenter', 'create', { name: 'Filial' }).path, '/companies/cost-center');
		assert.deepEqual(buildRequest('costCenter', 'delete', { costCenterId: A, transferTo: E }).body, { name: E });
	});

	it('envia date_to nulo no salário ativo e recusa observação longa ou datas invertidas', () => {
		const active = buildRequest('salaryRecord', 'create', {
			employeeId: E,
			salary: '10',
			relationshipId: 1,
			departmentId: A,
			jobId: A,
			costCenterId: A,
			motiveId: 1,
			dateFrom: '2026-01-01',
		});
		assert.equal(active.body.date_to, null);
		const closed = buildRequest('salaryRecord', 'update', {
			employeeId: E,
			salaryRecordId: A,
			dateToMode: 'null',
			updateFields: { motiveId: 2 },
		});
		assert.equal(closed.body.date_to, null);
		assert.equal(closed.body.motive_id, 2);
		assert.throws(
			() =>
				buildRequest('stability', 'create', {
					employeeId: E,
					stabilityTypeId: 1,
					observation: 'x'.repeat(221),
				}),
			/220/,
		);
		assert.throws(
			() =>
				buildRequest('stability', 'create', {
					employeeId: E,
					stabilityTypeId: 1,
					dateFrom: '2026-02-02',
					dateTo: '2026-02-01',
				}),
			/data final/,
		);
	});

	it('exige as duas datas na atualização da falta e recusa extensão fora da lista', () => {
		assert.throws(
			() =>
				buildRequest('absence', 'update', {
					employeeId: E,
					absenceId: A,
					dateTo: '2026-02-01',
				}),
			/date_to e date_from/,
		);
		assert.throws(
			() =>
				buildRequest('employee', 'uploadDocument', {
					employeeId: E,
					documentType: 'holerite',
					documentId: A,
				}),
			/não documentado/,
		);
	});

	it('filtra com colchetes, nulo e rejeita mistura', () => {
		const query = {};
		appendFilters(query, {
			condition: [
				{ operator: 'like', field: 'permissions.name', value: 'folha' },
				{ operator: 'match', field: 'id', value: 'a' },
				{ operator: 'match', field: 'id', value: 'b' },
			],
		});
		assert.equal(query['like[permissions][name]'], 'folha');
		assert.equal(query['match[id]'], 'a,b');
		const nulled = {};
		appendFilters(nulled, { condition: [{ operator: 'match', field: 'department_id', nullValue: true }] });
		assert.equal(nulled['match[department_id]'], '%00');
		assert.throws(
			() =>
				appendFilters(
					{},
					{ condition: [{ operator: 'match', field: 'id', value: 'a', nullValue: true }] },
				),
			/nulo/,
		);
	});

	it('envia exatamente um filtro de cidade', () => {
		const byId = buildRequest('catalog', 'get', { catalog: 'cities', cityFilter: 'state_id', stateId: '35' });
		assert.deepEqual(byId.query, { state_id: 35 });
		const byUf = buildRequest('catalog', 'get', {
			catalog: 'cities',
			cityFilter: 'state_abbreviation',
			stateAbbreviation: 'SP',
		});
		assert.deepEqual(byUf.query, { state_abbreviation: 'SP' });
		assert.equal(Object.keys(byUf.query).length, 1);
		assert.equal(CATALOGS.length, 26);
	});

	it('normaliza CEP e recusa ID que alteraria o caminho', () => {
		assert.equal(zipCode('01310-100', 'CEP'), '01310100');
		assert.throws(() => pathId('a/b', 'Colaborador'), /caminho/);
		assert.throws(() => buildRequest('employee', 'get', { employeeId: 'a b' }), /caminho/);
	});

	it('aplica limite, página e envelope sem inventar paginação de benefício', () => {
		const limited = buildRequest('employee', 'getAll', {
			paginate: 20,
			page: 3,
			options: { includeEnvelope: true },
			filters: { condition: [{ field: 'name', operator: 'like', value: 'Ana' }] },
		});
		assert.equal(limited.query.paginate, 20);
		assert.equal(limited.query.page, 3);
		assert.equal(limited.query['like[name]'], 'Ana');
		assert.equal(limited.includeEnvelope, true);
		const all = buildRequest('employee', 'getAll', { returnAll: true, paginate: 10, page: 4, maxPages: 25 });
		assert.equal(all.pagination, 'laravel');
		assert.equal(all.maxPages, 25);
		assert.equal(all.query.paginate, 1000);
		assert.equal(all.query.page, 1);
		const dismissed = buildRequest('employee', 'getDismissed', { fromDate: '2026-01-01', toDate: '2026-01-31' });
		assert.equal(dismissed.query.from_date, '2026-01-01');
		assert.equal(dismissed.query.to_date, '2026-01-31');
		const benefit = buildRequest('benefit', 'getEmployees', { benefitId: A, returnAll: true });
		assert.equal(benefit.pagination, 'benefitEmployees');
		assert.deepEqual(benefit.query, {});
		const permissions = buildRequest('token', 'getPermissions', { returnAll: true });
		assert.equal(permissions.pagination, 'tokenPermissions');
		assert.throws(() => buildRequest('payroll', 'getAll', { paginate: 1001 }), /1000/);
	});
});
