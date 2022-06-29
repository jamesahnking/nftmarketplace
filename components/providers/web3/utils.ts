require('dotenv').config();
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers,ethers } from "ethers";



// global window.ethereum definition 
// @dev MetaMask injects a global API into websites visited by its users at window.ethereum 
declare global {
    interface Window {
        ethereum: MetaMaskInpageProvider;
    }
}

// Export Web3 types
export type Web3Params= {
    ethereum: MetaMaskInpageProvider | null;
    provider: providers.Web3Provider | null;
    contract: Contract | null;
  }

// export params and types 
export type Web3State = {
    isLoading: boolean; //true wulile loading webState
} & Web3Params


// Set default loading state function
export const createDefaultState = () => {
    return {
        // nothing has been loaded because its still loading ;-)
        ethereum: null,
        provider: null,
        contract: null,
        isLoading: true,
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


