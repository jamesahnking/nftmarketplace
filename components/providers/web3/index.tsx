import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { Web3State, createDefaultState, loadContract, createWeb3State } from "./utils";
import { ethers } from "ethers";
import { setupHooks } from "@hooks/web3/setupHooks";


// The web3 provider will wrap all components in _app.tsx
const Web3Context = createContext<Web3State>(createDefaultState());

interface Props {
    children: React.ReactNode;
}

const Web3Provider: FunctionComponent<Props> = ({children}) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())
  
  // @dev MetaMask injects a global API into websites visited by its users at window.ethereum 
  useEffect(() => {
     async function initWeb3() {

        // Define 'provider'
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);

        // Load Contract 
        const contract = await loadContract("NftMarket", provider); 

        // Initializing Metamask Wallet
        setWeb3Api(createWeb3State({
          ethereum: window.ethereum,
          provider, 
          contract, 
          isLoading: false
        }))
        }
      initWeb3();
  }, [])


return (
    <Web3Context.Provider value={web3Api}>
        {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
    // choose the context. 
    return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;