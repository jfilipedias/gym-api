import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LateCheckInValidationError } from '@/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'

describe('Check-in use case', () => {
	let checkInsRepository: InMemoryCheckInsRepository
	let sut: ValidateCheckInUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate a check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.checkIns[0].validated_at).toEqual(
			expect.any(Date),
		)
	})

	it('should not be able to validate a non-existing check-in', async () => {
		await expect(() =>
			sut.execute({ checkInId: 'test' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate a check-in after 20 minutes of creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
		})

		const TentyOneMinutesInMilliseconds = 1000 * 60 * 21

		vi.advanceTimersByTime(TentyOneMinutesInMilliseconds)

		await expect(() =>
			sut.execute({ checkInId: createdCheckIn.id }),
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})
})
