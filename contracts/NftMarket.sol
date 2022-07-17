// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
   
    // @dev: For incrementing and decrementing 
    using Counters for Counters.Counter;

    // @dev: list of used tokenIDs
    mapping(string => bool) private _usedTokenURIs;

    // @dev: _listedItems how many nfts are for sale items for sale on the market 
    // _tokenIds nft total that have been created for the smart contract. 
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;
     
    constructor() ERC721("FuzzAlinesNFT", "FZLN") {}

    // mint token (NFT)
    function mintToken(string memory tokenURI) public payable returns (uint) {
        require(!tokenURIExists(tokenURI), "Token URI already exists");

       //increament token counter 
        _tokenIds.increment();
        _listedItems.increment();
        _usedTokenURIs[tokenURI] = true;

        // get the value of the current token 
        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }
   
    // Verify token existence 
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

}