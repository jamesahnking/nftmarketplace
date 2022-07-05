// Generate Next JS Webhooks 
import { CryptoHookFactory } from "@_types/hooks";
import { providers } from "ethers";
import useSWR from "swr";

// The name “SWR” is derived from stale-while-revalidate, 
// a HTTP cache invalidation strategy popularized by HTTP RFC 5861. 
// SWR is a strategy to first return the data from cache (stale), then 
// send the fetch request (revalidate), and finally come with the up-to-date data.

type AccountHookFactory = CryptoHookFactory<string>

export type UseAccountHook = ReturnType<AccountHookFactory>

// hookFactory dependencies are:
// provider
// ethereum
// contract (web3State)
// a function that returns a function

export const hookFactory: AccountHookFactory = ({provider}) => (params) => {
   const swrRes = useSWR(
        provider ? "web3/useAccount" : null, 
        () => {
            return "Test User"
            }
        )
    return swrRes;
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined});

