import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";


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

// export params ant types 
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