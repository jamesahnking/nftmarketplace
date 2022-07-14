// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
   
    // @dev: For incrementing and decrementing 
    using Counters for Counters.Counter;
    
    // @dev: how many nfts are for sale items for sale on the market 
    Counters.Counter private _listedItems;
    // @dev: nft token id total that have been created for the smart contract. 
    Counters.Counter private _tokenIds;
     
    constructor() ERC721("FuzzWhalinesNFT", "FZLN") {}

    // gerenate new nft token 
    // nft uri is the json wiht the metadata 
    function mintToken(string memory tokenURI) public payable returns (uint) {
       
       //increament token counter 
        _tokenIds.increment();
        _listedItems.increment();

        // get the value of the current token 
        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

}