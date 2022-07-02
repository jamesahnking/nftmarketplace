// Generate Next JS Webhooks 
import useSWR from "swr";
import { debug } from "util";
// Hi   
// Dependencies are:
// provider
// ethereum
// contract (web3State)
// a function that returns a function

export const hookFactory = (deps: any) => (params: any) => {
    const swrRes = useSWR("web3/useAccount", () => {
        debug
        console.log(deps);
        console.log(params);
        return "Test User"
    })

    return swrRes;
}

export const useAccount = hookFactory({ethereum: null, provider: null});

