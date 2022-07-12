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
        // ask for new data 
          async () => {
                return"Testing Network";   
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
