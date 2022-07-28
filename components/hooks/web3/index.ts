import { useHooks } from "@providers/web3";

// Export Account hook abstraction
export const useAccount = () => {
    const hooks = useHooks(); // gets hooks 
    const swrRes = hooks.useAccount(); // gets the return data
   
    return {
        account: swrRes // grab the response and pass on to components
    }
}
 
// Export Network Connect hook abstraction
export const useNetwork = () => {
    const hooks =  useHooks();
    const swrRes = hooks.useNetwork();

    return {
        network: swrRes
    }
}

// Export Listed Nfts hook abstraction
export const useListedNfts = () => {
    const hooks =  useHooks();
    const swrRes = hooks.useListedNfts();

    return {
        nfts: swrRes
    }
}
// Export Listed Owned Nfts hook abstraction 

export const useOwnedNfts = () => {
    const hooks =  useHooks();
    const swrRes = hooks.useOwnedNfts();

    return {
        nfts: swrRes
    }
}



