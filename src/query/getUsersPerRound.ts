import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type BetInfo } from "@fuzio/contracts/types/FuzioNativePrediction.types"

const FETCH_LIMIT = 20

export const getUsersPerRound = async (
	queryClient: FuzioNativePredictionQueryClient,
	roundId: string
): Promise<BetInfo[]> => {
	let allUsers: BetInfo[] = []
	const getUsersPaginated = async (startAfter?: string) => {
		const { round_users } = await queryClient.getUsersPerRound({
			roundId,
			startAfter,
			limit: FETCH_LIMIT
		})
		allUsers = [...allUsers, ...round_users]
		if (round_users.length === FETCH_LIMIT) {
			await getUsersPaginated(round_users[FETCH_LIMIT - 1].player)
		}
	}

	await getUsersPaginated()
	return allUsers
}
