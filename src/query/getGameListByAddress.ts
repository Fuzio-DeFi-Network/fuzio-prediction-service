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
			player,
			startAfter,
			limit: FETCH_LIMIT
		})
		currentGameList = [...currentGameList, ...my_game_list]
		if (my_game_list.length === FETCH_LIMIT) {
			await getGamesPaginated(my_game_list[FETCH_LIMIT - 1].player)
		}
	}

	await getGamesPaginated()
	return currentGameList
}
