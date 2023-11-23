export class MaxDailyCheckInError extends Error {
	constructor() {
		super('Max daily check-in reached.')
	}
}
