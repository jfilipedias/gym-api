import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('should be able to create a gym', async () => {
		const { gym } = await sut.execute({
			name: 'Max gym',
			description: null,
			phone: null,
			latitude: -3.6940046,
			longitude: -38.586241,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
