import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";


// UseOwnedNftHook provides list of nfts to the application via we3 from the chain.

type UseOwnedNftsResponse = {
  listNft: (tokenId: number, price: number) => Promise<void>
}
type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory = ({contract}) => () => {
    const {data, ...swr} = useSWR(
        contract ? "web3/useOwnedNfts" : null,
        async () => {
          const nfts = [] as Nft[]; // create container for nfts 
          const coreNfts = await contract!.getOwnedNfts(); // get all the nfts on sale  

          // loop through list of Nfts
          for(let i = 0; i < coreNfts.length; i++) {
            const item = coreNfts[i];
            const tokenURI = await contract!.tokenURI(item.tokenId);
            const metaRes = await fetch(tokenURI); // fetch pinata link
            const meta = await metaRes.json(); // fetch json

            nfts.push({ // add object to list
                price: parseFloat(ethers.utils.formatEther(item.price)),
                tokenId: item.tokenId.toNumber(),
                creator: item.creator,
                isListed: item.isListed,
                meta
            })
          }
          return nfts; //return list of nfts
         }
        )
      
        // List Nfts
        const _contract = contract;
        const listNft = useCallback(async (tokenId: number, value: number) => {
          
          try{ 
            const result = await _contract!.placeNftOnSale( 
              tokenId, 
              ethers.utils.parseEther(value.toString()),
              {
              value: ethers.utils.parseEther(0.025.toString())
            }
          ) 
          // await result?.wait(); // check if the nft is already listed
          // alert("Item has been listed");    
          await toast.promise(
            result!.wait(), {
              pending: "Processing transaction",
              success: "Item has been listed",
              error: "Processing error"
            }
          );

          } catch(e:any){
            console.error(e.message);
          }  
        }, [_contract]) 

        return {
          ...swr,
          listNft,
          data: data || [],
      };
    } 