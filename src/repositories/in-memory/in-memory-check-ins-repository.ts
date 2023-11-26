import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public checkIns: CheckIn[] = []

	async countByUserId(userId: string) {
		return this.checkIns.filter((checkIn) => checkIn.user_id === userId).length
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
		}

		this.checkIns.push(checkIn)

		return checkIn
	}

	async findById(id: string) {
		const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)

		if (!checkIn) {
			return null
		}

		return checkIn
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkIn = this.checkIns.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnSameDate
		})

		if (!checkIn) {
			return null
		}

		return checkIn
	}

	async findManyByUserId(userId: string, page: number) {
		return this.checkIns
			.filter((checkIn) => checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20)
	}

	async save(data: CheckIn) {
		const checkInIndex = this.checkIns.findIndex(
			(checkIn) => checkIn.id === data.id,
		)

		if (checkInIndex < 0) {
			return
		}

		this.checkIns[checkInIndex] = data
	}
}
