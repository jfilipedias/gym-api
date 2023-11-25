import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserCheckInsHistoryUseCaseParams {
	userId: string
	page: number
}

interface GetUserCheckInsHistoryUseCaseResult {
	checkIns: CheckIn[]
}

export class GetUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
	}: GetUserCheckInsHistoryUseCaseParams): Promise<GetUserCheckInsHistoryUseCaseResult> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		)

		return { checkIns }
	}
}
