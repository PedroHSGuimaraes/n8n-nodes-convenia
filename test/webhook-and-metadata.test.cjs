const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { describe, it } = require('node:test');

const { Convenia } = require('../dist/nodes/Convenia/Convenia.node');
const { ConveniaTrigger } = require('../dist/nodes/ConveniaTrigger/ConveniaTrigger.node');
const { ConveniaApi } = require('../dist/credentials/ConveniaApi.credentials');
const { ConveniaWebhookApi } = require('../dist/credentials/ConveniaWebhookApi.credentials');
const { operations } = require('../dist/nodes/Convenia/spec/operations');
const { CATALOGS } = require('../dist/nodes/Convenia/api/catalogs');
const { WEBHOOK_EVENTS, SIGNATURE_CHECK, evaluateWebhook, signWebhook } = require('../dist/nodes/Convenia/api/webhook');

const DOCUMENTED_PATHS = [
	'/ethnicities',
	'/nationalities',
	'/relationships',
	'/marital-status',
	'/educations',
	'/bank-accounts',
	'/banks',
	'/states',
	'/cities',
	'/dismissal-types',
	'/termination-types',
	'/gender-identities',
	'/relation-emergency-contacts',
	'/admission-types',
	'/disabilities',
	'/payment-methods',
	'/salary-types',
	'/stability-types',
	'/dependent-relations',
	'/genders',
	'/visa',
	'/entry-conditions',
	'/residence-time',
	'/address-description',
	'/countries',
	'/worker-categories',
	'/tokens/permissions',
	'/employees',
	'/employees/dismissed',
	'/employees/{id}',
	'/employees/{id}/salaries-historic',
	'/employees/{id}/dependents',
	'/employees/{id}/vacations/solicitations',
	'/employees/{id}/vacations/solicitations/{solicitationId}',
	'/employees/{id}/vacations/solicitations/{solicitationId}/files/{fileId}',
	'/employees/{id}/vacations/periods',
	'/employees/{id}/vacations/periods/{periodId}',
	'/employees/{id}/change-histories',
	'/employees/{id}/change-histories/{changeId}',
	'/employees/admission',
	'/employees/{id}/dismissal',
	'/employees/{id}/custom-field-value',
	'/employees/{id}/benefits',
	'/employees/{id}/{documentType}/{documentId}/document-files',
	'/employees/{id}/dependents/{dependentId}',
	'/employees/{id}/emergency-contacts/{contactId}',
	'/employees/{id}/bank-accounts/{accountId}',
	'/employees/{id}/educations',
	'/employees/{id}/educations/{educationId}',
	'/employees/{id}/stabilities',
	'/employees/{id}/stabilities/{stabilityId}',
	'/employees/{id}/salaries-history',
	'/employees/{id}/salaries-history/{salaryRecordId}',
	'/employees/absences/motives',
	'/employees/{id}/absences',
	'/employees/{id}/absences/{absenceId}',
	'/companies/custom-fields',
	'/companies/collective-vacations',
	'/companies/collective-vacations/{collectiveId}',
	'/companies/benefits',
	'/benefits/{id}',
	'/benefits/{id}/employees',
	'/companies/benefits/{id}/upsert-employees',
	'/companies/benefits/{id}/upsert-dependents',
	'/companies/teams',
	'/companies/departments',
	'/companies/cost-centers',
	'/companies/cost-center',
	'/companies/cost-centers/{id}',
	'/companies/jobs',
	'/companies/jobs/{id}',
	'/payrolls',
	'/payrolls/{id}',
	'/payrolls/{id}/files/{fileId}',
	'/payrolls/{id}/participants',
	'/payrolls/{id}/events',
	'/payrolls/{id}/entries',
];

