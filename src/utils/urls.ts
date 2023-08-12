export const rpcUrl = `https://rpc-sei${
	process.env.SEI_NETWORK !== "MAINNET" && "-testnet"
}.rhinostake.com/`
