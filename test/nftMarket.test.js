// Test intended for use with with Truffle
const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.utils.parseEther("0.3").toString();



    before(async() => {
        _contract = await NftMarket.deployed();
        })

    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        const tokenExists = false;
        before(async()=>{
            await _contract.mintToken(tokenURI, _nftPrice,{
                from: accounts[0]
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
    }) 

})  