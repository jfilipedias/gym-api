import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GetNearbyGymsUseCase } from './get-nearby-gyms'

describe('Get nearby gyms use case', () => {
	let gymsRepository: InMemoryGymsRepository
	let sut: GetNearbyGymsUseCase

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new GetNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to get gyms close to the user', async () => {
		await gymsRepository.create({
			name: 'Near Gym',
			description: null,
			phone: null,
			latitude: -3.7518527,
			longitude: -38.5735098,
		})

		await gymsRepository.create({
			name: 'Far Gym',
			description: null,
			phone: null,
			latitude: -3.828119,
			longitude: -38.4961393,
		})

		const { gyms } = await sut.execute({
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
			page: 1,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ name: 'Near Gym' })])
	})

	it('should be able to get paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				name: `Max Gym ${i}`,
				description: null,
				phone: null,
				latitude: -3.7518527,
				longitude: -38.5735098,
			})
		}

		const { gyms } = await sut.execute({
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
			page: 2,
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ name: 'Max Gym 21' }),
			expect.objectContaining({ name: 'Max Gym 22' }),
		])
	})
})
