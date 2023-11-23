import { GymsRepository } from '@/repositories/gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

interface CreateGymUseCaseParams {
	name: string
	description?: string | null
	phone: string | null
	latitude: number
	longitude: number
}

interface CreateGymUseCaseResult {
	gym: {
		id: string
		name: string
		description: string | null
		phone: string | null
		latitude: Decimal
		longitude: Decimal
	}
}

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
