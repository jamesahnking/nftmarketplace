import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Dependencies } from "@_types/hooks";
import { Contract, providers,ethers } from "ethers";

// GLOBAL Application Functions and Types

// global window.ethereum definition 

// @dev MetaMask injects a global API into websites visited by its users at window.ethereum 
declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

// Make an item nullable
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
}

// Export types and params  ;-) Stackin Pramz!
export type Web3State = {
    isLoading: boolean; //true while loading webState
    hooks: Web3Hooks; // hook definitions
} & Nullable<Web3Dependencies>



// Set default loading state function
export const createDefaultState = () => {
    return {
        // nothing has been loaded because its still loading ;-)
        ethereum: null,
        provider: null,
        contract: null,
        isLoading: true,
        hooks:setupHooks({} as any),
    }
}

// Capture web3 state 
export const createWeb3State = ({
    ethereum, provider, contract, isLoading 
}: Web3Dependencies & {isLoading: boolean}) => { 
    return {
        // nothing has been loaded because its still loading ;-)
        ethereum,
        provider,
        contract,
        isLoading,
        hooks:setupHooks({ethereum, provider, contract}),
    }
}

// Load contract into Next JS
// import network contract lives on 
const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

// name: name of contract
// provider: Web3 ethers provider

export const loadContract = async (
    name: string, //Nft contract name
    provider: providers.Web3Provider
    ): Promise<Contract> => {
    // create instance of contract

    // do you have the network id? 
    if (!NETWORK_ID) {
        //reject
        return Promise.reject(" A network ID is not defined!");
    }
    //otherwise fetch the contracts json representation
    const res = await fetch(`/contracts/${name}.json`);
    
    //store the file
    const Artifact = await res.json(); 

    // do you have a network address where the contract lives? 
    if (Artifact.networks[NETWORK_ID].address) {
        // load the contract
        // 1. address
        // 2. abi
        // 3. provdier
        const contract = new ethers.Contract(
            Artifact.networks[NETWORK_ID].address,
            Artifact.abi,
            provider
        )
        return contract; 
    }  else {
        // if you dont have an address
        return Promise.reject(`Contract: [${name}] cannot be loaded!`);

    }
}


