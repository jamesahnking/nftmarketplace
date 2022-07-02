// hooks for types
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

// Web3 needs
export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: Contract;
    ethereum: MetaMaskInpageProvider;
}

// Accepts web3 dependencies 
export type CryptoHookFactory = {(d: Partial <Web3Dependencies>):CryptoHandlerHook; }
// Handler funt to return SWRResponse
export type CryptoHandlerHook = (params: any) => CryptoSWRResponse;
// Rename SWRResponse
export type CryptoSWRResponse = SWRResponse;

