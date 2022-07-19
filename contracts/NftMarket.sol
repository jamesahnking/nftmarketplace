// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
   
    // @dev: For incrementing and decrementing 
    using Counters for Counters.Counter;

    // @dev: This array Stores all nfts
    uint256[] private _allNfts;

    // @dev: Set a listing price for minting the toke
    // @dev: This price can be swapped later by an administrator
    uint public listingPrice = 0.025 ether;

    // @dev: Ths array is an index of array 
    mapping(uint => uint) private _idToNftIndex;

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

    //@dev total supply of Nft's
    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }

    //@dev get a nft by index
    function tokenByIndex(uint index) public view returns (uint){
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        // get total supply
        uint allItemsCounts = totalSupply();
        // start at #1 => 0 
        uint currentIndex = 0;
        // make items a storage container for NFts and their stuff
        NftItem[] memory items = new NftItem[](_listedItems.current());

        // loop through the total supply of of Nfts     
        for (uint i = 0; i < allItemsCounts; i++) {
            /// return the nfts according to id
            uint tokenId = tokenByIndex(i);
            // store the list of nfts inside of item 
            NftItem storage item = _idToNftItem[tokenId];

            // check each item listed if isListed is true = for sale 
            // OR false = not for sale
            if (item.isListed == true) {
                // if so set the current index to the item thats true
                items[currentIndex] = item;
                // add that time/id to the list of isListed items to be returned
                currentIndex += 1;
            }
        }
        // return all items that are isListed as true 
        return items;
    }

    // @dev: _listedItems => how many nfts are for sale on the market 
    // _tokenIds => the total items that have been created from the smart contract. 
    
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    constructor() ERC721("FuzzAlinesNFT", "FZLN") {}
    
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


    // mint token (NFT) - takes token uri and its price 
    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        
        // @dev: require the token to exist
        require(!tokenURIExists(tokenURI), "Token URI already exists");

        // @dev: the user must pay the listing price to mint an NFT
        require(msg.value == listingPrice, "Message value must be equal to the listing price");
        
        // @dev: increment() is a helper
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
   
    // @dev Purchase an NFT from contract
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

    //@dev before transfer check to make sure that the toen is from account 0
    function _beforeTokenTransfer(  
        address from, 
        address to, 
        uint tokenId
    ) internal virtual override {

        // @dev _beforeTokenTranfer is taken from the ERC721 spec.
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        }
    }

    //@dev add token to all Nfts
    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }
}
