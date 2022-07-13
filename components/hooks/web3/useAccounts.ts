// Generate Next JS Webhooks for user account
import { CryptoHookFactory } from "@_types/hooks";
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
    isLoading: boolean;
    isInstalled: boolean;
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

// HookFactory Dependencies are:
// a. provider
// b. ethereum
// c. contract (web3State)

export const hookFactory: AccountHookFactory = ({provider, ethereum, isLoading}) => () => {
   const {data, mutate, isValidating, ...swrRes} = useSWR(
        provider ? "web3/useAccount" : null, 
        // ask for new data 
          async () => {
                console.log("AccountHookFactory REVALIDATING!")

                const accounts = await provider!.listAccounts();
                const account = accounts[0];

                if(!account) {
                    throw "Cant retrieve any accounts! Connect to a web3 wallet."
                }
                return account;   
            }, 

            { revalidateOnFocus: false,
              shouldRetryOnError: false
             }
        );
       
        // State for handling when accouts have changed 
        useEffect(() =>{ 
            // subscribe to listener
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
            } else if (accounts[0] !== data) {
                mutate(accounts[0]); 
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

    return { 
        ...swrRes, //hookFactory
        data, //hookFactory
        isValidating, //hookFactory
        isLoading: isLoading as boolean, //hookFactory
        isInstalled: ethereum?.isMetaMask || false, //hookFactory
        mutate, // handleAccountsChanged
        connect // connect
    };
}
