import { type FuzioNativePredictionQueryClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const getAdmins = async (
	queryClient: FuzioNativePredictionQueryClient
): Promise<string[]> => {
	try {
		const { admins } = await queryClient.getAdmins()
		return admins
	} catch (error) {
		console.error("An error occurred:", error)
		throw error
	}
}
