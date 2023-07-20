import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type MyCurrentPositionResponse } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getCurrentPositionByAddress = async (
	queryClient: FuzioNativePredictionQueryClient,
	address: string
): Promise<MyCurrentPositionResponse> => {
	const currentPositionByAddress = await queryClient.myCurrentPosition({ address })
	return currentPositionByAddress
}
