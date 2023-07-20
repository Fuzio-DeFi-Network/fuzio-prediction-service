import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { ClaimInfo, type BetInfo } from "@fuzio/contracts/types/FuzioNativePrediction.types"

const FETCH_LIMIT = 20

export const getClaimInfoByUser = async (
	queryClient: FuzioNativePredictionQueryClient,
	player: string
): Promise<ClaimInfo[]> => {
	let allClaimInfo: ClaimInfo[] = []
	const getClaimsPaginated = async (startAfter?: string) => {
		const { claim_info } = await queryClient.getClaimInfoByUser({
			player,
			startAfter,
			limit: FETCH_LIMIT
		})
		allClaimInfo = [...allClaimInfo, ...claim_info]
		if (claim_info.length === FETCH_LIMIT) {
			await getClaimsPaginated(claim_info[FETCH_LIMIT - 1].player)
		}
	}

	await getClaimsPaginated()
	return allClaimInfo
}
