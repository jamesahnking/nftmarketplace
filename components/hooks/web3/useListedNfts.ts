import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";

// UseLIstedNftsHook provides list of nfts to the application via web3 from the chain.

type UseListedNftsResponse = { 
  buyNft: (token: number, value: number) => Promise<void>
}

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as Nft[];
      const coreNfts = await contract!.getAllNftsOnSale();

      // loop through list of Nfts
      for(let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i]; // extract items individ
        const tokenURI = await contract!.tokenURI(item.tokenId); //fetch URI
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
    
        // BUY NFT
    const _contract = contract;
    const buyNft = useCallback (async (tokenId: number, value: number) => {
      
      try {
        const result = await _contract!.buyNft(
          tokenId, {
            value: ethers.utils.parseEther(value.toString())
          }
        )

        await toast.promise(
          result!.wait(), {
            pending: "Processing transaction",
            success: "Your NFT has been purchased! Got to your Profile Page",
            error: "Processing error"
          }
        );
      } catch (e: any) {
        console.error(e.message);
      }
    }, [_contract]) 

    return {
      ...swr,
      buyNft,
      data: data || [],
    };
} 