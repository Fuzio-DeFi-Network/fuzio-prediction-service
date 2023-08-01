import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type FinishedRound } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getRoundById = async (
	queryClient: FuzioNativePredictionQueryClient,
	roundId: string
): Promise<FinishedRound> => {
	try {
		const finishedRound = await queryClient.finishedRound({ roundId })
		return finishedRound
	} catch (error) {
		console.error("An error occurred:", error)
		throw error
	}
}
