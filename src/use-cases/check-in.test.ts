import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'

describe('Check-in use case', () => {
	let checkInsRepository: InMemoryCheckInsRepository
	let gymsRepository: InMemoryGymsRepository
	let sut: CheckInUseCase

	let gymId: string
	let userId: string

	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymId = randomUUID()
		userId = randomUUID()

		gymsRepository.items.push({
			id: gymId,
			name: 'Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-3.6940046),
			longitude: new Decimal(-38.586241),
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId,
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in more than once a day', async () => {
		vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

		await sut.execute({
			userId,
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		await expect(() =>
			sut.execute({
				userId,
				gymId,
				userLatitude: -3.6940046,
				userLongitude: -38.586241,
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

		await sut.execute({
			userId,
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		vi.setSystemTime(new Date(2022, 0, 12, 8, 0, 0))

		const { checkIn } = await sut.execute({
			userId,
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in at a distance greater than 100 meters from the gym', async () => {
		await expect(() =>
			sut.execute({
				userId,
				gymId,
				userLatitude: -3.7464448,
				userLongitude: -38.5737754,
			}),
		).rejects.toBeInstanceOf(Error)
	})
})
