import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type FinishedRound } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getRoundById = async (
	queryClient: FuzioNativePredictionQueryClient,
	roundId: string
): Promise<FinishedRound> => {
	const finishedRound = await queryClient.finishedRound({ roundId })
	return finishedRound
}
