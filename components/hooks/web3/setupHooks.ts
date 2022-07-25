import { Web3Dependencies } from "@_types/hooks";
import {hookFactory as createAccountHook, UseAccountHook } from "./useAccounts";
import {hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";
import {hookFactory as createListedNftsHook, UseListedNftsHook } from "./useListedNfts";

// @return: user account hooks 
export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook; 
    useListedNfts: UseListedNftsHook;
}

// Accepts dependency
// @return: web3hooks 
export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks;
}

// responsible for setting up our application hooks
// accepts ethereum provider
// metamask prvoder and contract 

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
        useListedNfts: createListedNftsHook(deps),
    }
}