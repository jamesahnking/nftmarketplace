import { useHooks } from "@providers/web3";

// Account Abstraction 
export const useAccount = () => {
    const hooks = useHooks(); // gets hooks 
    const swrRes = hooks.useAccount(); // gets the return data
   
    return {
        account: swrRes // grab the response and pass on to components
    }
}
 
// Network Abstraction
export const useNetwork = () => {
    const hooks =  useHooks();
    const swrRes = hooks.useNetwork();

    return {
        network: swrRes
    }
}