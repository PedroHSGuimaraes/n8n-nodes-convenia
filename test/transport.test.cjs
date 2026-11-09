const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { backoffMs, shouldRetry, READ_MAX_ATTEMPTS } = require('../dist/nodes/Convenia/api/retry');
const { MinuteWindowLimiter, CLIENT_LIMIT_PER_MINUTE, DOCUMENTED_LIMIT_PER_MINUTE } = require('../dist/nodes/Convenia/api/rateLimit');
const { redactText, redactValue, safeApiMessage } = require('../dist/nodes/Convenia/api/redact');
const { DEFAULT_MAX_PAGES, sameOriginNext, slicePage } = require('../dist/nodes/Convenia/api/pagination');
const { assertBaseUrl, performRequest, ConveniaApiError } = require('../dist/nodes/Convenia/api/transport');
const { employeeSearchQuery, namedLabel, personLabel, toSearchPage, filterResults } = require('../dist/nodes/Convenia/api/search');

const BASE = 'https://public-api.convenia.com.br/api/v3';

function limiter() {
	return new MinuteWindowLimiter(1000, 60_000, { now: () => 0, sleep: async () => {} });
}

function request(partial) {
	return {
		method: 'GET',
		path: '/employees',
		query: {},
		retry: 'read',
		response: 'json',
		pagination: 'none',
		multipart: false,
		includeEnvelope: false,
		binaryProperty: 'data',
		...partial,
	};
}

describe('retentativa e ritmo', () => {
	it('repete só leitura transitória e nunca repete escrita', () => {
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 429, network: false }).retry, true);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 502, network: false }).retry, true);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 504, network: false }).retry, true);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, network: true }).retry, true);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 400, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 401, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: 1, status: 404, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'write', attemptsMade: 1, status: 429, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'write', attemptsMade: 1, status: 502, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'write', attemptsMade: 1, status: 504, network: false }).retry, false);
		assert.equal(shouldRetry({ retry: 'write', attemptsMade: 1, network: true }).retry, false);
		assert.equal(shouldRetry({ retry: 'read', attemptsMade: READ_MAX_ATTEMPTS, status: 429, network: false }).retry, false);
	});

	it('respeita Retry-After e limita a espera exponencial', () => {
		assert.equal(backoffMs(1, '2'), 2000);
		assert.equal(backoffMs(1, '120'), 60_000);
		assert.equal(backoffMs(1, 'amanha'), 500);
		assert.equal(backoffMs(2), 1000);
		assert.equal(backoffMs(8), 8000);
	});

	it('segura o cliente abaixo do limite documentado de 50 por minuto', async () => {
		assert.equal(DOCUMENTED_LIMIT_PER_MINUTE, 50);
		assert.equal(CLIENT_LIMIT_PER_MINUTE, 48);
		let now = 0;
		const sleeps = [];
		const window = new MinuteWindowLimiter(2, 1000, {
			now: () => now,
			sleep: async (ms) => {
				sleeps.push(ms);
				now += ms;
			},
		});
		await window.take();
		await window.take();
		await window.take();
		assert.equal(sleeps.length, 1);
		assert.ok(sleeps[0] > 0);
	});
});

