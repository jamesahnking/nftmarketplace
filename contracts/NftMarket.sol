// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
   
    // For incrementing and decrementing 
    using Counters for Counters.Counter;

    // NFT Object structure
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    
    // @dev: counters are incrementer/decrementer helpers
    // @return: _listedItems - how many nfts are for sale on the market 
    // @return: _tokenIds - the total items that have been created from the smart contract. 
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    // Price for creating and NFT 
    // @dev: This price can be swapped later by an administrator
    uint public listingPrice = 0.025 ether;
    
    // Mapping: indexId => true/false
    mapping(string => bool) private _usedTokenURIs;
    // Mapping: Index of NFTs => Inividual NftItem by tokenId Id 3,6,8,
    mapping(uint => uint) private _idToOwnedIndex;
    // Mapping: OwnerAddress => Index => Nft Token id
    mapping(address => mapping(uint => uint)) private _ownedTokens;
    // Mapping index of to TokenIds
    mapping(uint => uint) private _idToNftIndex;
    // Mapping: NFT id mapped to NFTItem 
    mapping(uint => NftItem) private _idToNftItem;

    // Empty array to stores allNfts
    uint256[] private _allNfts;

    // NFT Creation event 
    event NftItemCreated (
        uint tokenId,
        uint price, 
        address creator,
        bool isListed
    );

    // Total supply of Nft's in the marketplace
    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    // Get an Nft by index
    function tokenByIndex(uint index) public view returns (uint){
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    // Get the owner of the token by index
    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        // Get total supply
        uint allItemsCounts = totalSupply();
        // Start at #1 => 0 
        uint currentIndex = 0;
        // Make items a storage container for NFts and their stuff 
        // @ dev this is an empty arrray .current() specifies the current amount in the array
        NftItem[] memory items = new NftItem[](_listedItems.current());

        // Loop through the total supply of of Nfts     
        for (uint i = 0; i < allItemsCounts; i++) {
            // Return the nfts according to id
            uint tokenId = tokenByIndex(i);
            // Store the NFT based on tokenId
            NftItem storage item = _idToNftItem[tokenId];

            // Check each item listed if isListed is true = for sale 
            // OR false = not for sale
            if (item.isListed == true) {
                // If so set the current index to the item thats true
                items[currentIndex] = item;
                // Add that time/id to the list of isListed items to be returned
                currentIndex += 1;
            }
        }
        // Return all items that are isListed as true 
        return items;
    }

    // Return Owneres NFTs by address and index
    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint ownedItemsCount = ERC721.balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedItemsCount);

        for (uint i = 0; i < ownedItemsCount; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            NftItem storage item = _idToNftItem[tokenId];
            items[i] = item;
        }
        return items;
    }

    constructor() ERC721("FuzzAlinesNFT", "FZLN") {}
    
    // Get an Nft Item by id
    function getNftItem(uint tokenId) public view returns 
        (NftItem memory) {
            return _idToNftItem[tokenId];
        }

    // Retrieve the amount of nfts generated at present time
    function listedItemCount() public view returns (uint) {
        return _listedItems.current();
    }

    // Verify token existence 
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    // Mint token (NFT) - takes token uri and its price 
    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        
        // Token must be unique 
        require(!tokenURIExists(tokenURI), "Token URI already exists");

        // User must pay the listing price to mint an NFT
        require(msg.value == listingPrice, "Message value must be equal to the listing price");
        
        _tokenIds.increment();
        _listedItems.increment();
        _usedTokenURIs[tokenURI] = true;

        // Get the token id of the current nft
        uint newTokenId = _tokenIds.current();

        // Pass in inputs for minting and incrementing
        _safeMint(msg.sender, newTokenId); // mint token from this address
        _setTokenURI(newTokenId, tokenURI); // attach token URI to id
        _createNftItem(newTokenId, price); // attach price and generate token

        return newTokenId;
    }
   
    // Purchase an NFT from contract
    function buyNft(uint tokenId) public payable {
        
        uint price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);
       
        require(msg.sender != owner, "You already own this NFT");
        require(msg.value == price, "Submit the asking price of the NFT");

        _idToNftItem[tokenId].isListed =false;
        _listedItems.decrement();

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);

    }

    // Generate an NFT Item 
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

    // Before a transfer check to make sure that the token is from owner account[0]
    function _beforeTokenTransfer(  
        address from, 
        address to, 
        uint tokenId
    ) internal virtual override {
        // _beforeTokenTranfer is from the ERC721.sol.
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) { 
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }

        if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    // Add token to all Nfts
    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    // Add token to list of owners
    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        // Retrieve number of NFTs a user owns
        uint length = ERC721.balanceOf(to);
        // Map token to index and and owner 
        _ownedTokens[to][length] = tokenId; // addr => uint(how many) => uint(specific token id)
        _idToOwnedIndex[tokenId] = length;  // uint(how many) => uint(specific token id)
    }

    // @dev 
    // _ownedTokens MAPPING START
    // 0x2C => 0 => 1
    //         1 => 2
    //         2 => 3
    // -----------------------    
    // _idToOwnedIndex MAPPING START
    // ID   INDEX
    // 1 => 0
    // 2 => 1 
    // 3 => 2
        
    // Remove tokens from list of owners
    function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private { 

        uint lastTokenIndex= ERC721.balanceOf(from) -1; // A. 2
        uint tokenIndex = _idToOwnedIndex[tokenId]; // A. 1 

        if (tokenIndex != lastTokenIndex) { 
            uint lastTokenId = _ownedTokens[from][lastTokenIndex]; // 3(id) => 2(last token index)

        // Remapping _ownedTokens
        // 3 is remapped to 2nd index 1:
        // 0 => 1
        // 1 => 3
        
        _ownedTokens[from][tokenIndex] = lastTokenId; 
        
        // Remapping _idToOwnedIndex
        // 3 is remapped to 2nd index 1:
        
        // ID   INDEX
        // 1 => 0
        // 3 => 1

        _idToOwnedIndex[lastTokenId] = tokenIndex;  // 1
        }   
        
        // else delete token id 2 and 
        delete _idToOwnedIndex[tokenId]; // delete id 2 
        delete _ownedTokens[from][lastTokenIndex]; // delete lastTokenIndex => 2
    }
}
