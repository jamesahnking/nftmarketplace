import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";

// UseLIstedNftsHook provides list of nfts to the application via we3 from the chain.

type UseListedNftsResponse = {}
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
    const {data, ...swr} = useSWR(
        contract ? "web3/useListedNfts" : null,
        async () => {
          const nfts = [] as Nft[]; // create container for nfts 
          const coreNfts = await contract!.getAllNftsOnSale(); // get all the nfts on sale  

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
          // debugger
          return nfts; //return list of nfts
        }
        )
        return {
          ...swr,
          data: data || [],
        };
    } 