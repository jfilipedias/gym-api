import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { GymsRepository } from '@/repositories/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = []

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: randomUUID(),
			name: data.name,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
		}

		this.items.push(gym)

		return gym
	}

	async findById(id: string) {
		const gym = this.items.find((gym) => gym.id === id)

		if (!gym) {
			return null
		}

		return gym
	}
}
