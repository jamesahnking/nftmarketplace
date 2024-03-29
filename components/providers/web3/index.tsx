import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { Web3State, createDefaultState, loadContract, createWeb3State } from "./utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@_types/nftMarketContract";


// Reloads the browser
const pageReload = () => { window.location.reload(); }

const handleAccount = (ethereum: MetaMaskInpageProvider ) => async () => {
  const isLocked = !(await ethereum._metamask.isUnlocked());
  if (isLocked) { pageReload(); }  // if not unlocked reload page
}

// Universal load and reload
const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => { 
  ethereum.on("chainChanged", pageReload); 
  ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => { 
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccount(ethereum));
}

// The web3 provider will wrap all components in _app.tsx
const Web3Context = createContext<Web3State>(createDefaultState());

interface Props {
  children: React.ReactNode;
}

const Web3Provider: FunctionComponent<Props>= ({children}) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  // @dev MetaMask injects a global API into websites visited by its users at window.ethereum 
  useEffect(() => {
     async function initWeb3() {
        try {
          // Define 'provider'
          const provider = new ethers.providers.Web3Provider(window.ethereum as any);
          // Load Contract 
          const contract = await loadContract("NftMarket", provider);
          
          // Expose web3 provider
          const signer = provider.getSigner();
          const signedContract = contract.connect(signer);

          setGlobalListeners(window.ethereum);
          // Initializing Metamask Wallet
          setWeb3Api(createWeb3State({
            ethereum: window.ethereum,
            provider, 
            contract: signedContract as unknown as NftMarketContract, 
            isLoading: false
        }))
        } catch(e: any) {
          console.error("Install a web3 wallet");
          // => callback if theres no wallet installed 
          setWeb3Api((api) => createWeb3State({
            ...api as any,
            isLoading:false,
          }))
        }
    }
      initWeb3();
      return() => removeGlobalListeners(window.ethereum);
  }, [])


  // Return the web3 wrapper 
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