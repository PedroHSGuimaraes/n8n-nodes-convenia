import { asRecord } from './values';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface SearchQuery {
	path: string;
	query: Record<string, string | number>;
}

export function employeeSearchQuery(filter: string | undefined, page: number): SearchQuery {
	const query: Record<string, string | number> = { paginate: 20, page };
	const text = filter?.trim();
	if (text && UUID.test(text)) query['match[id]'] = text;
	else if (text) query['like[name]'] = text;
	return { path: '/employees', query };
}

export function pagedQuery(path: string, page: number): SearchQuery {
	return { path, query: { paginate: 100, page } };
}

export function plainQuery(path: string): SearchQuery {
	return { path, query: {} };
}

export interface SearchResultItem {
	name: string;
	value: string;
}

export interface SearchResultPage {
	results: SearchResultItem[];
	paginationToken?: string;
}

function rowsOfPayload(payload: unknown): Record<string, unknown>[] {
	const body = asRecord(payload);
	const data = 'data' in body ? body.data : payload;
	if (Array.isArray(data)) {
		return data.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object' && !Array.isArray(row));
	}
	const record = asRecord(data);
	if (record.id !== undefined) return [record];
	return [];
}

export function personLabel(row: Record<string, unknown>): string {
	const name = typeof row.name === 'string' ? row.name.trim() : '';
	const lastName = typeof row.last_name === 'string' ? row.last_name.trim() : '';
	const label = [name, lastName].filter((part) => part !== '').join(' ');
	return label || String(row.id);
}

export function namedLabel(row: Record<string, unknown>): string {
	if (typeof row.name === 'string' && row.name.trim() !== '') return row.name.trim();
	const type = asRecord(row.type);
	if (typeof type.name === 'string' && type.name.trim() !== '') return type.name.trim();
	return String(row.id);
}

export function toSearchPage(
	payload: unknown,
	label: (row: Record<string, unknown>) => string,
	paged = false,
): SearchResultPage {
	const results: SearchResultItem[] = [];
	for (const row of rowsOfPayload(payload)) {
		if (row.id === undefined || row.id === null || String(row.id).trim() === '') continue;
		results.push({ name: label(row), value: String(row.id) });
	}
	const body = asRecord(payload);
	const current = typeof body.current_page === 'number' ? body.current_page : undefined;
	const last = typeof body.last_page === 'number' ? body.last_page : undefined;
	const paginationToken =
		paged && current !== undefined && last !== undefined && current < last ? String(current + 1) : undefined;
	return { results, paginationToken };
}

export function filterResults(page: SearchResultPage, filter: string | undefined): SearchResultPage {
	const text = filter?.trim().toLowerCase();
	if (!text) return page;
	return {
		results: page.results.filter(
			(item) => item.name.toLowerCase().includes(text) || item.value.toLowerCase().includes(text),
		),
		paginationToken: page.paginationToken,
	};
}

export function pageNumber(paginationToken: string | undefined): number {
	if (!paginationToken) return 1;
	const parsed = Number(paginationToken);
	if (!Number.isInteger(parsed) || parsed < 1) return 1;
	return parsed;
}
