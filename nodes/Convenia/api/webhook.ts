import { createHmac, timingSafeEqual } from 'crypto';

export interface WebhookEventDefinition {
	value: string;
	name: string;
	anchor: string;
	type?: string;
}

export const WEBHOOK_EVENTS: readonly WebhookEventDefinition[] = [
	{ value: 'admission.started', name: 'Admission Started', anchor: 'admissao-iniciada', type: 'admission.started' },
	{ value: 'admission.finished', name: 'Admission Finished', anchor: 'admissao-finalizada', type: 'admission.finished' },
	{ value: 'dismissal.finished', name: 'Dismissal Finished', anchor: 'desligamento', type: 'dismissal.finished' },
	{ value: 'dismissal.awaiting.accounting', name: 'Dismissal Awaiting Accounting', anchor: 'desligamento-aguardando-contabilidade', type: 'dismissal.awaiting.accounting' },
	{ value: 'vacation.created', name: 'Vacation Created', anchor: 'criacao-de-ferias', type: 'vacation.created' },
	{ value: 'vacation.approved', name: 'Vacation Approved', anchor: 'aprovacao-de-ferias', type: 'vacation.approved' },
	{ value: 'vacation.solicitation.updated', name: 'Vacation Solicitation Updated', anchor: 'atualizacao-de-ferias', type: 'vacation.solicitation.updated' },
	{ value: 'employee.edited', name: 'Employee Edited', anchor: 'alteracao-no-perfil-de-colaboradores', type: 'employee.edited' },
	{ value: 'salary.historic.changed', name: 'Salary Historic Changed', anchor: 'alteracao-de-dados-salariais', type: 'salary.historic.changed' },
	{ value: 'absence.created', name: 'Absence Created', anchor: 'criacao-de-faltas-e-afastamentos', type: 'absence.created' },
	{ value: 'absence.updated', name: 'Absence Updated', anchor: 'atualizacao-de-faltas-e-afastamentos', type: 'absence.updated' },
	{ value: 'absence.deleted', name: 'Absence Deleted', anchor: 'delecao-de-faltas-e-afastamentos', type: 'absence.deleted' },
	{ value: 'birthday', name: 'Birthday', anchor: 'aniversariantes-do-dia' },
];

export const EMPLOYEE_EDIT_SECTIONS = [
	'absences',
	'addresses',
	'aso',
	'bank_accounts',
	'contact_information',
	'cpf',
	'ctps',
	'custom_field_values',
	'dependents',
	'document_files',
	'driver_licenses',
	'electoral_cards',
	'emergency_contacts',
	'employees',
	'employee_educations',
	'employee_nationalities',
	'experience_periods',
	'foreign_employees',
	'handicapped',
	'interns',
	'other_documents',
	'personal_information',
	'professional_information',
	'real_estates',
	'reservists',
	'residence_proof',
	'rg',
	'salaries_historic',
	'union_contributions',
] as const;

export const SIGNATURE_CHECK =
	'unverified-spatie-default' as const;

export function signWebhook(secret: string, rawBody: string): string {
	return createHmac('sha256', secret).update(rawBody).digest('hex');
}

export function verifyWebhookSignature(secret: string, rawBody: string, header: string | undefined): boolean {
	if (!secret || header === undefined || header.trim() === '') return false;
	const expected = Buffer.from(signWebhook(secret, rawBody));
	const received = Buffer.from(header.trim());
	if (expected.length !== received.length) return false;
	return timingSafeEqual(expected, received);
}

export type WebhookDecision =
	| { ok: true; event: string; body: Record<string, unknown> }
	| { ok: false; status: number; message: string; ignored?: boolean };

export function eventNameOf(body: Record<string, unknown>): string | undefined {
	if (typeof body.type === 'string' && body.type.trim() !== '') return body.type.trim();
	return undefined;
}

export function evaluateWebhook(input: {
	rawBody: string | undefined;
	signature: string | undefined;
	contentType: string | undefined;
	secret: string;
	allowed: readonly string[];
}): WebhookDecision {
	if (input.rawBody === undefined) {
		return {
			ok: false,
			status: 400,
			message:
				'O corpo bruto da requisição não está disponível. Sem os bytes originais não há como conferir o header Signature.',
		};
	}
	const contentType = (input.contentType ?? '').toLowerCase();
	if (!contentType.includes('application/json')) {
		return {
			ok: false,
			status: 415,
			message: 'A documentação dos webhooks exige content-type application/json.',
		};
	}
	if (!verifyWebhookSignature(input.secret, input.rawBody, input.signature)) {
		return {
			ok: false,
			status: 401,
			message:
				'Assinatura rejeitada. A Convenia cita spatie/laravel-webhook-client e o header Signature, mas não publica o algoritmo nem um vetor de teste. Este node compara HMAC-SHA256 hexadecimal do corpo cru, que é o validador padrão da biblioteca, e isso ainda não foi confirmado em sandbox. Payload sem assinatura não é aceito.',
		};
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(input.rawBody);
	} catch {
		return {
			ok: false,
			status: 400,
			message:
				'O corpo não é JSON válido. O exemplo oficial de aniversariantes não é JSON válido e não é reinterpretado.',
		};
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return {
			ok: false,
			status: 400,
			message: 'O payload do webhook precisa ser um objeto JSON.',
		};
	}
	const body = parsed as Record<string, unknown>;
	const event = eventNameOf(body);
	if (!event) {
		return {
			ok: false,
			status: 400,
			message:
				'O payload não traz type. O exemplo oficial de aniversariantes não tem type e não é JSON válido, então employee_ids sem type não é classificado como evento.',
		};
	}
	if (input.allowed.length > 0 && !input.allowed.includes(event)) {
		return {
			ok: false,
			status: 200,
			ignored: true,
			message: 'Evento fora do filtro deste workflow.',
		};
	}
	return { ok: true, event, body };
}
