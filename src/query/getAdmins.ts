import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getAdmins = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<string[]> => {
	const { admins } = await queryClient.getAdmins()
	return admins
}
