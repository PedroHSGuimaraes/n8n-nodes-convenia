const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { buildRequest } = require('../dist/nodes/Convenia/api/buildRequest');
const { operations } = require('../dist/nodes/Convenia/spec/operations');

const E = '11111111-1111-4111-8111-111111111111';
const A = '22222222-2222-4222-8222-222222222222';
const B = '33333333-3333-4333-8333-333333333333';
const C = '44444444-4444-4444-8444-444444444444';

const employee = { employeeId: E };
const page = { paginate: 50, page: 1 };

const admission = {
	name: 'Ana',
	lastName: 'Souza',
	relationshipId: 1,
};
const dismissal = {
	...employee,
	dismissalDate: '2026-03-01',
	dismissalTypeId: 2,
	removeAccessDate: '2026-03-02',
	terminationNoticeTypeId: 3,
};
const salary = {
	...employee,
	salary: '1000.00',
	relationshipId: 1,
	departmentId: A,
	jobId: B,
	costCenterId: C,
	motiveId: 4,
	dateFrom: '2026-01-15',
};
const absence = { ...employee, dateTo: '2026-02-01', dateFrom: '2026-02-10' };
const customFields = {
	...employee,
	customFields: { field: [{ customFieldId: A, textValue: 'valor' }] },
};
const benefitEmployees = {
	benefitId: A,
	employees: { employee: [{ employeeId: E, isActive: true }] },
};
const benefitDependents = {
	benefitId: A,
	dependents: { dependent: [{ employeeId: E, dependentId: B, isActive: false }] },
};

