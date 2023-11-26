import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseParams {
	userId: string
}

interface GetUserMetricsUseCaseResult {
	checkInsCount: number
}

export class GetUserMetricsUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
	}: GetUserMetricsUseCaseParams): Promise<GetUserMetricsUseCaseResult> {
		const checkInsCount = await this.checkInsRepository.countByUserId(userId)

		return { checkInsCount }
	}
}
