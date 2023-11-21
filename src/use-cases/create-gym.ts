import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCaseParams {
	name: string
	description?: string | null
	phone: string | null
	latitude: number
	longitude: number
}

interface CreateGymUseCaseResult {}

export class CreateGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		name,
		description,
		phone,
		latitude,
		longitude,
	}: CreateGymUseCaseParams): Promise<CreateGymUseCaseResult> {
		const gym = await this.gymsRepository.create({
			name,
			description,
			phone,
			latitude,
			longitude,
		})

		return { gym }
	}
}