const cases = [
	['employee', 'getAll', {}, { method: 'GET', path: '/employees', retry: 'read', response: 'json', pagination: 'none', query: page }],
	['employee', 'getDismissed', {}, { method: 'GET', path: '/employees/dismissed', retry: 'read', response: 'json', pagination: 'none', query: page }],
	['employee', 'get', employee, { method: 'GET', path: `/employees/${E}`, retry: 'read', response: 'json', pagination: 'none' }],
	['employee', 'getSalaryHistoric', employee, { method: 'GET', path: `/employees/${E}/salaries-historic`, retry: 'read', response: 'json', pagination: 'none' }],
	['employee', 'getDependents', employee, { method: 'GET', path: `/employees/${E}/dependents`, retry: 'read', response: 'json', pagination: 'none' }],
	['employee', 'getChangeHistories', employee, { method: 'GET', path: `/employees/${E}/change-histories`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['employee', 'getChangeHistory', { ...employee, changeId: A }, { method: 'GET', path: `/employees/${E}/change-histories/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['employee', 'startAdmission', admission, { method: 'POST', path: '/employees/admission', retry: 'write', response: 'json', pagination: 'none', body: { name: 'Ana', last_name: 'Souza', relationship_id: 1 } }],
	['employee', 'startDismissal', dismissal, { method: 'POST', path: `/employees/${E}/dismissal`, retry: 'write', response: 'json', pagination: 'none', body: { dismissal_date: '2026-03-01', dismissal_type_id: 2, remove_access_date: '2026-03-02', termination_notice_type_id: 3 } }],
	['employee', 'setCustomFieldValues', customFields, { method: 'POST', path: `/employees/${E}/custom-field-value`, retry: 'write', response: 'json', pagination: 'none', body: { custom_fields: [{ custom_field_id: A, value: 'valor' }] } }],
	['employee', 'update', { ...employee, updateFields: { name: 'Ana' } }, { method: 'PUT', path: `/employees/${E}`, retry: 'write', response: 'empty', pagination: 'none', body: { employee: { name: 'Ana' } } }],
	['employee', 'getBenefits', employee, { method: 'GET', path: `/employees/${E}/benefits`, retry: 'read', response: 'json', pagination: 'none' }],
	['employee', 'uploadDocument', { ...employee, documentType: 'electoral-card', documentId: A }, { method: 'POST', path: `/employees/${E}/electoral-card/${A}/document-files`, retry: 'write', response: 'json', pagination: 'none', multipart: true }],
	['vacation', 'getSolicitations', employee, { method: 'GET', path: `/employees/${E}/vacations/solicitations`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['vacation', 'getSolicitation', { ...employee, solicitationId: A }, { method: 'GET', path: `/employees/${E}/vacations/solicitations/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['vacation', 'downloadSolicitationFile', { ...employee, solicitationId: A, fileId: B }, { method: 'GET', path: `/employees/${E}/vacations/solicitations/${A}/files/${B}`, retry: 'read', response: 'binary', pagination: 'none' }],
	['vacation', 'getPeriods', employee, { method: 'GET', path: `/employees/${E}/vacations/periods`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['vacation', 'getPeriod', { ...employee, periodId: A }, { method: 'GET', path: `/employees/${E}/vacations/periods/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['vacation', 'getCollectiveVacations', {}, { method: 'GET', path: '/companies/collective-vacations', retry: 'read', response: 'json', pagination: 'none', query: page }],
	['vacation', 'getCollectiveVacation', { collectiveId: A }, { method: 'GET', path: `/companies/collective-vacations/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['absence', 'getMotives', {}, { method: 'GET', path: '/employees/absences/motives', retry: 'read', response: 'json', pagination: 'none' }],
	['absence', 'getAll', employee, { method: 'GET', path: `/employees/${E}/absences`, retry: 'read', response: 'json', pagination: 'none' }],
	['absence', 'get', { ...employee, absenceId: A }, { method: 'GET', path: `/employees/${E}/absences/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['absence', 'create', absence, { method: 'POST', path: `/employees/${E}/absences`, retry: 'write', response: 'json', pagination: 'none', body: { date_to: '2026-02-01', date_from: '2026-02-10' } }],
	['absence', 'update', { ...absence, absenceId: A }, { method: 'PUT', path: `/employees/${E}/absences/${A}`, retry: 'write', response: 'json', pagination: 'none', body: { date_to: '2026-02-01', date_from: '2026-02-10' } }],
	['absence', 'delete', { ...employee, absenceId: A }, { method: 'DELETE', path: `/employees/${E}/absences/${A}`, retry: 'write', response: 'empty', pagination: 'none' }],
	['dependent', 'update', { ...employee, dependentId: A, updateFields: { name: 'Lia' } }, { method: 'PUT', path: `/employees/${E}/dependents/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: 'Lia' } }],
	['emergencyContact', 'update', { ...employee, emergencyContactId: A, updateFields: { name: 'Lia' } }, { method: 'PUT', path: `/employees/${E}/emergency-contacts/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: 'Lia' } }],
	['bankAccount', 'update', { ...employee, bankAccountId: A, updateFields: { account: '123' } }, { method: 'PUT', path: `/employees/${E}/bank-accounts/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { account: '123' } }],
	['education', 'create', employee, { method: 'POST', path: `/employees/${E}/educations`, retry: 'write', response: 'json', pagination: 'none', body: { education_type_id: null, course: null, institution: null, graduation_year: null } }],
	['education', 'update', { ...employee, educationId: A, updateFields: { course: 'Letras' } }, { method: 'PUT', path: `/employees/${E}/educations/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { course: 'Letras' } }],
	['education', 'delete', { ...employee, educationId: A }, { method: 'DELETE', path: `/employees/${E}/educations/${A}`, retry: 'write', response: 'empty', pagination: 'none' }],
	['stability', 'create', { ...employee, stabilityTypeId: 7 }, { method: 'POST', path: `/employees/${E}/stabilities`, retry: 'write', response: 'json', pagination: 'none', body: { stability_type_id: 7 } }],
	['stability', 'update', { ...employee, stabilityId: A, updateFields: { observation: 'estavel' } }, { method: 'PUT', path: `/employees/${E}/stabilities/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { observation: 'estavel' } }],
	['stability', 'delete', { ...employee, stabilityId: A }, { method: 'DELETE', path: `/employees/${E}/stabilities/${A}`, retry: 'write', response: 'empty', pagination: 'none' }],
	['salaryRecord', 'create', salary, { method: 'POST', path: `/employees/${E}/salaries-history`, retry: 'write', response: 'json', pagination: 'none', body: { salary: 1000, relationship_id: 1, department_id: A, job_description_id: B, cost_center_id: C, motive_id: 4, date_from: '2026-01-15', date_to: null } }],
	['salaryRecord', 'update', { ...employee, salaryRecordId: A, updateFields: { salary: '10.50' }, dateToMode: 'omit' }, { method: 'PUT', path: `/employees/${E}/salaries-history/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { salary: 10.5 } }],
	['benefit', 'getAll', {}, { method: 'GET', path: '/companies/benefits', retry: 'read', response: 'json', pagination: 'none' }],
	['benefit', 'get', { benefitId: A }, { method: 'GET', path: `/benefits/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['benefit', 'getEmployees', { benefitId: A }, { method: 'GET', path: `/benefits/${A}/employees`, retry: 'read', response: 'json', pagination: 'none', query: {} }],
	['benefit', 'upsertEmployees', benefitEmployees, { method: 'PUT', path: `/companies/benefits/${A}/upsert-employees`, retry: 'write', response: 'json', pagination: 'none', body: { employees: [{ employee_id: E, is_active: true }] } }],
	['benefit', 'upsertDependents', benefitDependents, { method: 'PUT', path: `/companies/benefits/${A}/upsert-dependents`, retry: 'write', response: 'json', pagination: 'none', body: { dependents: [{ employee_id: E, dependent_id: B, is_active: false }] } }],
	['department', 'getAll', {}, { method: 'GET', path: '/companies/departments', retry: 'read', response: 'json', pagination: 'none' }],
	['department', 'create', { name: 'Pessoas' }, { method: 'POST', path: '/companies/departments', retry: 'write', response: 'json', pagination: 'none', body: { name: 'Pessoas' } }],
	['department', 'update', { departmentId: A, name: 'Pessoas' }, { method: 'PUT', path: `/companies/departments/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: 'Pessoas' } }],
	['department', 'delete', { departmentId: A, transferTo: B }, { method: 'DELETE', path: `/companies/departments/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { transfer_to: B } }],
	['costCenter', 'getAll', {}, { method: 'GET', path: '/companies/cost-centers', retry: 'read', response: 'json', pagination: 'none' }],
	['costCenter', 'create', { name: 'Matriz' }, { method: 'POST', path: '/companies/cost-center', retry: 'write', response: 'json', pagination: 'none', body: { name: 'Matriz' } }],
	['costCenter', 'update', { costCenterId: A, name: 'Matriz' }, { method: 'PUT', path: `/companies/cost-centers/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: 'Matriz' } }],
	['costCenter', 'delete', { costCenterId: A, transferTo: B }, { method: 'DELETE', path: `/companies/cost-centers/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: B } }],
	['job', 'getAll', {}, { method: 'GET', path: '/companies/jobs', retry: 'read', response: 'json', pagination: 'none' }],
	['job', 'create', { name: 'Analista', cboCode: '252105' }, { method: 'POST', path: '/companies/jobs', retry: 'write', response: 'json', pagination: 'none', body: { name: 'Analista', cbo_code: '252105' } }],
	['job', 'update', { jobId: A, name: 'Analista', cboCode: '252105' }, { method: 'PUT', path: `/companies/jobs/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { name: 'Analista', cbo_code: '252105' } }],
	['job', 'delete', { jobId: A, transferTo: B }, { method: 'DELETE', path: `/companies/jobs/${A}`, retry: 'write', response: 'empty', pagination: 'none', body: { transfer_to: B } }],
	['team', 'getAll', {}, { method: 'GET', path: '/companies/teams', retry: 'read', response: 'json', pagination: 'none' }],
	['payroll', 'getAll', {}, { method: 'GET', path: '/payrolls', retry: 'read', response: 'json', pagination: 'none', query: page }],
	['payroll', 'get', { payrollId: A }, { method: 'GET', path: `/payrolls/${A}`, retry: 'read', response: 'json', pagination: 'none' }],
	['payroll', 'downloadFile', { payrollId: A, fileId: B }, { method: 'GET', path: `/payrolls/${A}/files/${B}`, retry: 'read', response: 'binary', pagination: 'none' }],
	['payroll', 'getParticipants', { payrollId: A }, { method: 'GET', path: `/payrolls/${A}/participants`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['payroll', 'getEvents', { payrollId: A }, { method: 'GET', path: `/payrolls/${A}/events`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['payroll', 'getEntries', { payrollId: A }, { method: 'GET', path: `/payrolls/${A}/entries`, retry: 'read', response: 'json', pagination: 'none', query: page }],
	['customField', 'getAll', {}, { method: 'GET', path: '/companies/custom-fields', retry: 'read', response: 'json', pagination: 'none' }],
	['catalog', 'get', { catalog: 'ethnicities' }, { method: 'GET', path: '/ethnicities', retry: 'read', response: 'json', pagination: 'none' }],
	['token', 'getPermissions', {}, { method: 'GET', path: '/tokens/permissions', retry: 'read', response: 'json', pagination: 'none', query: page }],
];

describe('roteamento das operações documentadas', () => {
	it('cobre cada operação do spec e nenhuma a mais', () => {
		const fromSpec = operations.map((item) => `${item.resource}.${item.operation}`).sort();
		const fromOracle = cases.map(([resource, operation]) => `${resource}.${operation}`).sort();
		assert.deepEqual(fromOracle, fromSpec);
		assert.equal(fromOracle.length, 64);
	});

	for (const [resource, operation, params, expected] of cases) {
		it(`${resource}.${operation} serializa método, caminho e corpo`, () => {
			const request = buildRequest(resource, operation, params);
			assert.equal(request.method, expected.method);
			assert.equal(request.path, expected.path);
			assert.equal(request.retry, expected.retry);
			assert.equal(request.response, expected.response);
			assert.equal(request.pagination, expected.pagination);
			assert.equal(request.multipart, expected.multipart === true);
			assert.deepEqual(request.query, expected.query ?? {});
			if (expected.body) assert.deepEqual(request.body, expected.body);
			else assert.equal(request.body, undefined);
		});
	}

	it('recusa recurso e operação inexistentes', () => {
		assert.throws(() => buildRequest('ferias', 'get', {}), /Recurso/);
		assert.throws(() => buildRequest('employee', 'approveVacation', employee), /Operação de colaborador/);
	});
});
