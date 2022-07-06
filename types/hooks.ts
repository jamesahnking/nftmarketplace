// Hook types
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";


// Web3 Dependency Type definition
export type Web3Dependencies = {
    provider: providers.Web3Provider;
    contract: Contract;
    ethereum: MetaMaskInpageProvider;
}

// Type definition for the SWR handler and respons structure
export type CryptoHandlerHook<D = any, R = any, P = any> = (params?: P) => CryptoSWRResponse<D, R>

// Type definition for web3 connection and retrieval of account and response structure, 
export type CryptoHookFactory <D = any, R =any, P = any> = { (d: Partial <Web3Dependencies>):CryptoHandlerHook; }

//swr response type definintion 
export type CryptoSWRResponse <D = any, R = any> = SWRResponse<D> & R;