const H2_ANCHORS = [
	'obter-dados-de-etnias',
	'obter-dados-de-nacionalidades',
	'obter-dados-de-vinculos-empregaticios',
	'obter-dados-de-estado-civil',
	'obter-dados-de-tipo-de-escolaridade',
	'obter-dados-de-tipo-da-conta-bancaria',
	'obter-listagem-de-bancos',
	'obter-dados-de-estados',
	'obter-dados-de-cidades',
	'obter-listagem-de-tipos-de-desligamento',
	'obter-listagem-de-tipos-de-aviso-previo',
	'obter-listagem-de-identidade-de-genero',
	'obter-listagem-dos-relacionamentos-de-contatos-de-emergencia',
	'obter-listagem-dos-tipos-de-admissao',
	'obter-listagem-dos-tipos-de-deficiencia',
	'obter-listagem-dos-tipos-de-pagamento',
	'obter-listagem-dos-tipos-de-salario',
	'obter-tipos-de-estabilidade',
	'obter-listagem-dos-relacionamentos-de-dependentes',
	'obter-listagem-de-genero-no-documento',
	'obter-listagem-dos-tipos-de-visto-estrangeiro',
	'obter-listagem-das-condicoes-de-ingresso-estrangeiro',
	'obter-listagem-das-opcoes-de-tempo-de-residencia-no-brasil-estrangeiro',
	'obter-listagem-das-opcoes-de-descricao-do-logradouro-estrangeiro',
	'obter-listagem-das-opcoes-de-paises-estrangeiro',
	'obter-listagem-de-categoria-de-trabalhadores',
	'detalhe-de-um-token',
	'obter-todos-os-colaboradores',
	'obter-todos-os-colaboradores-desligados',
	'obter-um-colaborador-especifico',
	'obter-o-historico-salarial-de-um-colaborador',
	'obter-dependentes-relacionados-a-um-colaborador',
	'obter-solicitacoes-de-ferias-relacionadas-a-um-colaborador',
	'obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador',
	'obter-arquivo-de-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador',
	'obter-periodos-aquisitivos-de-ferias-relacionados-a-um-colaborador',
	'obter-periodo-aquisitivo-de-ferias-especifico-relacionado-a-um-colaborador',
	'obter-alteracoes-relacionadas-a-um-colaborador',
	'obter-alteracao-especifica-relacionadas-a-um-colaborador',
	'iniciar-a-admissao-de-um-colaborador',
	'iniciar-o-desligamento-de-um-colaborador',
	'atribuir-valor-a-campos-customizados',
	'atualizar-dados-do-colaborador',
	'obter-beneficios-v2-de-um-colaborador-especifico',
	'upload-de-anexos-de-documentos-pessoais',
	'atualizar-dados-de-dependente',
	'atualizar-dados-de-contatos-de-emergencia',
	'atualizar-dados-bancarios',
	'criar-informacao-academica',
	'atualizar-informacao-academica',
	'exclusao-de-informacao-academica',
	'criar-estabilidade',
	'atualizar-estabilidade',
	'exclusao-de-estabilidade',
	'criar-registro-de-vinculo-e-salario',
	'atualizar-registro-de-vinculo-e-salario',
	'obter-todos-os-motivos-de-faltas-e-afastamentos-para-um-colaborador',
	'obter-todos-os-tipos-de-faltas-e-afastamentos-para-um-colaborador',
	'obter-todas-as-faltas-e-afastamentos-de-um-colaborador',
	'obter-uma-falta-afastamento-de-um-colaborador',
	'criar-uma-falta-afastamento-para-um-colaborador',
	'atualizar-uma-falta-afastamento-para-um-colaborador',
	'deletar-uma-falta-afastamento-de-um-colaborador',
	'obter-todos-os-campos-customizados',
	'obter-solicitacoes-de-ferias-coletivas-da-empresa',
	'obter-solicitacao-de-ferias-especifica-relacionada-a-um-colaborador-2',
	'obter-beneficios-de-uma-empresa',
	'obter-beneficio-especifico-de-uma-empresa',
	'obter-colaboradores-vinculados-a-um-beneficio-de-uma-empresa',
	'vincular-desvincular-colaboradores-a-beneficios',
	'vincular-desvincular-dependentes-a-beneficios',
	'obter-todos-os-times',
	'obter-todos-os-departamentos',
	'criar-um-departamento',
	'atualizar-um-departamento',
	'deletar-um-departamento',
	'obter-todos-os-centros-de-custo',
	'criar-um-centro-de-custo',
	'atualizar-um-centro-de-custo',
	'deletar-um-centro-de-custo',
	'obter-todos-os-cargos',
	'criar-um-cargo',
	'atualizar-um-cargo',
	'deletar-um-cargo',
	'obter-todas-as-folhas-da-empresa',
	'obter-folha-especifica-de-uma-empresa',
	'obter-arquivo-de-folha-especifica-da-empresa',
	'obter-participantes-de-folha-especifica-da-empresa',
	'obter-eventos-de-folha-especifica-da-empresa',
	'obter-lancamentos-de-folha-especifica-da-empresa',
	'admissao-iniciada',
	'admissao-finalizada',
	'desligamento',
	'desligamento-aguardando-contabilidade',
	'criacao-de-ferias',
	'aprovacao-de-ferias',
	'atualizacao-de-ferias',
	'alteracao-no-perfil-de-colaboradores',
	'alteracao-de-dados-salariais',
	'criacao-de-faltas-e-afastamentos',
	'atualizacao-de-faltas-e-afastamentos',
	'delecao-de-faltas-e-afastamentos',
	'aniversariantes-do-dia',
];

