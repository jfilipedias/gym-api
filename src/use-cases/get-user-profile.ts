import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { UsersRepository } from '@/repositories/users-repository'

interface GetUserProfileParams {
	userId: string
}

interface GetUserProfileResult {
	user: {
		id: string
		name: string
		email: string
		created_at: Date
	}
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserProfileParams): Promise<GetUserProfileResult> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			throw new ResourceNotFoundError()
		}

		return { user }
	}
}
