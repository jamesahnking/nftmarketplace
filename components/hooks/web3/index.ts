import { useHooks } from "@providers/web3";

// Use Account Abstraction 
export const useAccount = () => {
    const hooks = useHooks(); // gets hooks 
    const swrRes = hooks.useAccount(); // gets the return data
   
    return {
        account: swrRes // grab the response and pass on to components
    }
}