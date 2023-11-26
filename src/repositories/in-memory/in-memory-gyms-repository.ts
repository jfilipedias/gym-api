import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
	FindManyNearbyParams,
	GymsRepository,
} from '@/repositories/gyms-repository'
import { getKilometerDistanceBetweenCoordinates } from '@/utils/get-kilometer-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
	public gyms: Gym[] = []

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: randomUUID(),
			name: data.name,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
		}

		this.gyms.push(gym)

		return gym
	}

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id)

		if (!gym) {
			return null
		}

		return gym
	}

	async findManyNearby(params: FindManyNearbyParams) {
		return this.gyms
			.filter((gym) => {
				const distance = getKilometerDistanceBetweenCoordinates(
					{
						latitude: params.latitude,
						longitude: params.longitude,
					},
					{
						latitude: gym.latitude.toNumber(),
						longitude: gym.longitude.toNumber(),
					},
				)

				return distance < 10
			})
			.slice((params.page - 1) * 20, params.page * 20)
	}

	async searchMany(query: string, page: number) {
		return this.gyms
			.filter((gym) => gym.name.includes(query))
			.slice((page - 1) * 20, page * 20)
	}
}
