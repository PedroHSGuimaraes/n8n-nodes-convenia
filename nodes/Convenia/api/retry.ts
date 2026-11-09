export type RetryClass = 'read' | 'write';

export const READ_MAX_ATTEMPTS = 4;

export interface RetryInput {
	retry: RetryClass;
	attemptsMade: number;
	status?: number;
	network: boolean;
}

export interface RetryDecision {
	retry: boolean;
	reason: string;
}

export function shouldRetry(input: RetryInput): RetryDecision {
	if (input.retry === 'write') {
		return {
			retry: false,
			reason:
				'escrita não é repetida: 429, 5xx e falha de rede não provam que a alteração deixou de ser aplicada',
		};
	}
	if (input.attemptsMade >= READ_MAX_ATTEMPTS) {
		return { retry: false, reason: 'limite de tentativas' };
	}
	if (input.status === 429 || input.network || input.status === 502 || input.status === 504) {
		return { retry: true, reason: input.status === 429 ? '429' : 'leitura transitória' };
	}
	return { retry: false, reason: 'erro definitivo' };
}

export function backoffMs(retryIndex: number, retryAfterHeader?: string): number {
	if (retryAfterHeader !== undefined && retryAfterHeader.trim() !== '') {
		const seconds = Number(retryAfterHeader.trim());
		if (Number.isFinite(seconds) && seconds >= 0) {
			return Math.min(seconds * 1000, 60_000);
		}
	}
	const index = Math.max(1, retryIndex);
	return Math.min(500 * 2 ** (index - 1), 8_000);
}
