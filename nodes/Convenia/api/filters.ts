import { ConveniaInputError } from './errors';
import { rowsOf } from './values';

const OPERATORS = ['match', 'different', 'like'] as const;
type Operator = (typeof OPERATORS)[number];

function isOperator(value: string): value is Operator {
	return (OPERATORS as readonly string[]).includes(value);
}

function fieldKey(operator: Operator, field: string): string {
	const segments = field.split('.').filter((segment) => segment.length > 0);
	if (segments.length === 0 || segments.some((segment) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(segment))) {
		throw new ConveniaInputError(
			`Campo de filtro inválido "${field}". Use o nome documentado, com ponto para campos aninhados.`,
		);
	}
	return `${operator}[${segments.join('][')}]`;
}

export function appendFilters(query: Record<string, string | number>, filters: unknown): void {
	const grouped = new Map<string, { values: string[]; nullValue: boolean }>();
	for (const row of rowsOf(filters, 'condition')) {
		const operatorRaw = String(row.operator ?? 'match');
		if (!isOperator(operatorRaw)) {
			throw new ConveniaInputError(`Operador de filtro não documentado: ${operatorRaw}.`);
		}
		const field = String(row.field ?? '').trim();
		if (!field) throw new ConveniaInputError('Informe o campo de cada filtro.');
		const key = fieldKey(operatorRaw, field);
		const current = grouped.get(key) ?? { values: [], nullValue: false };
		if (row.nullValue === true) current.nullValue = true;
		const value = String(row.value ?? '').trim();
		if (value) current.values.push(value);
		grouped.set(key, current);
	}
	for (const [key, entry] of grouped) {
		if (entry.nullValue && entry.values.length > 0) {
			throw new ConveniaInputError(
				`O filtro ${key} não pode buscar nulo e um valor ao mesmo tempo.`,
			);
		}
		if (entry.nullValue) {
			query[key] = '%00';
			continue;
		}
		if (entry.values.length > 0) query[key] = entry.values.join(',');
	}
}