function signed(secret, body) {
	const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
	return { rawBody, signature: signWebhook(secret, rawBody) };
}

describe('webhook', () => {
	const secret = 'segredo-de-teste';

	it('aceita vacation.created assinado e rejeita assinatura, corpo e content-type', () => {
		const payload = signed(secret, { type: 'vacation.created', id: '1' });
		const accepted = evaluateWebhook({
			...payload,
			contentType: 'application/json; charset=utf-8',
			secret,
			allowed: [],
		});
		assert.equal(accepted.ok, true);
		assert.equal(accepted.event, 'vacation.created');
		const badSignature = evaluateWebhook({
			rawBody: payload.rawBody,
			signature: '0'.repeat(64),
			contentType: 'application/json',
			secret,
			allowed: [],
		});
		assert.equal(badSignature.ok, false);
		assert.equal(badSignature.status, 401);
		const unsigned = evaluateWebhook({
			rawBody: payload.rawBody,
			signature: undefined,
			contentType: 'application/json',
			secret,
			allowed: [],
		});
		assert.equal(unsigned.status, 401);
		const missing = evaluateWebhook({
			rawBody: undefined,
			signature: payload.signature,
			contentType: 'application/json',
			secret,
			allowed: [],
		});
		assert.equal(missing.status, 400);
		const type = evaluateWebhook({
			...payload,
			contentType: '',
			secret,
			allowed: [],
		});
		assert.equal(type.status, 415);
	});

	it('não descarta payload idêntico e não classifica aniversário sem type', () => {
		assert.equal(SIGNATURE_CHECK, 'unverified-spatie-default');
		const payload = signed(secret, { type: 'admission.started', employee: { id: '1' } });
		const first = evaluateWebhook({ ...payload, contentType: 'application/json', secret, allowed: [] });
		const again = evaluateWebhook({ ...payload, contentType: 'application/json', secret, allowed: [] });
		assert.equal(first.ok, true);
		assert.equal(again.ok, true);
		assert.equal(again.event, 'admission.started');
		const filtered = evaluateWebhook({
			...signed(secret, { type: 'vacation.approved' }),
			contentType: 'application/json',
			secret,
			allowed: ['admission.started'],
		});
		assert.equal(filtered.ignored, true);
		const birthday = `{
  "employee_ids":
  {
    "40ed29b4-b815-41d8-b801-fe267c68bede",
    "695e83b3-97a3-474c-b529-8b6314358eed"
  }
}`;
		const invalid = evaluateWebhook({
			rawBody: birthday,
			signature: signWebhook(secret, birthday),
			contentType: 'application/json',
			secret,
			allowed: [],
		});
		assert.equal(invalid.status, 400);
		const withoutType = evaluateWebhook({
			...signed(secret, { employee_ids: ['1'] }),
			contentType: 'application/json',
			secret,
			allowed: [],
		});
		assert.equal(withoutType.ok, false);
		assert.equal(withoutType.status, 400);
		assert.match(withoutType.message, /não é classificado como evento/);
	});

	it('o ciclo de vida não chama a API e a assinatura diferencia maiúsculas do header', async () => {
		const trigger = new ConveniaTrigger();
		assert.equal(await trigger.webhookMethods.default.checkExists.call({}), true);
		assert.equal(await trigger.webhookMethods.default.create.call({}), true);
		assert.equal(await trigger.webhookMethods.default.delete.call({}), true);
		const responses = [];
		const payload = signed(secret, { type: 'employee.edited', sections: ['employees'] });
		const context = {
			getCredentials: async () => ({ secret }),
			getNodeParameter: () => [],
			getRequestObject: () => ({ rawBody: payload.rawBody }),
		};
		const result = await trigger.webhook.call({
			...context,
			getHeaderData: () => ({ Signature: payload.signature, 'Content-Type': 'application/json' }),
			getResponseObject: () => ({
				status(code) {
					return { json(body) { responses.push({ code, body }); } };
				},
			}),
		});
		assert.equal(result.workflowData[0][0].json.event, 'employee.edited');
		assert.equal(responses.length, 0);
		const repeated = await trigger.webhook.call({
			...context,
			getHeaderData: () => ({ signature: payload.signature, 'content-type': 'application/json' }),
			getResponseObject: () => ({
				status(code) {
					return { json(body) { responses.push({ code, body }); } };
				},
			}),
		});
		assert.equal(repeated.workflowData[0][0].json.event, 'employee.edited');
		const rejected = await trigger.webhook.call({
			...context,
			getHeaderData: () => ({ signature: 'errada', 'content-type': 'application/json' }),
			getResponseObject: () => ({
				status(code) {
					return { json(body) { responses.push({ code, body }); } };
				},
			}),
		});
		assert.equal(rejected.workflowData, undefined);
		assert.equal(rejected.noWebhookResponse, true);
		assert.equal(responses[0].code, 401);
		const emptySecret = await trigger.methods.credentialTest.conveniaWebhookApiTest.call({}, { data: { secret: '  ' } });
		assert.equal(emptySecret.status, 'Error');
		const present = await trigger.methods.credentialTest.conveniaWebhookApiTest.call({}, { data: { secret } });
		assert.equal(present.status, 'OK');
	});
});

