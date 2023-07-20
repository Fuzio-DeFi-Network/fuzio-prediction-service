import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type StatusResponse } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getStatus = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<StatusResponse> => {
	const status = await queryClient.status()
	return status
}
