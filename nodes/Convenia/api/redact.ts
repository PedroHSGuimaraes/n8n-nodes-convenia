const SENSITIVE_KEYS = new Set([
	'token',
	'authorization',
	'signature',
	'password',
	'cpf',
	'pis',
	'rg',
	'pix',
	'salary',
	'account',
	'digit',
	'agency',
	'document',
	'documents',
	'bankaccount',
	'bank_account',
	'bank_accounts',
	'ctps',
	'driver_license',
	'electoral_card',
	'reservist',
	'general_register',
]);

export function redactText(value: string): string {
	return value
		.replace(/\b(?:bearer|token|authorization|signature|password)\s+[A-Za-z0-9+/_.=-]{12,}/gi, '[segredo]')
		.replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[cpf]')
		.replace(/\b\d{3}\.?\d{5}\.?\d{2}-?\d\b/g, '[pis]')
		.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]');
}

export function redactValue(value: unknown, depth = 0): unknown {
	if (depth > 6) return '[omitido]';
	if (typeof value === 'string') return redactText(value);
	if (typeof value !== 'object' || value === null) return value;
	if (Array.isArray(value)) return value.slice(0, 20).map((item) => redactValue(item, depth + 1));
	const output: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
		if (SENSITIVE_KEYS.has(key.toLowerCase())) {
			output[key] = '[omitido]';
			continue;
		}
		output[key] = redactValue(item, depth + 1);
	}
	return output;
}

export function statusMessage(status?: number): string {
	switch (status) {
		case 400:
			return 'A Convenia recusou os dados da requisição (400).';
		case 401:
			return 'Token de integração recusado (401). Gere outro token na Convenia e atualize a credencial. O token não aparece nesta mensagem.';
		case 403:
			return 'A Convenia recusou o acesso (403). A documentação associa este código a empresa bloqueada.';
		case 404:
			return 'A Convenia não encontrou o recurso (404). Confira o identificador informado.';
		case 429:
			return 'Limite oficial de 50 requisições por minuto atingido (429).';
		case 502:
			return 'A Convenia retornou erro interno de comunicação (502).';
		case 504:
			return 'A Convenia excedeu o tempo máximo da requisição (504).';
		default:
			return status
				? `A Convenia retornou o status ${status}.`
				: 'Não foi possível concluir a requisição para a Convenia.';
	}
}

export function safeApiMessage(status: number | undefined, body: unknown, retryAfter?: string): string {
	const base = statusMessage(status);
	const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : undefined;
	const message = record && typeof record.message === 'string' ? redactText(record.message).slice(0, 300) : '';
	const errors = record ? redactValue(record.errors ?? record.error) : undefined;
	const errorText =
		errors && errors !== '[omitido]' && JSON.stringify(errors) !== '{}' && JSON.stringify(errors) !== 'null'
			? ` Detalhe: ${JSON.stringify(errors).slice(0, 400)}`
			: '';
	const retry =
		status === 429 && retryAfter
			? ` O header Retry-After informado foi ${redactText(retryAfter).slice(0, 40)}.`
			: '';
	const detail = message ? ` ${message}` : '';
	return `${base}${detail}${errorText}${retry}`;
}
