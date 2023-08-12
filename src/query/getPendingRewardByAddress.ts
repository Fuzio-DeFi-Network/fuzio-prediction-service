/* eslint-disable @typescript-eslint/naming-convention */
import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getPendingRewardByAddress = async (
	queryClient: FuzioNativePredictionQueryClient,
	player: string
): Promise<string> => {
	try {
		const { pending_reward } = await queryClient.myPendingReward({ player })
		return pending_reward
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("An error occurred:", error)
		throw error
	}
}
