// hooks for types
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";


export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: Contract;
    ethereum: MetaMaskInpageProvider;
}

// Rename SWRResponse
export type CryptoSWRResponse = SWRResponse;

// Handler funt to return SWRResponse
export type CryptoHandlerHook = (params: any) => CryptoSWRResponse;

// Accepts web3 dependencies 
// Returns 
export type CryptoHookFactory = {
    (d: Partial <Web3Dependencies>):CryptoHandlerHook;
}