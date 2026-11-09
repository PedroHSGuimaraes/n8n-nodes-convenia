export class ConveniaInputError extends Error {
	readonly name = 'ConveniaInputError';

	constructor(message: string) {
		super(message);
	}
}

export function assertNever(value: never, label: string): never {
	throw new ConveniaInputError(`${label} não suportado: ${String(value)}`);
}