describe('metadados do node, credencial e cobertura', () => {
	it('expõe a ferramenta no node de ação e não no trigger', () => {
		const node = new Convenia();
		const trigger = new ConveniaTrigger();
		assert.equal(typeof node.description.usableAsTool, 'object');
		assert.match(node.description.usableAsTool.replacements.description, /Prefer read operations/);
		assert.equal(trigger.description.usableAsTool, undefined);
		assert.equal(trigger.description.inputs.length, 0);
		assert.match(trigger.description.displayName, /Trigger/);
		assert.match(trigger.description.name, /Trigger$/);
		assert.deepEqual(node.description.credentials, [{ name: 'conveniaApi', required: true }]);
		assert.equal(node.description.credentials[0].name, 'conveniaApi');
	});

	it('não exige JSON cru e libera expressão fora de recurso e operação', () => {
		const properties = new Convenia().description.properties;
		const types = [];
		const walk = (items) => {
			for (const item of items ?? []) {
				types.push(item.type);
				assert.equal(item.type, item.type);
				if (item.type === 'json') assert.fail(`campo JSON cru: ${item.name}`);
				if (item.noDataExpression === true) {
					assert.ok(item.name === 'resource' || item.name === 'operation');
				}
				walk(item.options);
				if (item.type === 'collection' || item.type === 'fixedCollection') {
					for (const option of item.options ?? []) walk(option.values);
				}
			}
		};
		walk(properties);
		assert.ok(types.includes('resourceLocator'));
		assert.ok(types.includes('fixedCollection'));
	});

	it('testa a credencial de API em leitura e autentica pelo header token', () => {
		const api = new ConveniaApi();
		assert.equal(api.name, 'conveniaApi');
		assert.equal(api.authenticate.properties.headers.token, '={{$credentials.token}}');
		assert.equal(api.test.request.method, 'GET');
		assert.equal(api.test.request.url, '/tokens/permissions');
		assert.equal(api.httpRequestNode.apiBaseUrl, 'https://public-api.convenia.com.br/api/v3');
		const token = api.properties.find((property) => property.name === 'token');
		assert.equal(token.typeOptions.password, true);
		const webhook = new ConveniaWebhookApi();
		assert.equal(webhook.properties.find((property) => property.name === 'secret').typeOptions.password, true);
		assert.equal(WEBHOOK_EVENTS.length, 13);
	});

	it('documenta cada caminho, âncora e operação', () => {
		const coverage = fs.readFileSync(path.join(__dirname, '../docs/COBERTURA.md'), 'utf8');
		const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
		for (const documentedPath of DOCUMENTED_PATHS) {
			assert.equal(coverage.includes(documentedPath), true, documentedPath);
		}
		for (const anchor of H2_ANCHORS) {
			assert.equal(coverage.includes(anchor), true, anchor);
		}
		assert.match(coverage, /## Lacunas[\s\S]*obter-todos-os-tipos-de-faltas-e-afastamentos-para-um-colaborador/);
		for (const operation of operations) {
			assert.equal(coverage.includes(`${operation.resource}.${operation.operation}`), true, operation.operation);
		}
		for (const catalog of CATALOGS) {
			assert.equal(coverage.includes(catalog.anchor), true, catalog.value);
		}
		assert.match(readme, /2\.47\.2/);
		assert.match(readme, /Node\.js 24/);
		assert.match(readme, /50 requisições por minuto/);
		assert.match(readme, /LGPD/);
		assert.match(readme, /usableAsTool/);
		assert.match(readme, /n8n Cloud/);
		const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
		for (const file of [...pkg.n8n.nodes, ...pkg.n8n.credentials]) {
			assert.equal(fs.existsSync(path.join(__dirname, '..', file)), true, file);
		}
	});

	it('mantém os workflows de exemplo sem token e com parâmetros que o node declara', () => {
		const dir = path.join(__dirname, '../workflows');
		const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));
		assert.ok(files.length >= 5);
		const actionNames = new Set();
		const triggerNames = new Set();
		const collect = (items, names) => {
			for (const item of items ?? []) {
				if (item.name) names.add(item.name);
				collect(item.values, names);
				for (const option of item.options ?? []) collect(option.values, names);
			}
		};
		collect(new Convenia().description.properties, actionNames);
		collect(new ConveniaTrigger().description.properties, triggerNames);
		assert.equal(actionNames.has('paginate'), true);
		assert.equal(actionNames.has('maxPages'), true);
		assert.equal(actionNames.has('limit'), false);
		const eventTypes = new Set(WEBHOOK_EVENTS.map((event) => event.type).filter(Boolean));
		const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
		assert.equal(pkg.n8n.strict, true);
		assert.equal(pkg.engines.node, '>=24.0.0');
		for (const file of files) {
			const workflow = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
			const serialized = JSON.stringify(workflow);
			assert.equal(/tok_|Bearer |password|cpf/i.test(serialized), false, file);
			const nodes = workflow.nodes.filter((node) => String(node.type).startsWith('n8n-nodes-convenia.'));
			assert.ok(nodes.length > 0, file);
			for (const node of nodes) {
				const allowed = node.type.endsWith('Trigger') ? triggerNames : actionNames;
				for (const key of Object.keys(node.parameters)) {
					assert.equal(allowed.has(key), true, `${file} parâmetro desconhecido ${key}`);
				}
				assert.equal(Object.hasOwn(node.parameters, 'limit'), false, file);
				for (const event of node.parameters.events ?? []) {
					assert.equal(eventTypes.has(event), true, event);
				}
			}
		}
		const agent = JSON.parse(fs.readFileSync(path.join(dir, 'agente-leitura.json'), 'utf8'));
		const toolLink = agent.connections['Consultar colaborador'].ai_tool[0][0];
		assert.equal(toolLink.type, 'ai_tool');
		assert.equal(toolLink.node, 'Agente');
		assert.equal(agent.nodes.find((node) => node.name === 'Agente').type, '@n8n/n8n-nodes-langchain.agent');
	});
});
