export const rpcUrl = `https://rpc${
	process.env.SEI_NETWORK !== "MAINNET" && "-testnet"
}.sei-apis.com/`
