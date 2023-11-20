import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UsersRepository } from '../repositories/users-repository'

let usersRepository: UsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})
	it('should be able to register an user', async () => {
		const userRepository = new InMemoryUsersRepository()
		const sut = new RegisterUseCase(userRepository)

		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'john.doe@email.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash a user password upon registration', async () => {
		const userRepository = new InMemoryUsersRepository()
		const sut = new RegisterUseCase(userRepository)

		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'john.doe@email.com',
			password: '123456',
		})

		const isPasswordHashed = compare('123456', user.password_hash)

		expect(isPasswordHashed).toBeTruthy()
	})

	it('should not be able to register with the same email twice', async () => {
		await sut.execute({
			name: 'John Doe',
			email: 'john.doe@email.com',
			password: '123456',
		})

		await expect(() =>
			sut.execute({
				name: 'John Doe',
				email: 'john.doe@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
