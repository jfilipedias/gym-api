import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
	latitude: number
	longitude: number
	page: number
}

export interface GymsRepository {
	create(data: Prisma.GymCreateInput): Promise<Gym>
	findById(id: string): Promise<Gym | null>
	findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]>
	searchMany(query: string, page: number): Promise<Gym[]>
}
