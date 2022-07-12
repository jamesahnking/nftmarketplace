import { Web3Dependencies } from "@_types/hooks";
import {hookFactory as createAccountHook, UseAccountHook } from "./useAccounts";
import {hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";

// returns user account hooks 
export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook; 
}

// accepts dependency and returns web3hooks 
export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks;
}

// responsible for setting up our application hooks
// accepts ethereum provider
// metamask prvoder and contract 

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps)
    }
}