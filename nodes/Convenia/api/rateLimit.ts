import { sleep } from 'n8n-workflow';

export const DOCUMENTED_LIMIT_PER_MINUTE = 50;
export const CLIENT_LIMIT_PER_MINUTE = 48;
export const WINDOW_MS = 60_000;

export interface Clock {
	now: () => number;
	sleep: (ms: number) => Promise<void>;
}

export class MinuteWindowLimiter {
	private stamps: number[] = [];

	constructor(
		private readonly maxPerWindow = CLIENT_LIMIT_PER_MINUTE,
		private readonly windowMs = WINDOW_MS,
		private readonly clock: Clock = {
			now: () => Date.now(),
			sleep,
		},
	) {}

	async take(): Promise<void> {
		for (;;) {
			const now = this.clock.now();
			this.stamps = this.stamps.filter((stamp) => now - stamp < this.windowMs);
			if (this.stamps.length < this.maxPerWindow) {
				this.stamps.push(now);
				return;
			}
			const wait = this.windowMs - (now - this.stamps[0]) + 1;
			await this.clock.sleep(Math.max(1, wait));
		}
	}
}
