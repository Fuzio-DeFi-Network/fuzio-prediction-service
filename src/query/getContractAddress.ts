import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getContractAddress = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<string> => {
	const contractAddress = queryClient.contractAddress
	return contractAddress
}
