// Test intended for use with with Truffle
const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", accounts => {
    let _contract = null;

    before(async() => {
        _contract = await NftMarket.deployed();
        })

    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        before(async()=>{
            await _contract.mintToken(tokenURI,{
                from: accounts[0]
            })
        })

        it("First token owner should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "Owner of token is not mathing address [0]")
         })
    }) 
})  