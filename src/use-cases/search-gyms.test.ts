import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

describe('Search gyms use case', () => {
	let gymsRepository: InMemoryGymsRepository
	let sut: SearchGymsUseCase

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			name: 'Max Gym',
			description: null,
			phone: null,
			latitude: -3.6940046,
			longitude: -38.586241,
		})

		await gymsRepository.create({
			name: 'Up Gym',
			description: null,
			phone: null,
			latitude: -3.6940046,
			longitude: -38.586241,
		})

		const { gyms } = await sut.execute({ query: 'Max', page: 1 })

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ name: 'Max Gym' })])
	})

	it('should be able to get paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				name: `Max Gym ${i}`,
				description: null,
				phone: null,
				latitude: -3.6940046,
				longitude: -38.586241,
			})
		}

		const { gyms } = await sut.execute({ query: 'Max', page: 2 })

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ name: 'Max Gym 21' }),
			expect.objectContaining({ name: 'Max Gym 22' }),
		])
	})
})
