import { createContext, useContext, useState } from "react";
import { FunctionComponent } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { Web3State, createDefaultState } from "./utils";


// The web3 provider will wrap all components in _app.tsx
const Web3Context = createContext<Web3State>(createDefaultState());

interface Props {
    children: React.ReactNode;
}

const Web3Provider: FunctionComponent<Props> = ({children}) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())
    
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

export default Web3Provider;