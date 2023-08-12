/* eslint-disable canonical/id-match */
/* eslint-disable @typescript-eslint/naming-convention */
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
			limit: FETCH_LIMIT,
			roundId,
			startAfter
		})
		allUsers = [...allUsers, ...round_users]
		if (round_users.length === FETCH_LIMIT) {
			await getUsersPaginated(round_users[FETCH_LIMIT - 1].player)
		}
	}

	try {
		await getUsersPaginated()
		return allUsers
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("An error occurred:", error)
		throw error
	}
}
