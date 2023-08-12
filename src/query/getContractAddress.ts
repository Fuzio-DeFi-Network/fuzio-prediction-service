import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getContractAddress = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<string> => {
	try {
		const contractAddress = queryClient.contractAddress
		return contractAddress
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("An error occurred:", error)
		throw error
	}
}
