import { getAdmins } from "./query/getAdmins"
import { getClaimInfoByUser } from "./query/getClaimInfoByUser"
import { getClaimInfoPerRound } from "./query/getClaimInfoPerRound"
import { getConfig } from "./query/getConfig"
import { getContractAddress } from "./query/getContractAddress"
import { getCurrentPositionByAddress } from "./query/getCurrentPositionByAddress"
import { getGameListByAddress } from "./query/getGameListByAddress"
import { getPendingRewardByAddress } from "./query/getPendingRewardByAddress"
import { getPendingRewardByAddressPerRound } from "./query/getPendingRewardByAddressPerRound"
import { getRoundById } from "./query/getRoundById"
import { getStatus } from "./query/getStatus"
import { getUsersPerRound } from "./query/getUsersPerRound"
import { closeRound } from "./tx/endRound"
import { cron } from "./utils/cron"
import { rpcUrl } from "./utils/urls"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Decimal } from "@cosmjs/math"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { GasPrice } from "@cosmjs/stargate"
import { swagger } from "@elysiajs/swagger"
import { contracts } from "@fuzio/contracts"
import { Elysia } from "elysia"

// eslint-disable-next-line canonical/id-match
const signer = await DirectSecp256k1HdWallet.fromMnemonic(
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	process.env.MNEMONIC!,
	{
		prefix: "sei"
	}
)

const signerAccount = await signer.getAccounts()

const signingCosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
	rpcUrl,
	signer,
	{ gasPrice: new GasPrice(Decimal.fromAtomics("100000", 6), "usei") }
)

const {
	FuzioNativePrediction: {
		FuzioNativePredictionClient,
		FuzioNativePredictionQueryClient
	}
} = contracts

const client = new FuzioNativePredictionClient(
	signingCosmWasmClient,
	signerAccount[0].address,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	process.env.CONTRACT_ADDRESS!
)

const queryClient = new FuzioNativePredictionQueryClient(
	signingCosmWasmClient,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	process.env.CONTRACT_ADDRESS!
)

const app = new Elysia()
	.get(
		"/",
		() => `
                                  _____________
                           __,---'::.-  -::_ _ '-----.___      ______
                       _,-'::_  ::-  -  -. _   ::-::_   .'--,'   :: .:'-._
                    -'_ ::   _  ::_ .:   :: - _ .:   ::- _/ ::   ,-. ::. '-._
                _,-'   ::-  ::        ::-  _ ::  -  ::     |  .: ((|))      ::'
        ___,---'   ::    ::    ;::   ::     :.- _ ::._  :: | :    '_____::..--'
    ,-""  ::  ::.   ,------.  (.  ::  |  ::  ::  ,-- :. _  :'. ::  |       '-._
   '     ::   '   _._.:_  :.)___,-------------._ :: ____'-._ '._ ::'--...___; ;
 ;:::. ,--'--"""""      /  /                     |. |     ''-----''''---------'
;  '::;              _ /.:/_,                    _|.:|_,
|    ;             ='-//||--"                  ='-//||--"
'   .|               ''  ''                     ''  ''
 |::'|
  |   |    🦎🦎🦎 Congratulations, you found this service. Much love from Fuzio <3 🦎🦎🦎
   '..:'.
     '.  '--.____
       '-:______ '-._
                '---'
`
	)
	.group("/config", (elysiaAppOne) =>
		elysiaAppOne
			.get("/status", async () => await getStatus(queryClient))
			.get(
				"/contractAddress",
				async () => await getContractAddress(queryClient)
			)
			.get("/admins", async () => await getAdmins(queryClient))
			.get("/", async () => await getConfig(queryClient))
	)
	.group("/user", (elysiaAppTwo) =>
		elysiaAppTwo
			.get(
				"/:address/pendingReward",
				async ({ params: { address } }) =>
					await getPendingRewardByAddress(queryClient, address)
			)
			.get(
				"/:address/currentPosition",
				async ({ params: { address } }) =>
					await getCurrentPositionByAddress(queryClient, address)
			)
			.get(
				"/:address/gameList",
				async ({ params: { address } }) =>
					await getGameListByAddress(queryClient, address)
			)
			.get(
				"/:address/pendingRewardByRound/:id",
				async ({ params: { address, id } }) =>
					await getPendingRewardByAddressPerRound(queryClient, address, id)
			)
			.get(
				"/:address/claimInfo",
				async ({ params: { address } }) =>
					await getClaimInfoByUser(queryClient, address)
			)
	)
	.group("/round", (elysiaAppThree) =>
		elysiaAppThree
			.get(
				"/:id/users",
				async ({ params: { id } }) => await getUsersPerRound(queryClient, id)
			)
			.get(
				"/:id",
				async ({ params: { id } }) => await getRoundById(queryClient, id)
			)
			.get(
				"/:id/claimInfo",
				async ({ params: { id } }) =>
					await getClaimInfoPerRound(queryClient, id)
			)
	)
	.use(
		swagger({
			documentation: {
				info: {
					contact: {
						name: "Telegram",
						url: "https://fuzio.network/social/telegram"
					},
					description: "API Routes for the Fuzio Prediction game",
					title: "Fuzio Prediction Service",
					version: "1.1.0"
				}
			}
		})
	)
	.use(
		cron({
			name: "Close Round",
			pattern: "*/5 * * * * *",
			async run() {
				await closeRound(client, queryClient)
			}
		})
	)
	.onError(({ code, set }) => {
		if (code === "NOT_FOUND") {
			set.status = 404

			return "Route Not Found :("
		}

		if (code === "VALIDATION") {
			return "Validation Error :("
		}

		if (code === "INTERNAL_SERVER_ERROR") {
			return "Internal Server Error :("
		}

		if (code === "PARSE") {
			return "Parsing Error :("
		} else {
			return "Unknown Error :("
		}
	})
	.listen(3_000)

// eslint-disable-next-line no-console
console.log(
	`🦎 Fuzio Prediction Microservice started at ${app.server?.hostname}:${app.server?.port}`
)
