import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseParams {
	query: string
	page: number
}

interface SearchGymsUseCaseResult {
	gyms: Gym[]
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		query,
		page,
	}: SearchGymsUseCaseParams): Promise<SearchGymsUseCaseResult> {
		const gyms = await this.gymsRepository.searchMany(query, page)

		return { gyms }
	}
}
