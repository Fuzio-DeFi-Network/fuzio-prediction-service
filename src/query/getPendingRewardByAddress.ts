import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getPendingRewardByAddress = async (
	queryClient: FuzioNativePredictionQueryClient,
	player: string
): Promise<string> => {
	const { pending_reward } = await queryClient.myPendingReward({ player })
	return pending_reward
}
