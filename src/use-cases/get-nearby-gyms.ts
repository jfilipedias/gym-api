import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface GetNearbyGymsUseCaseParams {
	userLatitude: number
	userLongitude: number
	page: number
}

interface GetNearbyGymsUseCaseResult {
	gyms: Gym[]
}

export class GetNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		userLatitude,
		userLongitude,
		page,
	}: GetNearbyGymsUseCaseParams): Promise<GetNearbyGymsUseCaseResult> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
			page,
		})

		return { gyms }
	}
}
