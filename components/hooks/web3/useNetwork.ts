// This file handles indentifying the network the apps connected to 
// Pattern is used in useAccounts.ts also 

import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type UseNetworkResponse = {
    isLoading: boolean;
    isSupported: boolean;
    targetNetwork: string;
    isConnectedToNetwork: boolean;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>
export type UseNetworkHook = ReturnType<NetworkHookFactory>

// get chain ID mapping - k is the network number
const NETWORK: {[k: string]: string} = {
    1: "Ethereum MainNetwork",
    3: "Ropsten Testnet",
    4: "Rinkeby Testnet",
    5: "Goerli Testnet",
    56: "Binance Smart Chain",
    1337: "Ganache",
    5777: "Ganache"
}

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORK[targetId];


export const hookFactory: NetworkHookFactory = ({provider, isLoading,}) => () => {
   const {data, isValidating, ...swrRes} = useSWR(
        provider ? "web3/useNetwork" : null, 
          async () => {

            const chainId = (await provider!.getNetwork()).chainId;
            
            if(!chainId) {
                throw "Cannot retrieve the Ganache network. Please, refresh browser or try connecting to another network."
            }
            // *
            return NETWORK[chainId];   
        }, 
            // Update the data when refocusing the window 
            { revalidateOnFocus: false 
        }
    );

    // Supporting check
    const isSupported = data === targetNetwork;
       
    return { 
        ...swrRes, 
        data, 
        isValidating, 
        targetNetwork,
        isSupported,
        isConnectedToNetwork: !isLoading && isSupported,
        isLoading: isLoading as boolean, 
    };
}
