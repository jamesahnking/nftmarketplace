// Generate Next JS Webhooks for user account
import { CryptoHookFactory } from "@_types/hooks";
import { getAccountPath } from "ethers/lib/utils";
import { useEffect } from "react";
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

// The string from swrRes and the response from the wallet
type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

// HookFactory Dependencies are:
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
            // Update the data when refocusing the window 
            { revalidateOnFocus: false }
        );

        
        // State for handling when accouts have changed 
        useEffect(() =>{ 
            // subscribe 
            ethereum?.on('accountsChanged', handleAccountsChanged);
            return () => {
                //unsubscribe from listener
               ethereum?.removeListener("accountsChanged",handleAccountsChanged);
            }
        })

        // Alerts when the account has changed 
        const handleAccountsChanged = (...args: unknown[]) => {
            const accounts = args[0] as string[]; 
            if (accounts.length === 0) {
                console.error("Please, connect to your Web3 wallet");
            } else if (accounts[0] !== swrRes.data) {
                alert("account has changed");
                console.log(accounts[0]);
            }
        }   
        
    
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
