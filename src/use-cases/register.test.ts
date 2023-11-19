import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'

describe('Register use case', () => {
	it('should be able to register an user', async () => {
		const userRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(userRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'john.dope@gmail.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash a user password upon registration', async () => {
		const userRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(userRepository)

		const { user } = await registerUseCase.execute({
			name: 'John Doe',
			email: 'john.dope@gmail.com',
			password: '123456',
		})

		const isPasswordHashed = compare('123456', user.password_hash)

		expect(isPasswordHashed).toBeTruthy()
	})

	it('should not be able to register with the same email twice', async () => {
		const userRepository = new InMemoryUsersRepository()
		const registerUseCase = new RegisterUseCase(userRepository)

		await registerUseCase.execute({
			name: 'John Doe',
			email: 'john.dope@gmail.com',
			password: '123456',
		})

		expect(
			async () =>
				await registerUseCase.execute({
					name: 'John Doe',
					email: 'john.dope@gmail.com',
					password: '123456',
				}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
