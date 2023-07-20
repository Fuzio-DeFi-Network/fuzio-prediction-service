import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getPendingRewardByAddressPerRound = async (
	queryClient: FuzioNativePredictionQueryClient,
	player: string,
	roundId: string
): Promise<string> => {
	const { pending_reward } = await queryClient.myPendingRewardRound({ player, roundId })
	return pending_reward
}
