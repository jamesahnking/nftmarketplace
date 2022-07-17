// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
   
    // @dev: For incrementing and decrementing 
    using Counters for Counters.Counter;

    // @dev: list of used tokenURIs - ( the links to Pinata JSON URIs)
    mapping(string => bool) private _usedTokenURIs;
    
    // @dev: NFT id mapping
    mapping(uint => NftItem) private _idToNftItem;

    // @dev: NFT item structure
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    
    // @ dev: outputs creation of NFT item 
    event NftItemCreated (
        uint tokenId,
        uint price, 
        address creator,
        bool isListed
    );

    // @dev: _listedItems how many nfts are for sale on the market 
    // @dev: _tokenIds: total items that have been created from the smart contract. 
    
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;
     
    constructor() ERC721("FuzzAlinesNFT", "FZLN") {}

    // mint token (NFT) - takes token uri and its price 
    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        require(!tokenURIExists(tokenURI), "Token URI already exists");

       // increament token counter 
        _tokenIds.increment();
        _listedItems.increment();
        _usedTokenURIs[tokenURI] = true;

        // get the token id of the current nft
        uint newTokenId = _tokenIds.current();

        // Pass in inputs for minting and incrementing
        _safeMint(msg.sender, newTokenId); // mint token from this address
        _setTokenURI(newTokenId, tokenURI); // attach token URI to id
        _createNftItem(newTokenId, price); // attach price and generate token

        return newTokenId;
    }
   
    // @dev - Generate NFT Item 
    function _createNftItem( uint tokenId, uint price) private {
            require(price > 0, "Price must be at least one wei");
            
            _idToNftItem[tokenId] = NftItem(
                tokenId,
                price,
                msg.sender,
                true
            );
            
            emit NftItemCreated(tokenId, price, msg.sender, true );
        }

    //@dev get Nft Item 
    function getNftItem(uint tokenId) public view returns 
        (NftItem memory) {
            return _idToNftItem[tokenId];
        }
    // @dev retrieve the amount of nfts generated at present time
    function listedItemCount() public view returns (uint) {
        return _listedItems.current();
    }

    // @dev: Verify token existence 
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

}