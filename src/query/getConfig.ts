import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type Config } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getConfig = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<Config> => {
	try {
		const config = await queryClient.config()
		return config
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("An error occurred:", error)
		throw error
	}
}
