import type { NextPage } from 'next';
import { BaseLayout, NftList } from '@ui';
import nfts from "../content/meta.json";
import { NftMeta } from '@_types/nft';
import { useWeb3 } from '@providers/web3';

// @dev - This is your applications homepage 
const Home: NextPage = () => {

  // Load Web3 provider and contract
  const { provider, contract } = useWeb3();

  const getNftInfo = async () => {
    console.log(await contract!.name());
    console.log(await contract!.symbol());
  }

  // conditional  
  if (contract) {
    getNftInfo();
  }
  
  // print contract to console
  console.log(contract);
  // print provider to console
  console.log(provider);
  
  // get current account of Metamask wallet 
  const getAccounts = async () => {
    const accounts = await provider!.listAccounts();
    //prints current Metamask account to console
    console.log(accounts[0]);
  }

  // list accounts via getAccounts
  if (provider) {
    getAccounts();
  }

  return (
    <BaseLayout>
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Amazing Creatures NFTs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>

        <NftList 
        // casting as NftMeta
          nfts={ nfts as NftMeta[] }
        />

        </div>
      </div>
    </BaseLayout>
  )
}

export default Home
