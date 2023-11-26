import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from '@/errors/resource-not-found'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface ValidateCheckInUseCaseParams {
	checkInId: string
}

interface ValidateCheckInUseCaseResult {
	checkIn: CheckIn
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInUseCaseParams): Promise<ValidateCheckInUseCaseResult> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return { checkIn }
	}
}