describe('transporte com respostas de exemplo', () => {
	it('aceita somente base HTTPS sem segredo na URL', () => {
		assert.equal(assertBaseUrl(`${BASE}/`), BASE);
		assert.throws(() => assertBaseUrl('http://public-api.convenia.com.br/api/v3'), /HTTPS/);
		assert.throws(() => assertBaseUrl('https://user:token@public-api.convenia.com.br/api/v3'), /usuário ou senha/);
		assert.throws(() => assertBaseUrl(`${BASE}?token=segredo`), /query string/);
	});

	it('desembrulha data, preserva envelope e trata corpo vazio', async () => {
		const calls = [];
		const listed = await performRequest({
			call: async (options) => {
				calls.push(options);
				return { statusCode: 200, headers: {}, body: { success: true, data: [{ id: '1' }, { id: '2' }] } };
			},
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({}),
		});
		assert.equal(listed.kind, 'items');
		assert.equal(listed.items.length, 2);
		assert.equal(calls[0].headers, undefined);
		const envelope = await performRequest({
			call: async () => ({ statusCode: 200, headers: {}, body: { success: true, data: { id: '1' } } }),
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ includeEnvelope: true }),
		});
		assert.equal(envelope.items[0].success, true);
		const empty = await performRequest({
			call: async () => ({ statusCode: 204, headers: {}, body: '' }),
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ method: 'PUT', retry: 'write', response: 'empty' }),
		});
		assert.deepEqual(empty.items[0], { success: true, statusCode: 204 });
	});

	it('omite segredo e dado pessoal da mensagem de erro', async () => {
		const secret = 'tok_super_secreto';
		await assert.rejects(
			() =>
				performRequest({
					call: async () => ({
						statusCode: 400,
						headers: {},
						body: {
							success: false,
							message: `falha do token ${secret} para pessoa@example.com CPF 390.533.447-05`,
							errors: { pix: 'chave', salary: 1000 },
						},
					}),
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({}),
				}),
			(error) => {
				assert.ok(error instanceof ConveniaApiError);
				assert.equal(error.message.includes(secret), false);
				assert.equal(error.message.includes('pessoa@example.com'), false);
				assert.equal(error.message.includes('390.533.447-05'), false);
				assert.equal(error.message.includes('chave'), false);
				assert.equal(error.message.includes('1000'), false);
				return true;
			},
		);
		const redacted = safeApiMessage(401, {
			message: 'token tok_super_secreto',
			errors: { cpf: '39053344705' },
		});
		assert.equal(redacted.includes('tok_super_secreto'), false);
		assert.equal(redacted.includes('39053344705'), false);
		assert.equal(JSON.stringify(redactValue({ token: secret, name: 'Ana' })).includes(secret), false);
		assert.equal(redactText('pis 123.45678.90-1'), redactText('pis 123.45678.90-1'));
		assert.equal(redactText('123.45678.90-1').includes('123'), false);
	});

	it('repete leitura 429 e não repete escrita 429 nem 502', async () => {
		let reads = 0;
		const sleeps = [];
		const ok = await performRequest({
			call: async () => {
				reads += 1;
				if (reads === 1) return { statusCode: 429, headers: { 'retry-after': '1' }, body: { message: 'limite' } };
				return { statusCode: 200, headers: {}, body: { data: { id: '1' } } };
			},
			limiter: limiter(),
			sleep: async (ms) => {
				sleeps.push(ms);
			},
			baseUrl: BASE,
			request: request({}),
		});
		assert.equal(reads, 2);
		assert.deepEqual(sleeps, [1000]);
		assert.equal(ok.items[0].id, '1');
		let writes = 0;
		await assert.rejects(
			() =>
				performRequest({
					call: async () => {
						writes += 1;
						return { statusCode: 502, headers: {}, body: { message: 'gateway' } };
					},
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ method: 'POST', retry: 'write' }),
				}),
			(error) => error instanceof ConveniaApiError && writes === 1 && /não foi repetida/.test(error.message),
		);
		let limited = 0;
		await assert.rejects(
			() =>
				performRequest({
					call: async () => {
						limited += 1;
						return { statusCode: 429, headers: { 'retry-after': '2' }, body: { message: 'limite' } };
					},
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ method: 'POST', retry: 'write' }),
				}),
			(error) => error instanceof ConveniaApiError && limited === 1 && /não foi repetida/.test(error.message),
		);
	});

	it('segue next_page_url da mesma origem e falha sem truncar', async () => {
		const urls = [];
		const paged = await performRequest({
			call: async (options) => {
				urls.push(options.url);
				if (urls.length === 1) {
					return {
						statusCode: 200,
						headers: {},
						body: {
							data: [{ id: '1' }],
							current_page: 1,
							last_page: 2,
							next_page_url: `${BASE}/employees?page=2`,
						},
					};
				}
				return { statusCode: 200, headers: {}, body: { data: [{ id: '2' }], current_page: 2, last_page: 2, next_page_url: null } };
			},
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ pagination: 'laravel', query: { paginate: 1000, page: 1 } }),
		});
		assert.deepEqual(urls, [`${BASE}/employees`, `${BASE}/employees?page=2`]);
		assert.deepEqual(
			paged.items.map((item) => item.id),
			['1', '2'],
		);
		await assert.rejects(
			() =>
				performRequest({
					call: async () => ({
						statusCode: 200,
						headers: {},
						body: { data: [{ id: '1' }], next_page_url: 'https://evil.example/employees?page=2' },
					}),
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ pagination: 'laravel' }),
				}),
			/não devolveu uma lista parcial/,
		);
		assert.equal(sameOriginNext(`${BASE}/employees`, 'https://evil.example/next'), undefined);
		let pages = 0;
		await assert.rejects(
			() =>
				performRequest({
					call: async () => {
						pages += 1;
						return {
							statusCode: 200,
							headers: {},
							body: { data: [{ id: String(pages) }], next_page_url: `${BASE}/employees?page=${pages + 1}` },
						};
					},
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ pagination: 'laravel', maxPages: 2 }),
				}),
			(error) => error instanceof Error && pages === 2 && /máximo de 2 páginas/.test(error.message),
		);
		let looped = 0;
		await assert.rejects(
			() =>
				performRequest({
					call: async () => {
						looped += 1;
						return {
							statusCode: 200,
							headers: {},
							body: { data: [{ id: '1' }], next_page_url: `${BASE}/employees` },
						};
					},
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ pagination: 'laravel', maxPages: 5 }),
				}),
			/repetiu uma URL/,
		);
		assert.equal(looped, 1);
		await assert.rejects(
			() =>
				performRequest({
					call: async () => ({
						statusCode: 200,
						headers: {},
						body: { data: [{ id: '1' }], current_page: 1, last_page: 3, next_page_url: null },
					}),
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ pagination: 'laravel', maxPages: DEFAULT_MAX_PAGES }),
				}),
			/next_page_url/,
		);
	});

	it('não inventa paginate para colaboradores do benefício e junta permissões do token', async () => {
		const queries = [];
		const benefit = await performRequest({
			call: async (options) => {
				queries.push(options.qs);
				if (queries.length === 1) {
					return {
						statusCode: 200,
						headers: {},
						body: {
							data: {
								employees: [{ id: '1' }],
								current_page: 1,
								total_pages: 2,
								next_page_url: `${BASE}/benefits/1/employees?page=2`,
							},
						},
					};
				}
				return { statusCode: 200, headers: {}, body: { data: { employees: [{ id: '2' }], current_page: 2, total_pages: 2 } } };
			},
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ path: '/benefits/1/employees', pagination: 'benefitEmployees' }),
		});
		assert.deepEqual(queries, [undefined, undefined]);
		assert.equal(benefit.items.length, 2);
		const token = await performRequest({
			call: async (options) => {
				const page = options.url.includes('page=2') ? 2 : 1;
				return {
					statusCode: 200,
					headers: {},
					body: {
						data: { id: 'token', permissions: [{ name: `p${page}` }] },
						current_page: page,
						last_page: 2,
						next_page_url: page === 1 ? `${BASE}/tokens/permissions?page=2` : null,
					},
				};
			},
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ path: '/tokens/permissions', pagination: 'tokenPermissions' }),
		});
		assert.equal(token.items.length, 1);
		assert.deepEqual(token.items[0].permissions, [{ name: 'p1' }, { name: 'p2' }]);
		const slice = slicePage({ data: { absences: [{ id: '1' }] } }, 'none', 1);
		assert.equal(Array.isArray(slice.items[0].absences), true);
	});

	it('baixa binário e monta multipart com o campo file', async () => {
		const binary = await performRequest({
			call: async () => ({
				statusCode: 200,
				headers: { 'content-disposition': 'attachment; filename="folha.pdf"', 'content-type': 'application/pdf' },
				body: Buffer.from('pdf'),
			}),
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ response: 'binary', path: '/payrolls/1/files/2' }),
		});
		assert.equal(binary.kind, 'binary');
		assert.equal(binary.fileName, 'folha.pdf');
		assert.equal(binary.mimeType, 'application/pdf');
		let sent;
		await performRequest({
			call: async (options) => {
				sent = options;
				return { statusCode: 200, headers: {}, body: { data: { id: 'file' } } };
			},
			limiter: limiter(),
			sleep: async () => {},
			baseUrl: BASE,
			request: request({ method: 'POST', retry: 'write', multipart: true, fileName: 'doc.pdf' }),
			file: { buffer: Buffer.from('arquivo'), fileName: 'doc.pdf', mimeType: 'application/pdf' },
		});
		assert.match(sent.headers['content-type'], /^multipart\/form-data; boundary=/);
		assert.match(sent.body.toString('utf8'), /name="file"; filename="doc\.pdf"/);
		await assert.rejects(
			() =>
				performRequest({
					call: async () => ({ statusCode: 200, headers: {}, body: {} }),
					limiter: limiter(),
					sleep: async () => {},
					baseUrl: BASE,
					request: request({ multipart: true }),
				}),
			/Anexe o arquivo/,
		);
	});
});

