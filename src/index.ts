import { Elysia } from "elysia"
import cron from "./utils/cron"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { contracts } from "@fuzio/contracts"
import { getStatus } from "./query/getStatus"
import { closeRound } from "./tx/endRound"
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing"
import { swagger } from "@elysiajs/swagger"
import { GasPrice } from "@cosmjs/stargate"
import { Decimal } from "@cosmjs/math"
import { getPendingRewardByAddress } from "./query/getPendingRewardByAddress"
import { getGameListByAddress } from "./query/getGameListByAddress"
import { getUsersPerRound } from "./query/getUsersPerRound"
import { getRoundById } from "./query/getRoundById"
import { getCurrentPositionByAddress } from "./query/getCurrentPositionByAddress"
import { getPendingRewardByAddressPerRound } from "./query/getPendingRewardByAddressPerRound"
import { getContractAddress } from "./query/getContractAddress"
import { getAdmins } from "./query/getAdmins"
import { getConfig } from "./query/getConfig"
import { getClaimInfoByUser } from "./query/getClaimInfoByUser"
import { getClaimInfoPerRound } from "./query/getClaimInfoPerRound"

const signer = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC ?? "", {
	prefix: "sei"
})

const signerAccount = await signer.getAccounts()

const signingCosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
	"https://rpc-sei-testnet.rhinostake.com/",
	signer,
	{ gasPrice: new GasPrice(Decimal.fromAtomics("100000", 6), "usei") }
)

const {
	FuzioNativePrediction: { FuzioNativePredictionClient }
} = contracts

const client = new FuzioNativePredictionClient(
	signingCosmwasmClient,
	signerAccount[0].address,
	"sei1wtm234jw7ewdq2aqs0r7eq5t4vhwknpjdd0r7g6fdu4aj4wfedlq8w6pua"
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
	.group("/config", (app) =>
		app
			.get("/status", async () => await getStatus(client))
			.get("/contractAddress", async () => await getContractAddress(client))
			.get("/admins", async () => await getAdmins(client))
			.get("/", async () => await getConfig(client))
	)
	.group("/user", (app) =>
		app
			.get(
				"/:address/pendingReward",
				async ({ params: { address } }) => await getPendingRewardByAddress(client, address)
			)
			.get(
				"/:address/currentPosition",
				async ({ params: { address } }) => await getCurrentPositionByAddress(client, address)
			)
			.get(
				"/:address/gameList",
				async ({ params: { address } }) => await getGameListByAddress(client, address)
			)
			.get(
				"/:address/pendingRewardByRound/:id",
				async ({ params: { address, id } }) =>
					await getPendingRewardByAddressPerRound(client, address, id)
			)
			.get(
				"/:address/claimInfo",
				async ({ params: { address } }) => await getClaimInfoByUser(client, address)
			)
	)
	.group("/round", (app) =>
		app
			.get("/:id/users", async ({ params: { id } }) => await getUsersPerRound(client, id))
			.get("/:id", async ({ params: { id } }) => await getRoundById(client, id))
			.get(
				"/:id/claimInfo",
				async ({ params: { id } }) => await getClaimInfoPerRound(client, id)
			)
	)
	.use(
		swagger({
			documentation: {
				info: {
					title: "Fuzio Prediction Service",
					version: "1.0.0",
					description: "API Routes for the Fuzio Prediction game",
					contact: { name: "Telegram", url: "https://fuzio.network/social/telegram" }
				}
			}
		})
	)
	.use(
		cron({
			name: "Close Round",
			pattern: "*/5 * * * * *",
			async run() {
				await closeRound(client)
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
		}
		if (code === "UNKNOWN") {
			return "Unknown Error :("
		}
	})
	.listen(3000)

console.log(
	`🦎 Fuzio Prediction Microservice started at ${app.server?.hostname}:${app.server?.port}`
)
