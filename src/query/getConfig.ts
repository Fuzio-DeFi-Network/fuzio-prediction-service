import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"
import { type Config } from "@fuzio/contracts/types/FuzioNativePrediction.types"

export const getConfig = async (queryClient: FuzioNativePredictionQueryClient): Promise<Config> => {
	const config = await queryClient.config()
	return config
}
