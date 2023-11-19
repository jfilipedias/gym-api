import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { UsersRepository } from '@/repositories/users-repository'

interface RegisterUseCaseParams {
	name: string
	email: string
	password: string
}

interface RegisterUseCaseResult {
	user: {
		id: string
		name: string
		email: string
		password_hash: string
		created_at: Date
	}
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUseCaseParams): Promise<RegisterUseCaseResult> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		})

		return { user }
	}
}
