import { createContext, useContext, useState } from "react";
import { FunctionComponent } from "react";


// The web3 provider will wrap all components in _app.tsx
const Web3Context = createContext<any>(null);

interface Props {
    children: React.ReactNode;
}

const Web3Provider: FunctionComponent<Props> = ({children}) => {

  const [web3Api, setWeb3Api] = useState({test: "Hello Web3 Provider!"})
    
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