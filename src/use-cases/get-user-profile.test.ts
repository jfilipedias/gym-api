import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { GetUserProfile } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfile

describe('Get user profile use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfile(usersRepository)
	})

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'john.doe@email.com',
			password_hash: await hash('123456', 6),
			created_at: new Date(),
		})

		const { user } = await sut.execute({ userId: createdUser.id })

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to get user profile with wrong id', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'john.doe@email.com',
			password_hash: await hash('123456', 6),
			created_at: new Date(),
		})

		await expect(() => sut.execute({ userId: '123' })).rejects.toBeInstanceOf(
			ResourceNotFoundError,
		)
	})
})