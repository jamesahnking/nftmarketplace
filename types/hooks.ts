// Hook types
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

// Web3 needs
export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: Contract;
    ethereum: MetaMaskInpageProvider;
}

// Rename SWRResponse
export type CryptoSWRResponse <D = any> = SWRResponse;

// Handler funt to return SWRResponse
export type CryptoHandlerHook <D = any, P = any>  = (params: any) => CryptoSWRResponse;

// Accepts web3 dependencies 
export type CryptoHookFactory <D = any, P = any> = { (d: Partial <Web3Dependencies>):CryptoHandlerHook; }


