import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			id: randomUUID(),
			name: 'John Doe',
			email: 'john.doe@email.com',
			password_hash: await hash('123456', 6),
			created_at: new Date(),
		})

		const { user } = await sut.execute({
			email: 'john.doe@email.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				email: 'john.doe@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not to authenticate with wrong password', async () => {
		await usersRepository.create({
			id: randomUUID(),
			name: 'John Doe',
			email: 'john.doe@email.com',
			password_hash: await hash('123456', 6),
			created_at: new Date(),
		})

		await expect(() =>
			sut.execute({
				email: 'john.doe@email.com',
				password: 'abcde',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
