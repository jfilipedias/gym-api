import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history'

describe('Get user check-ins history use case', () => {
	let checkInsRepository: InMemoryCheckInsRepository
	let sut: GetUserCheckInsHistoryUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserCheckInsHistoryUseCase(checkInsRepository)
	})

	it('should be able to get user check ins history', async () => {
		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01',
			created_at: new Date(),
		})

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01',
			created_at: new Date(),
		})

		const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' }),
		])
	})

	it('should be able to get paginated user check ins history', async () => {
		for (let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i}`,
				user_id: 'user-01',
				created_at: new Date(),
			})
		}

		const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-21' }),
			expect.objectContaining({ gym_id: 'gym-22' }),
		])
	})
})
