import { FuzioNativePredictionClient } from "@fuzio/contracts/types/FuzioNativePrediction.client"

export const closeRound = async (client: FuzioNativePredictionClient) => {
	try {
		const status = await client.status()
		const liveRoundremainTime =
			Number(status.live_round?.close_time) - Number(status.current_time)

		if (
			status.live_round &&
			Number(status.live_round?.close_time) <= Number(status.current_time)
		) {
			await client.closeRound("auto", `Fuzio | Closed Round ${status.live_round.id}`)
			console.log(`=== Closed Round ${status.live_round.id} ===`)
		} else {
			console.log(`=== Current Round did not finish yet. ===`)
			console.log("Remaining Time:", Number(liveRoundremainTime / 1e9).toFixed(2))
		}
	} catch (error) {
		console.error("An error occurred:", error)
		throw error
	}
}
