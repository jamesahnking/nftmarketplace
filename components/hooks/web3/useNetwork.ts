// This file handles indentifying the network the apps connected to 
// Pattern is used in useAccounts.ts also 

import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";

type UseNetworkResponse = {
    connect: () => void;
    isLoading: boolean;
    isInstalled: boolean;
}

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>

export type UseNetworkHook = ReturnType<NetworkHookFactory>

export const hookFactory: NetworkHookFactory = ({provider, isLoading}) => () => {
   const {data, isValidating, ...swrRes} = useSWR(
        provider ? "web3/useNetwork" : null, 
          async () => {

            // get chain ID mapping
            // k is the network number
            const NETWORK: {[k: string]: string} = {
                1: "Ethereum MainNetwork",
                3: "Ropsten Testnet",
                4: "Rinkeby Testnet",
                5: "Goerli Testnet",
                56: "Binance Smart Chain",
                1337: "Ganache",
            }

            const chainId = (await provider!.getNetwork()).chainId
            
            if(!chainId) {
                throw "Cannot retrieve network. Please, refresh browser or try connecting to another network."
            }
            // *
            return NETWORK[chainId];   
            
        }, 
            // Update the data when refocusing the window 
            { revalidateOnFocus: false 
        }
    );
       
    return { 
        ...swrRes, //hookFactory
        data, //hookFactory
        isValidating, //hookFactory
        isLoading: isLoading || isValidating, //hookFactory
    };
}
