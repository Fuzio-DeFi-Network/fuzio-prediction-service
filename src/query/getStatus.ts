import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type StatusResponse } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getStatus = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<StatusResponse> => {
	try {
		const status = await queryClient.status()
		return status
	} catch (error) {
		console.error("An error occurred:", error)
		throw error
	}
}
