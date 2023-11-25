import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MaxDailyCheckInError } from '@/errors/max-daily-check-in-error'
import { MaxDistanceError } from '@/errors/max-distance-error'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'

describe('Check-in use case', () => {
	let checkInsRepository: InMemoryCheckInsRepository
	let gymsRepository: InMemoryGymsRepository
	let sut: CheckInUseCase

	let gymId: string

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		const gym = await gymsRepository.create({
			name: 'Gym',
			description: null,
			phone: null,
			latitude: -3.6940046,
			longitude: -38.586241,
		})

		gymId = gym.id

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in more than once a day', async () => {
		vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

		await sut.execute({
			userId: 'user-01',
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		await expect(() =>
			sut.execute({
				userId: 'user-01',
				gymId,
				userLatitude: -3.6940046,
				userLongitude: -38.586241,
			}),
		).rejects.toBeInstanceOf(MaxDailyCheckInError)
	})

	it('should be able to check in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

		await sut.execute({
			userId: 'user-01',
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		vi.setSystemTime(new Date(2022, 0, 12, 8, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId,
			userLatitude: -3.6940046,
			userLongitude: -38.586241,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in at a distance greater than 100 meters from the gym', async () => {
		await expect(() =>
			sut.execute({
				userId: 'user-01',
				gymId,
				userLatitude: -3.7464448,
				userLongitude: -38.5737754,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
