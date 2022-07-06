// Generate Next JS Webhooks for user account
import { CryptoHookFactory } from "@_types/hooks";
import { getAccountPath } from "ethers/lib/utils";
import useSWR from "swr";

// This file Responsible for the initialization of our useAccount Function
// This will provide contract and ethereum provider to make the 
// connection and get the account 

// The name “SWR” is derived from stale-while-revalidate, 
// SWR is a strategy to first return the data from cache (stale), then 
// send the fetch request (revalidate), and finally come with the up-to-date data.

type UseAccountResponse = {
    connect: () => void;
}

// the string from swrRes and the response from the wallet
type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

// hookFactory dependencies are:
// a. provider
// b. ethereum
// c. contract (web3State)

export const hookFactory: AccountHookFactory = ({provider, ethereum}) => () => {
   const swrRes = useSWR(
        provider ? "web3/useAccount" : null, 
          async () => {
                console.log("AccountHookFactory REVALIDATING!")

                const accounts = await provider!.listAccounts();
                const account = accounts[0];

                if(!account) {
                    throw "Cant retrieve any accounts! Connect to a web3 wallet."
                }
                return account;   
            }, 
            // update the data when refocusing the window 
            { revalidateOnFocus: false }
        );

        // Wallet Connect Function
        const connect = async () => {
            try {
                // open the connection to connect wallet
                ethereum?.request({method: "eth_requestAccounts"});
            } catch(e) {
                console.error(e);
                }
        }

    // The response will contains the user account address      
    return { ...swrRes, connect };
}
