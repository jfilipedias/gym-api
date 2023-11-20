import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'

interface AuthenticateUseCaseParams {
	email: string
	password: string
}

interface AuthenticateUseCaseResult {
	user: {
		id: string
		name: string
		email: string
		password_hash: string
		created_at: Date
	}
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResult> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordsMatch = await compare(password, user.password_hash)

		if (!doesPasswordsMatch) {
			throw new InvalidCredentialsError()
		}

		return { user }
	}
}
