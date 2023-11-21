import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { getKilometerDistanceBetweenCoordinates } from '../utils/get-kilometer-distance-between-coordinates'

interface CheckInUseCaseParams {
	userId: string
	gymId: string
	userLatitude: number
	userLongitude: number
}

interface CheckInUseCaseResult {
	checkIn: {
		id: string
		created_at: Date
		validated_at: Date | null
		user_id: string
		gym_id: string
	}
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseParams): Promise<CheckInUseCaseResult> {
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) {
			throw new ResourceNotFoundError()
		}

		const distance = getKilometerDistanceBetweenCoordinates(
			{
				latitude: userLatitude,
				longitude: userLongitude,
			},
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		)

		const MAX_DISTANCE_IN_KILOMETER = 0.1

		if (distance > MAX_DISTANCE_IN_KILOMETER) {
			throw new Error()
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		)

		if (checkInOnSameDay) {
			throw new Error()
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId,
		})

		return { checkIn }
	}
}
