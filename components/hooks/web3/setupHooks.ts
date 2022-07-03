import { Web3Dependencies } from "@_types/hooks";
import {hookFactory as createAccountHook, UseAccountHook } from "./useAccounts" 

export type Web3Hooks = {
    // returns user account hooks 
    useAccount: UseAccountHook; 
}

export type SetupHooks = {
    // accepts dependency and returns web3hooks 
    (d: Web3Dependencies): Web3Hooks;
}

// resposible for setting up our hooks
export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps)
    }
}