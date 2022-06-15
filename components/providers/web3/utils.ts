import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";


// Export Web3 types - ? allowing undefined 
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