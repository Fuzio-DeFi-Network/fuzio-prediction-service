import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { ClaimInfo, type BetInfo } from "@fuzio/contracts/types/FuzioNativePrediction.types"

const FETCH_LIMIT = 20

export const getClaimInfoPerRound = async (
	queryClient: FuzioNativePredictionQueryClient,
	roundId: string
): Promise<ClaimInfo[]> => {
	let allClaimInfo: ClaimInfo[] = []
	const getClaimsPaginated = async (startAfter?: string) => {
		const { claim_info } = await queryClient.getClaimInfoPerRound({
			roundId,
			startAfter,
			limit: FETCH_LIMIT
		})
		allClaimInfo = [...allClaimInfo, ...claim_info]
		if (claim_info.length === FETCH_LIMIT) {
			await getClaimsPaginated(claim_info[FETCH_LIMIT - 1].player)
		}
	}

	try {
		await getClaimsPaginated()
		return allClaimInfo
	} catch (error) {
		console.error("An error occurred:", error)
		throw error
	}
}
