export class InvalidCredentialsError extends Error {
	constructor() {
		super('Invalid e-mail or password.')
	}
}
