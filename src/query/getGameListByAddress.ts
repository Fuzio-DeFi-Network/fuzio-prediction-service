/* eslint-disable canonical/id-match */
/* eslint-disable @typescript-eslint/naming-convention */
import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type BetInfo } from "@fuzio/contracts/types/FuzioNativePrediction.types"

const FETCH_LIMIT = 20

export const getGameListByAddress = async (
	queryClient: FuzioNativePredictionQueryClient,
	player: string
): Promise<BetInfo[]> => {
	let currentGameList: BetInfo[] = []
	const getGamesPaginated = async (startAfter?: string) => {
		const { my_game_list } = await queryClient.myGameList({
			limit: FETCH_LIMIT,
			player,
			startAfter
		})
		currentGameList = [...currentGameList, ...my_game_list]
		if (my_game_list.length === FETCH_LIMIT) {
			await getGamesPaginated(my_game_list[FETCH_LIMIT - 1].player)
		}
	}

	try {
		await getGamesPaginated()
		return currentGameList
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("An error occurred:", error)
		throw error
	}
}