describe('busca sem dado sensível', () => {
	it('filtra colaborador por nome ou UUID e nunca pede CPF', () => {
		const byName = employeeSearchQuery('Ana', 2);
		assert.equal(byName.query['like[name]'], 'Ana');
		assert.equal(byName.query.paginate, 20);
		assert.equal(byName.query.page, 2);
		assert.equal(JSON.stringify(byName).includes('cpf'), false);
		const byId = employeeSearchQuery('11111111-1111-4111-8111-111111111111', 1);
		assert.equal(byId.query['match[id]'], '11111111-1111-4111-8111-111111111111');
		assert.equal(byId.query['like[name]'], undefined);
	});

	it('rotula pessoa e folha sem documento', () => {
		const person = personLabel({ id: '1', name: 'Ana', last_name: 'Souza', cpf: '39053344705' });
		assert.equal(person, 'Ana Souza');
		assert.equal(person.includes('390'), false);
		assert.equal(namedLabel({ id: '9', type: { name: 'Mensal' } }), 'Mensal');
		const page = toSearchPage(
			{ data: [{ id: '1', name: 'Ana', cpf: 'x' }, { name: 'sem id' }], current_page: 1, last_page: 2 },
			personLabel,
			true,
		);
		assert.deepEqual(page.results, [{ name: 'Ana', value: '1' }]);
		assert.equal(page.paginationToken, '2');
		assert.equal(filterResults(page, 'zzz').results.length, 0);
	});
});
