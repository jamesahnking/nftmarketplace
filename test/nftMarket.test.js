// Test intended for use with with Truffle
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.025").toString();

    before(async() => {
        _contract = await NftMarket.deployed();
        })
// Mint Token Function 
    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        const tokenExists = false;
        
        before(async()=>{
            await _contract.mintToken(tokenURI, _nftPrice,{
                from: accounts[0],
                value: _listingPrice
            })
        })

    it("First token owner should be address[0]", async () => {
        const owner = await _contract.ownerOf(1);
        assert.equal(owner, accounts[0], "Owner of token is not matching address [0]")
        })

        it("First token should point ot the correct tokenURI", async () => {
        const actualTokenURI = await _contract.tokenURI(1);
        assert.equal(actualTokenURI, tokenURI, "tokenURI is not correct" );
        })

        it("First token should exists", async () => {
        const tokenExistence = await _contract.tokenURIExists(1);
        assert.equal(tokenExistence, tokenExists, "The token does exists");
        })

        it("Should not be possible to createa n NFT with a previously used tokenURI", async () => {
        try{
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0]
            })
        } catch(error) {
            assert(error, "NFT was minted with previously used tokenURI");
        }
        })

         it("Should have one listed item", async () => {
            const listedItemCount = await _contract.listedItemCount();
            assert.equal(listedItemCount.toNumber(), 1, "Listed item count is not 1");
   
         })

         it("Should have created an NFT item", async () => {
            const nftItem = await _contract.getNftItem(1);
            assert.equal(nftItem.tokenId, 1, " Tokenid is not 1");
            assert.equal(nftItem.price, _nftPrice, "Nft price not correct");
            assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
            assert.equal(nftItem.isListed, true, "Token is not listed");
         })
    }) 

    // Buy Token Function 
    describe("Buy NFT", () => {
        before(async () => {
            await _contract.buyNft(1, {
                from: accounts[1],
                value: _nftPrice
            })
        })

        it("should unlist ther item", async () => {
            const listedItem = await _contract.getNftItem(1);
            assert.equal(listedItem.isListed, false, "Item is still listed");
        })

        it("should decrement the nft amount in listed Items", async () => {
            const listedItemCount = await _contract.listedItemCount();
            assert.equal(listedItemCount.toNumber(), 0, "Count has not been decremented");
        })

        it("should change owners", async () => {
            const currentOwner = await _contract.ownerOf(1);
            assert.equal(currentOwner, accounts[1], "Item still listed")
        })
    })

    describe("Token Transfers", () => {

        const tokenURI = "https://test-json-test.com"
        before(async()=>{
            await _contract.mintToken(tokenURI, _nftPrice,{
                from: accounts[0],
                value: _listingPrice
            })
        })

        it("should have two NFTs created", async () => {
            const totalSupply = await _contract.totalSupply();
            assert(totalSupply.toNumber(), 2, "Total supply is not correct");
        })

        it("should be able to retreive by index", async () => {
            const nftId1 = await _contract.tokenByIndex(0);
            const nftId2 = await _contract.tokenByIndex(1);

            assert.equal(nftId1.toNumber(), 1, " NFt id is wrong ");
            assert.equal(nftId2.toNumber(), 2, " NFt id is wrong ");
        })

        it("should have one listed NFT", async () => {
            const allNfts = await _contract.getAllNftsOnSale();
            assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
        })
    })
})  