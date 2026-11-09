import { ConveniaInputError } from './errors';

export function optionalString(value: unknown): string | undefined {
	if (value === undefined || value === null) return undefined;
	const text = String(value).trim();
	return text === '' ? undefined : text;
}

export function requiredString(value: unknown, label: string): string {
	const text = optionalString(value);
	if (!text) throw new ConveniaInputError(`${label} é obrigatório.`);
	return text;
}

export function pathId(value: unknown, label: string): string {
	const id = requiredString(value, label);
	if (/[/?#\\\s]/.test(id)) {
		throw new ConveniaInputError(
			`${label} contém caracteres que mudariam o caminho da requisição.`,
		);
	}
	return encodeURIComponent(id);
}

export function optionalInt(value: unknown, label: string): number | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	const parsed = typeof value === 'number' ? value : Number(String(value).trim());
	if (!Number.isInteger(parsed)) {
		throw new ConveniaInputError(`${label} precisa ser um número inteiro.`);
	}
	return parsed;
}

export function requiredInt(value: unknown, label: string): number {
	const parsed = optionalInt(value, label);
	if (parsed === undefined) throw new ConveniaInputError(`${label} é obrigatório.`);
	return parsed;
}

export function optionalDecimal(value: unknown, label: string): number | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	const normalized = String(value).trim().replace(',', '.');
	if (normalized === '') return undefined;
	const parsed = Number(normalized);
	if (!Number.isFinite(parsed)) {
		throw new ConveniaInputError(`${label} precisa ser numérico.`);
	}
	return parsed;
}

export function requiredDecimal(value: unknown, label: string): number {
	const parsed = optionalDecimal(value, label);
	if (parsed === undefined) throw new ConveniaInputError(`${label} é obrigatório.`);
	return parsed;
}

export function optionalDate(value: unknown, label: string): string | undefined {
	const text = optionalString(value);
	if (!text) return undefined;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
		throw new ConveniaInputError(`${label} deve usar o formato AAAA-MM-DD.`);
	}
	return text;
}

export function requiredDate(value: unknown, label: string): string {
	const text = optionalDate(value, label);
	if (!text) throw new ConveniaInputError(`${label} é obrigatório.`);
	return text;
}

export function zipCode(value: unknown, label: string): string | undefined {
	if (value === undefined || value === null || String(value).trim() === '') return undefined;
	const digits = String(value).replace(/[\s-]/g, '');
	if (!/^\d{8}$/.test(digits)) {
		throw new ConveniaInputError(
			`${label}: a documentação pede no máximo 8 caracteres e sem hífen. Informe 8 dígitos.`,
		);
	}
	return digits;
}

export function triBool(value: unknown): boolean | undefined {
	if (value === true || value === 'true') return true;
	if (value === false || value === 'false') return false;
	return undefined;
}

export function requiredBool(value: unknown, label: string): boolean {
	if (value === true || value === 'true') return true;
	if (value === false || value === 'false') return false;
	throw new ConveniaInputError(`${label} é obrigatório.`);
}

export function asRecord(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
	return value as Record<string, unknown>;
}

export function rowsOf(value: unknown, multipleKey: string): Record<string, unknown>[] {
	if (Array.isArray(value)) {
		return value.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
	}
	const record = asRecord(value);
	const inner = record[multipleKey];
	if (!Array.isArray(inner)) return [];
	return inner.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object');
}

export function assignNested(
	target: Record<string, unknown>,
	group: string | undefined,
	api: string,
	value: unknown,
): void {
	if (value === undefined) return;
	if (!group) {
		target[api] = value;
		return;
	}
	const current = asRecord(target[group]);
	current[api] = value;
	target[group] = current;
}

export function limitPage(params: Record<string, unknown>): { paginate: number; page: number } {
	const returnAll = params.returnAll === true;
	const requested = optionalInt(params.paginate, 'Paginate') ?? 50;
	if (requested < 1 || requested > 1000) {
		throw new ConveniaInputError('Paginate deve ficar entre 1 e 1000, que é o máximo documentado por página.');
	}
	const page = optionalInt(params.page, 'Página') ?? 1;
	if (page < 1) throw new ConveniaInputError('Página deve ser um inteiro a partir de 1.');
	return { paginate: returnAll ? 1000 : requested, page: returnAll ? 1 : page };
}

export function readOptions(params: Record<string, unknown>): Record<string, unknown> {
	return asRecord(params.options);
}
